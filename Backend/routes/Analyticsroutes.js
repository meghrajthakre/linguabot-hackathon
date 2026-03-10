/**
 * Analytics Routes (ES6 Modules)
 * Protected routes for analytics endpoints
 * All routes require authentication
 */

import express from "express";
import * as analyticsController from "../controllers/Analyticscontroller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * GET /api/analytics
 * Get comprehensive analytics for all user's bots
 * Returns: Overview metrics, charts data, top questions, recent conversations
 */
router.get("/", authMiddleware, analyticsController.getAnalytics);

/**
 * GET /api/analytics/bot/:botId
 * Get detailed analytics for a specific bot
 * Returns: Bot-specific metrics and performance data
 */
router.get("/bot/:botId", authMiddleware, analyticsController.getBotAnalytics);

/**
 * GET /api/analytics/export
 * Export analytics data as CSV
 * Returns: CSV file download
 */
router.get("/export", authMiddleware, analyticsController.exportAnalytics);

export default router;

