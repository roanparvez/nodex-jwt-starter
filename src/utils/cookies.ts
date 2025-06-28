import { Response } from "express";

import { ENV } from "../config/env.js";

export const setCookie = (res: Response, name: string, value: string): void => {
  res.cookie(name, value, {
    httpOnly: true,
    secure: ENV.NODE_ENV === "production",
    sameSite: ENV.NODE_ENV === "production" ? "strict" : "lax",
    maxAge: Number(ENV.COOKIE_EXPIRE) * 24 * 60 * 60 * 1000,
  });
};

export const clearCookie = (res: Response, name: string): void => {
  res.clearCookie(name, {
    httpOnly: true,
    secure: ENV.NODE_ENV === "production",
    sameSite: ENV.NODE_ENV === "production" ? "strict" : "lax",
    maxAge: 0,
  });
};
