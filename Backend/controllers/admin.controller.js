import Booking from "../models/Booking.model.js";
import User from "../models/user.model.js";
// ADMIN DASHBOARD
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

        res.status(200).json({

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
// GET ALL BOOKINGS
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
        res.status(200).json({

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
                    "name email phone vehicleType vehicleNumber"
                );
        if (!booking) {
            return res.status(404).json({
                success: false,

                message: "Booking not found"

            });
        }
        res.status(200).json({
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
export const updateBookingStatus = async (req, res) => {
    try {
        const booking =
            await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({

                success: false,

                message: "Booking not found"

            });
        }
        const allowedStatuses = [
            "pending", "accepted", "picked", "delivered", "cancelled"
        ];

        if (
            !allowedStatuses.includes(
                req.body.status
            )
        ) {

            return res.status(400).json({

                success: false,
                message: "Invalid booking status"
            });
        }

        booking.status =
            req.body.status;

        if (
            req.body.status === "delivered"
            &&
            booking.driver
        ) {
            const commission =

                Number(booking.price || 0)
                *
                0.20;
            booking.commission =
                commission;

            const driver =

                await User.findById(
                    booking.driver
                );

            if (driver) {
                driver.isAvailable = true;
                driver.earnings +=
                    Number(booking.price || 0) -
                    commission;
                await driver.save();
            }
        }
        await booking.save();
        res.status(200).json({
            success: true,
            message: "Booking status updated",
            booking
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }

};

// ASSIGN DRIVER TO BOOKING
export const assignDriver = async (req, res) => {
    try {
        const { driverId } = req.body;
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        const driver = await User.findById(driverId);
        if (!driver || driver.role !== "driver") {
            return res.status(404).json({
                success: false,
                message: "Valid driver not found"
            });
        }

        booking.driver = driverId;
        booking.status = "accepted"; // automatically accept when assigned
        await booking.save();

        driver.isAvailable = false;
        await driver.save();

        res.status(200).json({
            success: true,
            message: "Driver assigned successfully",
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

export const getDrivers = async (req, res) => {
    try {
        const drivers =
            await User.find({
                role: "driver"
            })
                .select("-password");

        res.status(200).json({
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

export const getCustomers = async (req, res) => {
    try {
        const customers =
            await User.find({
                role: "customer"
            })
                .select("-password");

        res.status(200).json({
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