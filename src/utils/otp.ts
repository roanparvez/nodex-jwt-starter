import { IUserDocument } from "../models/user.model.js";
import { ApiError } from "./apiError.js";

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const validateAndClearOTP = async (
  user: IUserDocument
): Promise<void> => {
  if (!user.otp || !user.otpExpires || user.otpExpires.getTime() < Date.now()) {
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    throw new ApiError(400, "OTP has expired");
  }
};
