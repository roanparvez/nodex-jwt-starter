import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import mongoose, { Document, Schema } from "mongoose";

import { ENV } from "../config/env.js";
import { IUser, IUserMethods } from "../types/user.types.js";
import { generateOTP } from "../utils/otp.js";

export type IUserDocument = IUser & IUserMethods & Document;

const userSchema = new Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v: string) {
          return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v);
        },
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlen: [8, "Password must be at least 8 characters long"],
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      select: false,
    },
    otpExpires: {
      type: Date,
      select: false,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordTokenExpires: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Hash the password before saving
userSchema.pre<IUserDocument>("save", async function (next) {
  // Only hash the password if it has been modified or is new
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  return next();
});

// Verify password method
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token method
userSchema.methods.getAuthToken = function (): string {
  const token = jwt.sign(
    {
      id: this._id,
      email: this.email,
    },
    ENV.JWT_SECRET as Secret,
    {
      expiresIn: ENV.JWT_EXPIRE,
      algorithm: "HS256",
    } as SignOptions
  );
  return token;
};

// Generate Reset Password Token
userSchema.methods.getResetPasswordToken = function (): string {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordTokenExpires = new Date(Date.now() + 10 * 60 * 1000);
  return resetToken;
};

// Generate OTP
userSchema.methods.getOTP = function (): string {
  const otp = generateOTP();
  this.otp = crypto.createHash("sha256").update(otp).digest("hex");
  this.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
  return otp;
};

// User schema indexes
userSchema.index({ resetPasswordToken: 1 });
userSchema.index({ otp: 1 });

const User = mongoose.model("User", userSchema);

export type UserDocument = mongoose.InferSchemaType<typeof userSchema>;

export default User;
