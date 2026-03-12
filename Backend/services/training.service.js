import Bot from "../models/Bot.model.js";
import { crawlWebsite } from "../utils/websiteCrawler.js";
import { chunkPages, isValidChunk } from "../utils/textSplitter.js";

const MAX_CHUNKS_PER_BOT = 1000; // Prevent memory explosion
const CHUNK_BATCH_SIZE = 100; // Save in batches

/**
 * Train bot on website
 * This is the main orchestration function
 */
export async function trainBotOnWebsite(botId, websiteUrl) {
  let bot = await Bot.findById(botId);

  if (!bot) {
    throw new Error("Bot not found");
  }

  try {
    // UPDATE THIS: Set training status
    bot.websiteStatus = "training";
    bot.websiteTrainingError = null;
    await bot.save();

    console.log(
      `🚀 Starting training for bot "${bot.name}" on ${websiteUrl}`
    );

    // Step 1: Crawl website
    const pages = await crawlWebsite(websiteUrl);

    if (!pages.length) {
      throw new Error("No pages crawled from website");
    }

    console.log(`✅ Crawled ${pages.length} pages`);

    // Step 2: Chunk pages
    const chunks = chunkPages(pages);
    console.log(`✅ Created ${chunks.length} chunks`);

    if (!chunks.length) {
      throw new Error("No chunks generated");
    }

    // Step 3: Remove old website chunks
    bot.contentChunks = bot.contentChunks.filter(
      (chunk) => chunk.type !== "website"
    );

    // Step 4: Add new chunks with validation
    let validCount = 0;
    for (const chunk of chunks) {
      if (validCount >= MAX_CHUNKS_PER_BOT) {
        console.warn(
          `⚠️  Max chunks (${MAX_CHUNKS_PER_BOT}) reached. Stopping.`
        );
        break;
      }

      if (isValidChunk(chunk)) {
        bot.contentChunks.push(chunk);
        validCount++;
      }
    }

    console.log(`✅ Stored ${validCount} valid chunks`);

    // Step 5: Update bot with success
    bot.website = websiteUrl;
    bot.websiteStatus = "completed";
    bot.websiteLastTrained = new Date();
    bot.websiteTrainingError = null;

    await bot.save();

    console.log(`✅ Training complete for bot "${bot.name}"`);

    return {
      success: true,
      pagesCount: pages.length,
      chunksCount: validCount,
      message: `Trained on ${pages.length} pages with ${validCount} chunks`,
    };
  } catch (error) {
    console.error("❌ Training failed:", error.message);

    // UPDATE THIS: Save error state
    bot.websiteStatus = "failed";
    bot.websiteTrainingError = error.message;
    await bot.save();

    throw error;
  }
}

/**
 * Retrain existing bot (update website chunks)
 */
export async function retrainBotOnWebsite(botId) {
  const bot = await Bot.findById(botId);

  if (!bot || !bot.website) {
    throw new Error("Bot has no website configured");
  }

  return trainBotOnWebsite(botId, bot.website);
}

/**
 * Get training status
 */
export async function getTrainingStatus(botId) {
  const bot = await Bot.findById(botId);

  if (!bot) {
    throw new Error("Bot not found");
  }

  return {
    status: bot.websiteStatus,
    website: bot.website,
    lastTrained: bot.websiteLastTrained,
    error: bot.websiteTrainingError,
    chunkCount: bot.contentChunks.filter((c) => c.type === "website").length,
  };
}

/**
 * Test scraping without saving
 * For validation before full training
 */
export async function testWebsiteScrape(websiteUrl) {
  try {
    console.log(`🧪 Testing website scrape for ${websiteUrl}`);

    const pages = await crawlWebsite(websiteUrl);

    if (!pages.length) {
      return {
        success: false,
        message: "No pages crawled",
      };
    }

    const chunks = chunkPages(pages);

    return {
      success: true,
      pagesFound: pages.length,
      chunksGenerated: chunks.length,
      sampleChunk: chunks[0]?.text.substring(0, 200) + "...",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
}