import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/isAdmin.js";
import {
    getAllBookings,
    assignDriver,
    getAvailableDrivers,
    updateBookingStatus
} from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/bookings", protect, isAdmin, getAllBookings);
router.put("/assign/:id", protect, isAdmin, assignDriver);
router.get("/drivers", protect, isAdmin, getAvailableDrivers);
router.put("/status/:id", protect, isAdmin, updateBookingStatus);

export default router;