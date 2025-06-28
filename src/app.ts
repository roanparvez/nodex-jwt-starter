import express from "express";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import security from "./middlewares/security.js";
import { ENV } from "./config/env.js";
import logger from "./utils/logger.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(express.json({ limit: "10kb" }));
app.use(
  cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
  })
);

if (ENV.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(
    morgan("combined", {
      stream: {
        write: (message) => logger.info(message.trim()),
      },
    })
  );
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);
app.use(security);

app.use(errorHandler);

export default app;
