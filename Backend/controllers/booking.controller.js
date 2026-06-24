import Booking from "../models/Booking.model.js";
import User from "../models/user.model.js";


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


//get booking details api
export const getBookingDetails = async (req, res) => {

    try {

        const booking = await Booking.findOne({
            _id: req.params.id,
            customer: req.user._id
        })
            .populate(
                "offers.driver",
                "name phone vehicleType vehicleNumber"
            )
            .populate(
                "driver",
                "name phone"
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
        })

    }

}


//accept offer
export const acceptOffer = async (req, res) => {
    try {

        if (req.user.role !== "customer") {
            return res.status(403).json({
                success: false,
                message: "Only customer can accept offers"
            });
        }

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        // OWNER CHECK
        if (
            booking.customer.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access"
            });
        }

        const offer =
            booking.offers.id(req.body.offerId);

        if (!offer) {
            return res.status(404).json({
                success: false,
                message: "Offer not found"
            });
        }

        // ACCEPT OFFER
        offer.status = "accepted";

        // REJECT OTHERS
        booking.offers.forEach(o => {
            if (
                o._id.toString() !==
                req.body.offerId
            ) {
                o.status = "rejected";
            }
        });

        booking.price = offer.price;
        booking.driver = offer.driver;
        booking.status = "accepted";

        // DRIVER BUSY
        const driver =
            await User.findById(offer.driver);

        if (driver) {
            driver.isAvailable = false;
            await driver.save();
        }

        await booking.save();

        res.status(200).json({
            success: true,
            message: "Offer accepted successfully",
            booking
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};