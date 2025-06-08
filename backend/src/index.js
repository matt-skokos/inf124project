require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db"); // your Firestore wrapper
const authMiddleware = require("./middleware/auth");
const userRouter = require("./routes/user");
const locationRouter = require("./routes/location");
const conditionsRouter = require("./routes/conditions");
const notificationsRouter = require("./routes/notifications");

const app = express();

// IMPORTANT: CORS setup must come before any route handlers
// Use a more permissive CORS configuration for development
app.use(
  cors({
    origin: "*", // Allow all origins in development
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

app.use(express.json());

// Request logging for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Health check
app.get("/api/health-check", (req, res) => {
  res.status(200).json({ status: "OK", message: "Health Check: OK" });
});

// Simple test route at root level
app.get("/api/test", (req, res) => {
  res.status(200).json({ message: "API root test endpoint working" });
});

// Core routes
console.log("Registering routes...");
app.use("/api/users", userRouter);
app.use("/api/location", locationRouter);
app.use("/api/conditions", conditionsRouter);
app.use("/api/notifications", notificationsRouter);
console.log("Routes registered");

// Catch-all for 404s
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.url}`);
  res.status(404).json({ error: "Route not found" });
});

const PORT = parseInt(process.env.PORT, 10) || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Test API at: http://localhost:${PORT}/api/test`);
});
