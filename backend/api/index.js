const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
const connectDB = require("./database/mongodb");

// Routes
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const adminAuthRouter = require("./routes/adminAuthRouter");
const listingRouter = require("./routes/listingRouter");
const uploadRouter = require("./routes/uploadRouter");
const bidRouter = require("./routes/bidRouter");

// Middleware
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      "http://localhost:5173", // For local development
    ],
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/listings", listingRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/adminAuth", adminAuthRouter);
app.use("/api/bid", bidRouter);

// Health check endpoint
app.get("/api", (req, res) => {
  res.json({ status: "API is healthy" });
});

// Test endpoint
app.get("/test", (req, res) => {
  res.json({ status: "Test successful", timestamp: new Date() });
});

// Vercel requires module.exports for serverless functions
module.exports = async (req, res) => {
  // Connect to DB on cold start
  if (!global.dbConnected) {
    try {
      await connectDB();
      global.dbConnected = true;
      console.log("Database connected successfully");
    } catch (err) {
      console.error("Database connection failed:", err);
      return res.status(500).json({ error: "Database connection failed" });
    }
  }

  // Pass request to Express
  return app(req, res);
};

// Local development server
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  connectDB()
    .then(() => {
      console.log("Database connected successfully.");
      app.listen(PORT, () => {
        console.log(`server running on port: ${PORT}`);
      });
    })
    .catch((err) => {
      console.error("Database connection failed:", err);
    });
}
