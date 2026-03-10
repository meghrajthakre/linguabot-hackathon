import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";

import connectDB from './config/db.js';

const app = express();
const PORT = process.env.PORT || 4000;

connectDB(process.env.MONGO_URI);



app.use(
  cors({
    origin: [
        "http://localhost:4000",
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "x-public-key"],
    credentials: true

  })
);
// Middleware
app.use(express.json()); // parse JSON body
app.use(cookieParser());
// app.use(rateLimiter); // global rate limiter

// Register routes
app.use(express.static("public"));
app.use('/api/auth', authRoutes);
app.use('/api/bots', botsRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/public/chat', publicRoutes);

// Global error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 LinguaBot backend running on http://localhost:${PORT}`);
});