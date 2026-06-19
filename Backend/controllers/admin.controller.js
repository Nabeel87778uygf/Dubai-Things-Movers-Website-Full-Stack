import Booking from "../models/Booking.model.js";
import User from "../models/user.model.js";

export const getDashboard = async (req, res) => {

    try {

        const totalBookings =
            await Booking.countDocuments();
        const stats =
            await Booking.aggregate([
                {
                    $group: {
                        _id: null,

                        totalRevenue: {
                            $sum: "$price"
                        },

                        totalCommission: {
                            $sum: "$commission"
                        }
                    }
                }
            ]);

        res.json({

            success: true,

            stats: {

                totalBookings,

                totalRevenue:
                    stats[0]?.totalRevenue || 0,

                totalCommission:
                    stats[0]?.totalCommission || 0
            }

        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ALL BOOKINGS
export const getAllBookings = async (req, res) => {

    try {
        const bookings =
            await Booking.find()

                .populate(
                    "customer",
                    "name email phone"
                )

                .populate(
                    "driver",
                    "name email phone"
                )
                .sort({
                    createdAt: -1
                });
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

// SINGLE BOOKING DETAIL
// CUSTOMER + DRIVER + OFFERS
export const getBookingById = async (req, res) => {

    try {
        const booking =

            await Booking.findById(req.params.id)

                .populate(
                    "customer",
                    "name email phone"
                )

                .populate(
                    "driver",
                    "name email phone"
                )

                .populate(
                    "offers.driver",
                    "name email phone"
                );
        if (!booking) {

            return res.status(404).json({

                success: false,

                message: "Booking not found"
            });

        }
        res.json({
            success: true,
            booking
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message

        });

    }

};

// UPDATE BOOKING STATUS
export const updateBookingStatus =
    async (req, res) => {

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

            booking.status =
                req.body.status;

            // DELIVERY COMPLETE
            if (req.body.status === "delivered") {
                const commission =
                    booking.price * 0.20;

                booking.commission =
                    commission;
                const driver =
                    await User.findById(
                        booking.driver
                    );

                if (driver) {
                    driver.isAvailable = true;

                    driver.earnings +=
                        booking.price - commission;
                    await driver.save();

                }

            }
            await booking.save();
            res.json({
                success: true,
                message: "Status updated",
                booking
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }

    };
// GET ALL DRIVERS
export const getDrivers =
    async (req, res) => {

        try {
            const drivers =

                await User.find({

                    role: "driver"

                })
                    .select("-password");

            res.json({
                success: true,
                drivers
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }

    };

// GET ALL CUSTOMERS
export const getCustomers =
    async (req, res) => {
        try {
            const customers =
                await User.find({
                    role: "customer"
                })
                    .select("-password");

            res.json({
                success: true,
                customers
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });

        }

    };