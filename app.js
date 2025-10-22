const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const { swaggerUi, swaggerSpec } = require("./config/swagger");

// Import routes
const scraperRoutes = require("./routes/scraper");

const app = express();

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());

// Swagger docs
app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/v1/scraper", scraperRoutes);

/**
 * @swagger
 * /api/v1/health:
 *   get:
 *     summary: Health check endpoint
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *          success:
 *            type: boolean
 *            example: true
 */
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

module.exports = app;
