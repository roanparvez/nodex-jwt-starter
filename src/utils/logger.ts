import { createLogger, format, transports } from "winston";
import fs from "fs";
import path from "path";

const { combine, timestamp, printf, colorize, errors } = format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

const logDir = path.resolve("logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logger = createLogger({
  level: "info",
  format: combine(
    timestamp({ format: "HH:mm:ss DD-MM-YYYY" }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    process.env.NODE_ENV === "development"
      ? new transports.Console({ format: combine(colorize(), logFormat) })
      : new transports.File({ filename: `${logDir}/combined.log` }),
    new transports.File({ filename: `${logDir}/error.log`, level: "error" }),
  ],
  exitOnError: false,
});

export default logger;
