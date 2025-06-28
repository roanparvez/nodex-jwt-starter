import { NextFunction, Request, Response } from "express";

import { asyncErrorHandler } from "../middlewares/asyncErrorHandler.js";
import User from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";

export const getUserDetails = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = await User.findById(req.user?.id);

    res.status(200).json({
      success: true,
      user,
    });
  }
);

export const updatePassword = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = await User.findById(req.user?.id).select("+password");

    if (!user) {
      return next(new Error("User not found"));
    }

    const isPassMatch = await user.comparePassword(req.body.oldPassword);

    if (!isPassMatch) {
      return next(new ApiError(400, "Old password is incorrect"));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
      return next(new ApiError(400, "Passwords does not match"));
    }

    user.password = req.body.newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  }
);

export const updateProfile = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const newUserData = {
      email: req.body.email,
    };

    const user = await User.findByIdAndUpdate(req.user?.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  }
);
