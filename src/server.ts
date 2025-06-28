import mongoose from "mongoose";

import app from "./app.js";
import { connectDB } from "./config/db.js";
import { ENV } from "./config/env.js";
import logger from "./utils/logger.js";

// Handle Uncaught Exceptions
process.on("uncaughtException", (err) => {
  logger.error(`Error: ${err.message}`);
  logger.error("Shutting down the server due to Uncaught Exception.");
  process.exit(1);
});

const port = ENV.PORT || 3000;

let server: ReturnType<typeof app.listen>;

const startServer = async () => {
  try {
    await connectDB();
    server = app.listen(port, () => {
      logger.info(`Server running on http://localhost:${port}`);
    });
  } catch (err) {
    logger.error("Failed to connect to database:", err);
    process.exit(1);
  }
};

await startServer();

// Handle Unhandled Promise Rejections
process.on("unhandledRejection", (err) => {
  if (server) {
    server.close(() => {
      logger.info("Server closed due to unhandled rejection.");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// Handle Graceful Shutdown
const shutdown = async (signal: NodeJS.Signals) => {
  logger.info(`Received ${signal}. Initiating graceful shutdown.`);

  try {
    await mongoose.connection.close();
    logger.info("MongoDB connection closed.");
  } catch (err) {
    logger.error("Error closing MongoDB connection:", err);
  }

  if (server) {
    server.close(() => {
      logger.info("Server closed.");
      process.exit(0);
    });

    setTimeout(() => {
      logger.warn("Force exiting after 10 seconds.");
      process.exit(1);
    }, 10000);
  }
};

process.on("SIGINT", shutdown); // e.g. Ctrl+C
process.on("SIGTERM", shutdown); // e.g. from Docker or hosting provider
