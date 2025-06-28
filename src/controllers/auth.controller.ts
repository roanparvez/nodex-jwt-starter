import crypto from "crypto";
import { NextFunction, Request, Response } from "express";
import { id } from "zod/v4/locales";

import { ENV } from "../config/env.js";
import { asyncErrorHandler } from "../middlewares/asyncErrorHandler.js";
import User from "../models/user.model.js";
import { resetPasswordEmailTemplate } from "../templates/emailTemplate.js";
import { ApiError } from "../utils/apiError.js";
import { clearCookie, setCookie } from "../utils/cookies.js";
import { sendLink, sendOTP } from "../utils/emails.js";
import { validateAndClearOTP } from "../utils/otp.js";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordBodySchema,
  resetPasswordParamsSchema,
  verifyOtpSchema,
} from "../validators/auth.schemas.js";

export const register = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
      return next(new ApiError(400, parsed.error.errors[0].message));
    }
    const { email, password } = parsed.data;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return next(new ApiError(400, "User already exists"));
    }

    const newUser = new User({
      email,
      password,
    });

    const otp = newUser.getOTP();
    await newUser.save({ validateBeforeSave: false });

    await sendOTP(email, otp);

    res.status(201).json({
      success: true,
      message: "An verification OTP has been sent to your email.",
    });
  }
);

export const verifyOtp = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const parsed = verifyOtpSchema.safeParse(req.body);

    if (!parsed.success) {
      return next(new ApiError(400, parsed.error.errors[0].message));
    }
    const { email, otp } = parsed.data;

    const user = await User.findOne({ email }).select("+otp +otpExpires");

    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    await validateAndClearOTP(user);

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    const isOtpValid = user.otp === hashedOtp;
    if (!isOtpValid) {
      return next(new ApiError(400, "Invalid OTP. Please try again."));
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const authToken = user.getAuthToken();
    setCookie(res, "aulg", authToken);

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      user,
    });
  }
);

export const login = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      return next(new ApiError(400, parsed.error.errors[0].message));
    }
    const { email, password } = parsed.data;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    if (!user.isVerified) {
      return next(
        new ApiError(
          403,
          "User is not verified. Please verify your email first."
        )
      );
    }

    const isPassMatch = await user.comparePassword(password);
    if (!isPassMatch) {
      return next(new ApiError(401, "Invalid email or password"));
    }

    const authToken = user.getAuthToken();
    setCookie(res, "aulg", authToken);

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        id: user._id,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  }
);

export const logout = asyncErrorHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    clearCookie(res, "aulg");
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  }
);

export const forgotPassword = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const parsed = forgotPasswordSchema.safeParse(req.body);

    if (!parsed.success) {
      return next(new ApiError(400, parsed.error.errors[0].message));
    }
    const { email } = parsed.data;

    const user = await User.findOne({ email }).select(
      "+resetPasswordToken +resetPasswordTokenExpires"
    );

    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    if (!user.isVerified) {
      return next(
        new ApiError(
          403,
          "User is not verified. Please verify your email first."
        )
      );
    }

    if (
      user.resetPasswordToken &&
      user.resetPasswordTokenExpires &&
      user.resetPasswordTokenExpires > new Date()
    ) {
      return next(
        new ApiError(
          400,
          "A password reset request is already in progress. Please check your email for the reset link."
        )
      );
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetLink = `${ENV.CLIENT_URL}/password/reset/${resetToken}`;

    await sendLink(email, resetPasswordEmailTemplate, resetLink);

    res.status(200).json({
      message: `A password reset link has been sent to ${user.email}. Please check your inbox to proceed.`,
    });
  }
);

export const resetPassword = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const parsedBody = resetPasswordBodySchema.safeParse(req.body);
    const parsedParams = resetPasswordParamsSchema.safeParse(req.params);

    if (!parsedBody.success || !parsedParams.success) {
      return next(new ApiError(400, "Invalid request data"));
    }

    const { password } = parsedBody.data;
    const { token } = parsedParams.data;

    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      return next(new ApiError(404, "Invalid or expired reset token"));
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password has been reset successfully",
    });
  }
);
