import Booking from "../models/Booking.model.js";

// CREATE BOOKING
export const createBooking = async (req, res) => {
    try {
        const booking = await Booking.create({
            ...req.body,
            customer: req.user._id,
            price: 0,
            commission: 0,
            offers: [],
        });

        res.status(201).json({
            success: true,
            message: "Booking created",
            booking,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// MY BOOKINGS
export const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({
            customer: req.user._id,
        }).populate("driver", "name phone");

        res.json({
            success: true,
            bookings,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ACCEPT OFFER (CUSTOMER ONLY)
export const acceptOffer = async (req, res) => {
    try {

        if (req.user.role !== "customer") {
            return res.status(403).json({ message: "Only customer can accept offers" });
        }

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        const offer = booking.offers.id(req.body.offerId);

        if (!offer) {
            return res.status(404).json({ message: "Offer not found" });
        }

        offer.status = "accepted";

        booking.offers.forEach(o => {
            if (o._id.toString() !== req.body.offerId) {
                o.status = "rejected";
            }
        });

        booking.price = offer.price;
        booking.driver = offer.driver;
        booking.status = "accepted";

        await booking.save();

        res.json({
            success: true,
            message: "Offer accepted",
            booking,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};