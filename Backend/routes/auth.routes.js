import express from "express";
import {
    register,
    login,
    getMe,
    getDrivers,
} from "../controllers/auth.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// AUTH
router.post("/register", register);
router.post("/login", login);

// PROFILE
router.get("/profile", protect, getMe);

// DRIVERS LIST (ADMIN or PUBLIC depending on your logic)
router.get("/drivers", getDrivers);

export default router;