import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import isDriver from "../middleware/isDriver.js";

import {
    getAvailableBookings,
    sendOffer,
    getDriverBookings,
    startTrip,
    completeTrip
} from "../controllers/driver.controller.js";

const router = express.Router();

router.get(
    "/available-bookings", protect, isDriver, getAvailableBookings
);

router.post(
    "/send-offer/:id", protect, isDriver, sendOffer
);

router.get("/my-bookings", protect, isDriver, getDriverBookings);

router.put("/start-trip/:id", protect, isDriver, startTrip);
router.put("/complete-trip/:id", protect, isDriver, completeTrip);

export default router;