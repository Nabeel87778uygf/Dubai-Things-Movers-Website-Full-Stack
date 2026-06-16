import express from "express";
import { protect, driverOnly } from "../middleware/auth.middleware.js";
import {
    getAvailableBookings,
    sendOffer
} from "../controllers/driver.controller.js";

const router = express.Router();

router.get("/available", protect, driverOnly, getAvailableBookings);
router.post("/offer/:id", protect, driverOnly, sendOffer);

export default router;