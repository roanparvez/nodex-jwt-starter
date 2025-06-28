import dotenv from "dotenv";
dotenv.config();

function getEnvVariable(key: string, required = true): string {
  const value = process.env[key];
  if (required && !value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value!;
}

export const ENV = {
  MONGO_URI: getEnvVariable("MONGO_URI"),
  JWT_SECRET: getEnvVariable("JWT_SECRET"),

  PORT: getEnvVariable("PORT", false) || "5000",
  NODE_ENV: getEnvVariable("NODE_ENV", false) || "development",
  CLIENT_URL: getEnvVariable("CLIENT_URL", false) || "http://localhost:3000",

  JWT_EXPIRE: getEnvVariable("JWT_EXPIRE", false) || "2d",
  COOKIE_EXPIRE: getEnvVariable("COOKIE_EXPIRE", false) || "2",
  EXPIRE_TIME: getEnvVariable("EXPIRE_TIME", false) || "10",

  SMTP_USER: getEnvVariable("SMTP_USER"),
  SMTP_PASS: getEnvVariable("SMTP_PASS"),
  SMTP_SERVICE: getEnvVariable("SMTP_SERVICE", false) || "gmail",
  SMTP_HOST: getEnvVariable("SMTP_HOST", false) || "smtp.gmail.com",
  SMTP_PORT: getEnvVariable("SMTP_PORT", false) || "587",
};
