import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    botId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bot",
      required: true,
      index: true,
    },

    userMessage: {
      type: String,
      required: true,
      trim: true,
    },

    aiMessage: {
      type: String,
      required: true,
      trim: true,
    },

    // Intent Detection
    intent: {
      type: String,
      enum: [
        "shipping",
        "returns",
        "pricing",
        "account",
        "product",
        "hours",
        "technical",
        "contact",
        "appointment",
        "order_status",
        "general",
      ],
      default: "general",
      index: true,
    },

    // Performance Metrics
    responseTimeMs: {
      type: Number,
      default: 0,
    },

    // Quality Metrics
    metadata: {
      businessType: String, // From bot
      messageLength: Number,
      responseLength: Number,
      hasActionStep: Boolean, // Does response include actionable steps
      mentionsWebsite: Boolean, // Does response mention website
      mentionsContact: Boolean, // Does response mention contact info
      userLanguage: String, // Language setting from bot
    },

    // User Feedback (Optional)
    feedback: {
      helpful: Boolean, // Was the response helpful?
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      comment: String, // User comment
      feedbackAt: Date, // When feedback was given
    },

    // Escalation
    escalated: {
      type: Boolean,
      default: false,
    },

    escalationReason: {
      type: String,
      enum: [
        "not_resolved",
        "user_request",
        "out_of_scope",
        "urgent",
        "complex",
      ],
    },

    assignedAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Session Information
    sessionId: {
      type: String, // For tracking multiple messages in same session
    },

    userId: {
      type: String, // Anonymous user ID if available
    },
  },
  { timestamps: true }
);

// Indexes for common queries
conversationSchema.index({ botId: 1, createdAt: -1 });
conversationSchema.index({ botId: 1, intent: 1 });
conversationSchema.index({ botId: 1, "metadata.businessType": 1 });
conversationSchema.index({ sessionId: 1 });

// Aggregate statistics
conversationSchema.statics.getIntentStats = async function(botId) {
  return this.aggregate([
    { $match: { botId: new mongoose.Types.ObjectId(botId) } },
    {
      $group: {
        _id: "$intent",
        count: { $sum: 1 },
        avgResponseTime: { $avg: "$responseTimeMs" },
      },
    },
    { $sort: { count: -1 } },
  ]);
};

conversationSchema.statics.getResolutionRate = async function(botId) {
  const total = await this.countDocuments({ botId });
  const escalated = await this.countDocuments({
    botId,
    escalated: true,
  });

  return {
    total,
    escalated,
    resolved: total - escalated,
    resolutionRate: total > 0 ? ((total - escalated) / total) * 100 : 0,
  };
};

conversationSchema.statics.getAverageSatisfaction = async function(botId) {
  const result = await this.aggregate([
    {
      $match: {
        botId: new mongoose.Types.ObjectId(botId),
        "feedback.rating": { $exists: true },
      },
    },
    {
      $group: {
        _id: null,
        avgRating: { $avg: "$feedback.rating" },
        totalRatings: { $sum: 1 },
      },
    },
  ]);

  return result.length > 0
    ? {
        averageRating: result[0].avgRating,
        totalRatings: result[0].totalRatings,
      }
    : {
        averageRating: 0,
        totalRatings: 0,
      };
};

conversationSchema.statics.getPerformanceMetrics = async function(botId, days = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const result = await this.aggregate([
    {
      $match: {
        botId: new mongoose.Types.ObjectId(botId),
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: null,
        totalConversations: { $sum: 1 },
        avgResponseTime: { $avg: "$responseTimeMs" },
        minResponseTime: { $min: "$responseTimeMs" },
        maxResponseTime: { $max: "$responseTimeMs" },
        helpfulCount: {
          $sum: {
            $cond: ["$feedback.helpful", 1, 0],
          },
        },
        escalationCount: {
          $sum: {
            $cond: ["$escalated", 1, 0],
          },
        },
      },
    },
  ]);

  if (result.length === 0) {
    return {
      totalConversations: 0,
      avgResponseTime: 0,
      minResponseTime: 0,
      maxResponseTime: 0,
      helpfulRate: 0,
      escalationRate: 0,
    };
  }

  const data = result[0];
  return {
    totalConversations: data.totalConversations,
    avgResponseTime: Math.round(data.avgResponseTime),
    minResponseTime: data.minResponseTime,
    maxResponseTime: data.maxResponseTime,
    helpfulRate:
      data.totalConversations > 0
        ? ((data.helpfulCount / data.totalConversations) * 100).toFixed(2)
        : 0,
    escalationRate:
      data.totalConversations > 0
        ? ((data.escalationCount / data.totalConversations) * 100).toFixed(2)
        : 0,
  };
};

export default mongoose.model("Conversation", conversationSchema);