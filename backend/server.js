import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import { notFound , errorHandler } from './middlewares/errorMiddleware.js';
dotenv.config();
const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// only allow CORS from localhost:5317
app.use(
  cors({
    origin: 'http://localhost:5317',
    credentials: true,
  })
);

// routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use(notFound);
app.use(errorHandler);

// connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

