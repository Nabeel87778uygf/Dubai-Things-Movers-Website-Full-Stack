import express from "express";
import { protect, adminOnly } from "../middleware/auth.middleware.js";
import {
    getAllBookings,
    assignDriver,
    getAvailableDrivers,
    updateBookingStatus
} from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/bookings", protect, adminOnly, getAllBookings);
router.put("/assign/:id", protect, adminOnly, assignDriver);
router.get("/drivers", protect, adminOnly, getAvailableDrivers);
router.put("/status/:id", protect, adminOnly, updateBookingStatus);

export default router;