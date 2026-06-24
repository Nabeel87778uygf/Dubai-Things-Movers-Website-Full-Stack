import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
    createBooking,
    getMyBookings,
    acceptOffer,
    getBookingDetails
} from "../controllers/booking.controller.js";

const router = express.Router();

router.post("/create", protect, createBooking);
router.get("/my", protect, getMyBookings);
router.get("/booking/:id", protect, getBookingDetails);
router.put("/accept-offer/:id", protect, acceptOffer);

export default router;