import nodemailer from "nodemailer";

import { ENV } from "../config/env.js";
import { otpEmailTemplate } from "../templates/emailTemplate.js";

export const sendOTP = async (email: string, otp: string) => {
  const transporter = nodemailer.createTransport({
    service: ENV.SMTP_SERVICE,
    auth: {
      user: ENV.SMTP_USER,
      pass: ENV.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `<${ENV.SMTP_USER}>`,
    to: email,
    subject: "Account Verification OTP",
    html: otpEmailTemplate(otp),
  };

  await transporter.sendMail(mailOptions);
};

export const sendLink = async (
  email: string,
  emailTemplate: (link: string) => string,
  link: string
): Promise<void> => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: ENV.SMTP_USER,
      pass: ENV.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `<${ENV.SMTP_USER}>`,
    to: email,
    subject: "Reset Password Link",
    html: emailTemplate(link),
  };

  await transporter.sendMail(mailOptions);
};
