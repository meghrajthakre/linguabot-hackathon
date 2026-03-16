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
const allowedOrigins = [
  "https://linguabot.digital",
  "https://www.linguabot.digital",
  "https://linguabot-xi.vercel.app",
  "http://localhost:5173"
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null,true);

    if(allowedOrigins.includes(origin)){
      callback(null,true);
    }else{
      callback(new Error("CORS not allowed"));
    }
  },
  credentials:true,
  methods:["GET","POST","PUT","DELETE"],
  allowedHeaders:["Content-Type","Authorization"]
}));


// Middleware
app.use(express.json()); // parse JSON body
app.use(cookieParser());
app.options("*",cors());
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