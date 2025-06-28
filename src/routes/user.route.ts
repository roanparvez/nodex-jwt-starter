import express from "express";

import {
  getUserDetails,
  updatePassword,
} from "../controllers/user.controller.js";
import { isAuthenticatedUser } from "../middlewares/auth.js";

const router = express.Router();

router.route("/profile").get(getUserDetails);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
router.route("/profile/update").put(isAuthenticatedUser, updatePassword);

export default router;
