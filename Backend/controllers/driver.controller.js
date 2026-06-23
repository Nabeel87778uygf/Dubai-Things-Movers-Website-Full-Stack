import Booking from "../models/Booking.model.js";

// GET AVAILABLE BOOKINGS
export const getAvailableBookings = async (req, res) => {
    try {

        const bookings = await Booking.find({
            status: "pending",
            driver: null
        }).populate(
            "customer",
            "name phone"
        );

        res.json({
            success: true,
            bookings
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// SEND OFFER
export const sendOffer = async (req, res) => {
    try {

        const { price } = req.body;

        const booking =
            await Booking.findById(
                req.params.id
            );

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        if (req.user.role !== "driver") {
            return res.status(403).json({
                success: false,
                message: "Only drivers can send offers"
            });
        }

        if (!req.user.isAvailable) {
            return res.status(400).json({
                success: false,
                message: "Driver is busy"
            });
        }

        if (booking.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: "Booking no longer available"
            });
        }

        const alreadySent =
            booking.offers.find(
                offer =>
                    offer.driver?.toString() ===
                    req.user._id.toString()
            );

        if (alreadySent) {
            return res.status(400).json({
                success: false,
                message: "Offer already sent"
            });
        }

        booking.offers.push({
            driver: req.user._id,
            price
        });

        await booking.save();

        res.json({
            success: true,
            message: "Offer sent successfully",
            booking
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// MY BOOKINGS
export const getDriverBookings = async (req, res) => {
    try {

        const bookings =
            await Booking.find({
                driver: req.user._id
            })
                .populate(
                    "customer",
                    "name phone"
                );

        res.json({
            success: true,
            bookings
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// START TRIP
export const startTrip = async (req, res) => {
    try {

        const booking =
            await Booking.findById(
                req.params.id
            );

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        if (
            booking.driver?.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

        booking.status = "picked";

        await booking.save();

        res.json({
            success: true,
            message: "Trip started",
            booking
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// COMPLETE TRIP
export const completeTrip = async (req, res) => {
    try {

        const booking =
            await Booking.findById(
                req.params.id
            );

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        if (
            booking.driver?.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

        booking.status = "delivered";

        await booking.save();

        res.json({
            success: true,
            message: "Trip completed",
            booking
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};