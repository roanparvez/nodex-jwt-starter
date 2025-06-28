import { NextFunction, Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";

import { ENV } from "../config/env.js";
import User from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncErrorHandler } from "./asyncErrorHandler.js";

export const isAuthenticatedUser = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authToken =
      req.cookies?.aulg || req.headers.authorization?.split(" ")[1];

    if (!authToken) {
      return next(
        new ApiError(
          401,
          "Unauthorized: Please log in to access this resource."
        )
      );
    }

    const decodedData = jwt.verify(authToken, ENV.JWT_SECRET as Secret) as {
      id: string;
      email: string;
    };

    const user = await User.findById(decodedData.id);

    if (!user) {
      return next(new ApiError(401, "User not found."));
    }

    req.user = user;
    next();
  }
);
