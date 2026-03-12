import axios from "axios";
import { JSDOM } from "jsdom";

// Safety limits
const CRAWL_TIMEOUT = 10000; // 10 seconds
const MAX_PAGES = 8;
const MAX_CONTENT_SIZE = 150000; // 150 KB
const EXCLUDED_PATTERNS = [
  "/admin",
  "/login",
  "/auth",
  "/user/",
  "/account",
  "/search",
  ".pdf",
  ".jpg",
  ".png",
  ".zip",
];

/**
 * Validate and normalize URL
 */
function normalizeUrl(url) {
  if (!url) throw new Error("URL is required");

  let normalized = url.trim();
  if (!normalized.startsWith("http://") && !normalized.startsWith("https://")) {
    normalized = "https://" + normalized;
  }

  try {
    const urlObj = new URL(normalized);
    return urlObj.origin;
  } catch (e) {
    throw new Error(`Invalid URL: ${url}`);
  }
}

/**
 * Check if URL should be crawled
 */
function shouldCrawlUrl(url, baseUrl) {
  try {
    const urlObj = new URL(url, baseUrl);

    // Same domain only
    if (!urlObj.href.startsWith(baseUrl)) {
      return false;
    }

    // Exclude patterns
    const href = urlObj.href.toLowerCase();
    for (const pattern of EXCLUDED_PATTERNS) {
      if (href.includes(pattern)) return false;
    }

    // No fragments or query params that create loops
    if (href.includes("#")) return false;

    return true;
  } catch {
    return false;
  }
}

/**
 * Clean HTML and extract readable text
 */
function extractCleanText(html) {
  try {
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // Remove script, style, and other non-content elements
    [
      "script",
      "style",
      "nav",
      "footer",
      "noscript",
      "meta",
      "link",
      "head",
    ].forEach((tag) => {
      document.querySelectorAll(tag).forEach((el) => el.remove());
    });

    // Get text content
    let text = document.body.textContent || "";

    // Clean whitespace
    text = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .join("\n");

    // Remove multiple consecutive newlines
    text = text.replace(/\n{3,}/g, "\n\n");

    return text;
  } catch (error) {
    console.error("Text extraction error:", error);
    return "";
  }
}

/**
 * Fetch a single page with timeout
 */
async function fetchPage(url) {
  try {
    const response = await axios.get(url, {
      timeout: CRAWL_TIMEOUT,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; BotTrainer/1.0; +http://example.com/bot)",
      },
      maxRedirects: 3,
    });

    const contentType = response.headers["content-type"] || "";
    if (!contentType.includes("text/html")) {
      return null;
    }

    return response.data;
  } catch (error) {
    if (error.code === "ECONNABORTED") {
      console.warn(`⏱ Timeout fetching ${url}`);
    } else {
      console.warn(`Failed to fetch ${url}:`, error.message);
    }
    return null;
  }
}

/**
 * Get all internal links from page
 */
function extractLinks(html, baseUrl) {
  try {
    const dom = new JSDOM(html, { url: baseUrl });
    const document = dom.window.document;
    const links = new Set();

    document.querySelectorAll("a[href]").forEach((link) => {
      try {
        const href = link.getAttribute("href");
        if (href && shouldCrawlUrl(href, baseUrl)) {
          const absoluteUrl = new URL(href, baseUrl).href;
          links.add(absoluteUrl);
        }
      } catch {
        // Skip invalid URLs
      }
    });

    return Array.from(links);
  } catch (error) {
    console.error("Link extraction error:", error);
    return [];
  }
}

/**
 * Main crawler function - BFS crawl with limits
 */
export async function crawlWebsite(url) {
  const baseUrl = normalizeUrl(url);
  const visited = new Set();
  const toVisit = [baseUrl];
  const pages = [];
  let totalSize = 0;

  console.log(`🕷️  Starting crawl of ${baseUrl}`);

  while (toVisit.length > 0 && pages.length < MAX_PAGES) {
    const currentUrl = toVisit.shift();

    if (visited.has(currentUrl)) continue;
    visited.add(currentUrl);

    console.log(
      `📄 Crawling [${pages.length + 1}/${MAX_PAGES}]: ${currentUrl}`
    );

    const html = await fetchPage(currentUrl);
    if (!html) continue;

    const cleanText = extractCleanText(html);
    if (!cleanText || cleanText.trim().length === 0) continue;

    totalSize += cleanText.length;

    // Safety check: stop if content gets too large
    if (totalSize > MAX_CONTENT_SIZE) {
      console.warn(`⚠️  Max content size reached. Stopping crawl.`);
      break;
    }

    pages.push({
      url: currentUrl,
      content: cleanText,
    });

    // Add new links to queue
    const links = extractLinks(html, baseUrl);
    for (const link of links) {
      if (!visited.has(link) && toVisit.length < MAX_PAGES * 2) {
        toVisit.push(link);
      }
    }
  }

  console.log(`✅ Crawl complete: ${pages.length} pages, ${totalSize} chars`);

  return pages;
}

/**
 * Quick single-page fetch (for testing)
 */
export async function fetchSinglePage(url) {
  const html = await fetchPage(url);
  if (!html) return null;

  return {
    url: normalizeUrl(url),
    content: extractCleanText(html),
  };
}