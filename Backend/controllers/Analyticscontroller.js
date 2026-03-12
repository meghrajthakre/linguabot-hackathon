/**
 * Analytics Controller (ES6 Modules)
 * Handles all analytics queries with MongoDB aggregation pipelines
 * Production-grade with error handling and performance optimization
 */

import Conversation from "../models/Conversation.model.js";
import Bot from "../models/Bot.model.js";

/**
 * Get comprehensive analytics for logged-in user's bots
 * @route GET /api/analytics
 * @param {Object} req - Express request object (req.user should contain authenticated user)
 * @param {Object} res - Express response object
 */
export const getAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1️⃣ Get all user's bots (for authorization and metrics)
    const userBots = await Bot.find({ owner: userId }).select("_id isActive");

    if (userBots.length === 0) {
      return res.status(200).json({
        totalBots: 0,
        totalConversations: 0,
        activeBots: 0,
        averageResponseTime: 0,
        messagesPerDay: [],
        topQuestions: [],
        recentConversations: [],
      });
    }

    const botIds = userBots.map((bot) => bot._id);
    const activeBots = userBots.filter((bot) => bot.isActive).length;

    // 2️⃣ Parallel queries for better performance
    const [
      totalConversations,
      averageResponseTime,
      messagesPerDay,
      topQuestions,
      recentConversations,
    ] = await Promise.all([
      getTotalConversations(botIds),
      getAverageResponseTime(botIds),
      getMessagesPerDay(botIds),
      getTopQuestions(botIds),
      getRecentConversations(botIds),
    ]);

    return res.status(200).json({
      totalBots: userBots.length,
      totalConversations,
      activeBots,
      averageResponseTime: Math.round(averageResponseTime),
      messagesPerDay,
      topQuestions,
      recentConversations,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return res.status(500).json({
      error: "Failed to fetch analytics",
      message: error.message,
    });
  }
};

/**
 * Get total conversation count
 * @param {Array} botIds - Array of bot IDs to query
 * @returns {Promise<Number>}
 */
async function getTotalConversations(botIds) {
  const result = await Conversation.countDocuments({ botId: { $in: botIds } });
  return result;
}

/**
 * Get average response time across all conversations
 * @param {Array} botIds - Array of bot IDs to query
 * @returns {Promise<Number>}
 */
async function getAverageResponseTime(botIds) {
  const result = await Conversation.aggregate([
    {
      $match: {
        botId: { $in: botIds },
        responseTimeMs: { $exists: true, $type: "number" },
      },
    },
    {
      $group: {
        _id: null,
        avgResponseTime: { $avg: "$responseTimeMs" },
      },
    },
  ]);

  return result.length > 0 ? result[0].avgResponseTime : 0;
}

/**
 * Get messages per day for the last 7 days
 * @param {Array} botIds - Array of bot IDs to query
 * @returns {Promise<Array>}
 */
async function getMessagesPerDay(botIds) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const result = await Conversation.aggregate([
    {
      $match: {
        botId: { $in: botIds },
        timestamp: { $gte: sevenDaysAgo },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
    {
      $project: {
        _id: 0,
        date: "$_id",
        count: 1,
      },
    },
  ]);

  // Fill in missing days with 0
  return fillMissingDays(result, 7);
}

/**
 * Get top 5 most common questions
 * @param {Array} botIds - Array of bot IDs to query
 * @returns {Promise<Array>}
 */
async function getTopQuestions(botIds) {
  const result = await Conversation.aggregate([
    {
      $match: {
        botId: { $in: botIds },
        userMessage: { $exists: true, $ne: "" },
      },
    },
    {
      $group: {
        _id: "$userMessage",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
    {
      $limit: 5,
    },
    {
      $project: {
        _id: 0,
        question: "$_id",
        count: 1,
      },
    },
  ]);

  return result;
}

/**
 * Get latest 10 conversations with bot details
 * @param {Array} botIds - Array of bot IDs to query
 * @returns {Promise<Array>}
 */
async function getRecentConversations(botIds) {
  const result = await Conversation.aggregate([
    {
      $match: {
        botId: { $in: botIds },
      },
    },
    {
      $lookup: {
        from: "bots",
        localField: "botId",
        foreignField: "_id",
        as: "botDetails",
      },
    },
    {
      $unwind: "$botDetails",
    },
    {
      $sort: { timestamp: -1 },
    },
    {
      $limit: 10,
    },
    {
      $project: {
        _id: 1,
        userMessage: 1,
        aiMessage: 1,
        responseTimeMs: 1,
        timestamp: 1,
        botName: "$botDetails.name",
        botId: 1,
      },
    },
  ]);

  return result;
}

/**
 * Helper function to fill missing days in time series data
 * @param {Array} data - Array of {date, count} objects
 * @param {Number} days - Number of days to cover
 * @returns {Array}
 */
function fillMissingDays(data, days) {
  const result = [];
  const dates = new Set(data.map((d) => d.date));

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    const existing = data.find((d) => d.date === dateStr);
    result.push({
      date: dateStr,
      count: existing ? existing.count : 0,
    });
  }

  return result;
}

/**
 * Get analytics for a specific bot
 * @route GET /api/analytics/bot/:botId
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getBotAnalytics = async (req, res) => {
  try {
    const { botId } = req.params;
    const userId = req.user._id;

    // Verify bot ownership
    const bot = await Bot.findOne({ _id: botId, owner: userId });
    if (!bot) {
      return res.status(404).json({ error: "Bot not found" });
    }

    const [totalConversations, averageResponseTime, messagesPerDay] =
      await Promise.all([
        Conversation.countDocuments({ botId }),
        Conversation.aggregate([
          {
            $match: {
              botId: bot._id,
              responseTimeMs: { $exists: true, $type: "number" },
            },
          },
          {
            $group: {
              _id: null,
              avgResponseTime: { $avg: "$responseTimeMs" },
            },
          },
        ]),
        getMessagesPerDay([bot._id]),
      ]);

    res.status(200).json({
      botId: bot._id,
      botName: bot.name,
      totalConversations,
      averageResponseTime:
        averageResponseTime.length > 0
          ? Math.round(averageResponseTime[0].avgResponseTime)
          : 0,
      messagesPerDay,
      isActive: bot.isActive,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Bot analytics error:", error);
    res.status(500).json({
      error: "Failed to fetch bot analytics",
      message: error.message,
    });
  }
};

/**
 * Export analytics data (CSV)
 * @route GET /api/analytics/export
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const exportAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    const userBots = await Bot.find({ owner: userId }).select("_id");
    const botIds = userBots.map((bot) => bot._id);

    const conversations = await Conversation.find({ botId: { $in: botIds } })
      .select("userMessage aiMessage responseTimeMs timestamp botId")
      .lean();

    // Convert to CSV
    const headers = [
      "Timestamp",
      "Bot ID",
      "User Message",
      "Response Time (ms)",
    ];
    const rows = conversations.map((c) => [
      new Date(c.timestamp).toISOString(),
      c.botId,
      `"${c.userMessage.replace(/"/g, '""')}"`,
      c.responseTimeMs || 0,
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join(
      "\n"
    );

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="linguabot-analytics.csv"'
    );
    res.send(csv);
  } catch (error) {
    console.error("Export analytics error:", error);
    res.status(500).json({
      error: "Failed to export analytics",
      message: error.message,
    });
  }
};