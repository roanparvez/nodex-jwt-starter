import express from "express";

import {
  forgotPassword,
  login,
  logout,
  register,
  resetPassword,
  verifyOtp,
} from "../controllers/auth.controller.js";
import { isAuthenticatedUser } from "../middlewares/auth.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/otp/verify").post(verifyOtp);
router.route("/login").post(login);
router.route("/logout").post(isAuthenticatedUser, logout);

router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);

export default router;
