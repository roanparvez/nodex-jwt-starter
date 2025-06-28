import mongoose from "mongoose";

import logger from "../utils/logger.js";
import { ENV } from "./env.js";

export const connectDB = async () => {
  await mongoose
    .connect(ENV.MONGO_URI)
    .then((data) =>
      logger.info(`MongoDB connected to: ${data.connection.host}`)
    );
};
