export const otpEmailTemplate = (otp: string): string => {
  return `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;">
        <h2 style="color: #4A90E2;">OTP Verification Email</h2>
        <p>Hi,</p>
        <p>Your One-Time Password (OTP) is:</p>
        <p style="font-size: 24px; font-weight: bold; color: #2c3e50;">${otp}</p>
        <p>This code will expire in <b>10 minutes</b>. Please enter it in the portal to verify your email.</p>
        <hr />
        <p style="font-size: 12px; color: #777;">If you didn&apos;t request this, you can safely ignore this email.</p>
      </div>
    `;
};

export const resetPasswordEmailTemplate = (resetLink: string) => {
  return `
    <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
      <p>Dear User,</p>

      <p>We received a request to reset the password for your account.</p>

      <p>To proceed, please click the button below to set a new password:</p>

      <p style="text-align: center; margin: 20px 0;">
        <a href="${resetLink}" 
           style="display: inline-block; padding: 12px 20px; background-color: #d32f2f; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
          Reset My Password
        </a>
      </p>

      <p>This link is valid for <strong>10 minutes</strong>. If you did not request a password reset, you can safely ignore this email.</p>

      <p>Best regards</p>
    </div>
  `;
};
