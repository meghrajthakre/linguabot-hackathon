import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";

import connectDB from './config/db.js';
import rateLimiter from './middleware/rateLimiter.middleware.js';
import errorHandler from './middleware/errorHandler.middleware.js';

import publicRoutes from './routes/public.routes.js'
import authRoutes from './routes/auth.routes.js';
import botsRoutes from './routes/bots.routes.js';
import chatRoutes from './routes/chat.routes.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Connect to MongoDB
connectDB(process.env.MONGO_URI);

// ========== CORS CONFIGURATION ==========
// Allow multiple origins for development
const allowedOrigins = [
  "https://linguabot-xi.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",      // Alternative frontend port
  "http://localhost:8000",      // Another common port
  "http://127.0.0.1:5173",      // IPv4 localhost Vite
  "http://127.0.0.1:5500",      // VS Code Live Server
  "http://127.0.0.1:8000",      // Alternative IPv4
  "http://127.0.0.1:15500",     // Another port
  "http://localhost:15500",     // Another common port
];


app.use(cors({
  origin: [
    "https://linguabot.digital",
    "https://www.linguabot.digital"
  ]
}));


// Middleware
app.use(express.json()); // parse JSON body
app.use(cookieParser());
// app.use(rateLimiter); // global rate limiter

// Register routes
app.use(express.static("public"));
app.use('/api/auth', authRoutes);
app.use('/api/bots', botsRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/public/chat', publicRoutes);

// Global error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`LinguaBot backend running on http://localhost:${PORT}`);
});