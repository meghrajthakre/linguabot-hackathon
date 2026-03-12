/**
 * Text Splitter - Chunks text intelligently with overlap
 * Preserves sentences and paragraphs for better context
 */

const CHUNK_SIZE = 800; // characters
const OVERLAP_SIZE = 100; // characters for overlap
const MIN_CHUNK_SIZE = 100; // minimum meaningful chunk

/**
 * Split text into semantic chunks
 * Tries to split on sentence boundaries, then paragraph, then word
 */
export function splitText(text, chunkSize = CHUNK_SIZE, overlap = OVERLAP_SIZE) {
  if (!text || text.trim().length === 0) {
    return [];
  }

  const chunks = [];
  let startIndex = 0;

  // Clean up text
  text = text.trim();

  while (startIndex < text.length) {
    let endIndex = Math.min(startIndex + chunkSize, text.length);

    // If not at end of text, find a good break point
    if (endIndex < text.length) {
      // Try to break at sentence end (. ! ?)
      let sentenceEnd = text.lastIndexOf(".", endIndex);
      let exclamationEnd = text.lastIndexOf("!", endIndex);
      let questionEnd = text.lastIndexOf("?", endIndex);

      const lastPunctuation = Math.max(sentenceEnd, exclamationEnd, questionEnd);

      if (lastPunctuation > startIndex + MIN_CHUNK_SIZE) {
        endIndex = lastPunctuation + 1;
      } else {
        // Fall back to paragraph break
        let paragraphEnd = text.lastIndexOf("\n\n", endIndex);
        if (paragraphEnd > startIndex + MIN_CHUNK_SIZE) {
          endIndex = paragraphEnd;
        } else {
          // Fall back to word boundary
          let spaceEnd = text.lastIndexOf(" ", endIndex);
          if (spaceEnd > startIndex + MIN_CHUNK_SIZE) {
            endIndex = spaceEnd;
          }
        }
      }
    }

    let chunk = text.substring(startIndex, endIndex).trim();

    // Only add meaningful chunks
    if (chunk.length >= MIN_CHUNK_SIZE) {
      chunks.push(chunk);
    }

    // Move to next chunk with overlap
    startIndex = endIndex - overlap;

    // Prevent overlap from being too large
    if (startIndex < 0) {
      startIndex = 0;
    }
  }

  return chunks;
}

/**
 * Split multiple pages into chunks
 * Returns array with metadata
 */
export function chunkPages(pages, chunkSize = CHUNK_SIZE) {
  const chunks = [];
  let globalChunkIndex = 0;

  for (const page of pages) {
    const pageChunks = splitText(page.content, chunkSize);

    pageChunks.forEach((text, localIndex) => {
      chunks.push({
        type: "website",
        text,
        source: page.url,
        chunkIndex: globalChunkIndex,
      });
      globalChunkIndex++;
    });
  }

  return chunks;
}

/**
 * Search chunks by keyword relevance
 * Simple keyword matching (can be upgraded to TF-IDF later)
 */
export function searchChunks(chunks, query, topK = 5) {
  if (!query || !chunks.length) {
    return [];
  }

  const keywords = query
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 3);

  const scored = chunks.map((chunk) => {
    const text = chunk.text.toLowerCase();
    let score = 0;

    // Score based on keyword matches
    for (const keyword of keywords) {
      const matches = (text.match(new RegExp(keyword, "g")) || []).length;
      score += matches;
    }

    // Boost if keywords appear in beginning
    if (keywords.some((kw) => text.startsWith(kw))) {
      score += 5;
    }

    return { chunk, score };
  });

  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((item) => item.chunk);
}

/**
 * Format chunks for AI context
 */
export function formatChunksForContext(chunks) {
  if (!chunks.length) {
    return "";
  }

  return chunks
    .map((chunk, i) => {
      return `[Source: ${new URL(chunk.source).pathname}]\n${chunk.text}`;
    })
    .join("\n\n---\n\n");
}

/**
 * Validate chunk before storing
 */
export function isValidChunk(chunk) {
  if (!chunk.text || typeof chunk.text !== "string") return false;
  if (!chunk.source) return false;
  if (chunk.text.trim().length < MIN_CHUNK_SIZE) return false;
  return true;
}