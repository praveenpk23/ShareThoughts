// import express from "express";
// import mongoose from "mongoose";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import dotenv from "dotenv";
// import connectDB from "./config/db.js";
// import userRoutes from "./routes/userRoutes.js";
// import postRoutes from "./routes/postRoutes.js";
// import likeRoutes from "./routes/likeRoutes.js";
// import contentRoutes from "./routes/contentRoutes.js";
// import commentRoutes from "./routes/commentRoutes.js";
// import AiRoutes from "./routes/AiRoutes.js";
// import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";

// dotenv.config();
// const app = express();
// const router = express.Router();

// // middlewares
// app.use(express.json());
// app.use(cookieParser());
// app.use(express.urlencoded({ extended: true }));

// // Middleware
// const allowOrigin = ["http://localhost:5173", "http://localhost:5174"];
// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin || allowOrigin.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Invalid Origin"));
//       }
//     },
//     credentials: true, // allow cookies & credentials
//   })
// );

// // routes
// app.use("/api/users", userRoutes);
// app.use("/api/posts", postRoutes);
// app.use("/api/likes", likeRoutes);
// app.use("/api/comments", commentRoutes);
// app.use("/api/content", contentRoutes);
// app.use("/api/comments", commentRoutes);
// // app.use("/api/ai", AiRoutes);
// app.use("/api/chats", AiRoutes);
// app.use(notFound);
// app.use(errorHandler);

// // connect to MongoDB
// // top of file: keep dotenv.config() and app setup
// const PORT = process.env.PORT || 5000;

// // wrap start in an async IIFE
// (async () => {
//   try {
//     await connectDB(); // ensure DB connected before accepting requests
//     app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
//   } catch (err) {
//     console.error("Failed to start server:", err);
//     process.exit(1);
//   }
// })();

import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import likeRoutes from "./routes/likeRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import AiRoutes from "./routes/AiRoutes.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";

dotenv.config();

const app = express();

/* -------------------- CORE MIDDLEWARES -------------------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* -------------------- CORS -------------------- */
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
  : ["https://sharethoughts.workfys.in/"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

/* -------------------- ROUTES -------------------- */
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/chats", AiRoutes);

/* -------------------- ERROR HANDLING -------------------- */
app.use(notFound);
app.use(errorHandler);

/* -------------------- SERVER START -------------------- */
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    // Connect to MongoDB before accepting requests
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    /* -------- GRACEFUL SHUTDOWN -------- */
    const shutdown = async () => {
      console.log("🛑 Shutting down server...");
      await mongoose.connection.close();
      server.close(() => process.exit(0));
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
})();
