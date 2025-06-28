export interface IUser {
  _id: string;
  email: string;
  password: string;
  confirmPassword: string;
  isVerified: boolean;
  otp?: string;
  otpExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordTokenExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
  getAuthToken(): string;
  getResetPasswordToken(): string;
  getOTP(): string;
}
