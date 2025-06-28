import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import morgan from "morgan";

import { ENV } from "./config/env.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import security from "./middlewares/security.js";
import auth from "./routes/auth.route.js";
import user from "./routes/user.route.js";
import logger from "./utils/logger.js";

const app = express();

app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
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

app.use("/api/v1/auth", auth);
app.use("/api/v1/users", user);

app.use(errorHandler);

export default app;
