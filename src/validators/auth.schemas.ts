import { z } from "zod";

export const registerSchema = z
  .object({
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email format"),
    password: z
      .string({ required_error: "Password is required" })
      .min(8, "Password must be at least 8 characters long"),
    confirmPassword: z
      .string({ required_error: "Confirm Password is required" })
      .min(8, "Confirm Password must be at least 8 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const verifyOtpSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email format"),
  otp: z
    .string({ required_error: "OTP is required" })
    .length(6, "OTP must be exactly 6 characters long"),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email format"),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters long"),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email format"),
});

export const resetPasswordBodySchema = z.object({
  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters long"),
  confirmPassword: z
    .string({ required_error: "Confirm Password is required" })
    .min(8, "Confirm Password must be at least 8 characters long"),
});

export const resetPasswordParamsSchema = z.object({
  token: z
    .string({ required_error: "Invalid or expired token" })
    .min(1, "Reset token is required"),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
export type VerifyOtpSchema = z.infer<typeof verifyOtpSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordSchema = z.infer<typeof resetPasswordBodySchema>;
