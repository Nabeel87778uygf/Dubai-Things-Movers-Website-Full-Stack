import Booking from "../models/Booking.model.js";
import User from "../models/user.model.js";

// ALL BOOKINGS
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("customer", "name email")
            .populate("driver", "name phone");

        res.json({
            success: true,
            bookings,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ASSIGN DRIVER
export const assignDriver = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        const driver = await User.findOne({
            _id: req.body.driverId,
            role: "driver",
            isAvailable: true,
        });

        if (!driver) {
            return res.status(404).json({ message: "Driver not available" });
        }

        booking.driver = driver._id;
        booking.status = "assigned";

        driver.isAvailable = false;

        await driver.save();
        await booking.save();

        res.json({
            success: true,
            message: "Driver assigned",
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// AVAILABLE DRIVERS
export const getAvailableDrivers = async (req, res) => {
    try {
        const drivers = await User.find({
            role: "driver",
            isAvailable: true,
        });

        res.json({
            success: true,
            drivers,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// STATUS UPDATE
export const updateBookingStatus = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: "Not found" });
        }

        booking.status = req.body.status;

        if (req.body.status === "delivered") {
            const commission = booking.price * 0.2;
            booking.commission = commission;
        }

        await booking.save();

        res.json({
            success: true,
            message: "Updated",
            booking,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};