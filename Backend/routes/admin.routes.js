import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import isAdmin from "../middleware/isAdmin.js";


import {
    getDashboard, getBookingById, getAllBookings, updateBookingStatus, getDrivers, getCustomers, assignDriver
} from "../controllers/admin.controller.js";


const router = express.Router();
router.get("/dashboard", protect, isAdmin, getDashboard);

router.get("/bookings/:id", protect, isAdmin, getBookingById);

router.get("/bookings", protect, isAdmin, getAllBookings);

router.put("/status/:id", protect, isAdmin, updateBookingStatus);

router.put("/assign/:id", protect, isAdmin, assignDriver);

router.get("/drivers", protect, isAdmin, getDrivers);

router.get("/customers", protect, isAdmin, getCustomers);

export default router;





