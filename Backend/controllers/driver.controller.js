import Booking from "../models/Booking.model.js";

// AVAILABLE BOOKINGS
export const getAvailableBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({
            status: "pending",
        }).populate("customer", "name phone");

        res.json({
            success: true,
            bookings,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// SEND OFFER
export const sendOffer = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        const alreadySent = booking.offers.find(
            o => o.driver.toString() === req.user._id.toString()
        );

        if (alreadySent) {
            return res.status(400).json({
                message: "Offer already sent"
            });
        }

        booking.offers.push({
            driver: req.user._id,
            price: req.body.price,
            status: "pending",
        });

        await booking.save();

        res.json({
            success: true,
            message: "Offer sent",
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};