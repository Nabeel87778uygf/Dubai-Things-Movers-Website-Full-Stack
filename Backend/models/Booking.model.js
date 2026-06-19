import mongoose from "mongoose";
const bookingSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        driver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        fullName: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            required: true
        },
        pickupAddress: {
            type: String,
            required: true
        },
        dropAddress: {
            type: String,
            required: true
        },
        movingDate: {
            type: Date,
            required: true
        },
        estimatedItems: [
            {
                type: String
            }
        ],
        serviceType: {
            type: String,
            enum: [
                "Home Shifting",
                "Office Relocation",
                "Furniture Moving",
                "Packing Services"
            ],
            required: true
        },
        // DRIVER OFFERS
        offers: [
            {
                driver: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                },
                price: {
                    type: Number,
                    required: true
                },
                status: {
                    type: String,

                    enum: [
                        "pending",
                        "accepted",
                        "rejected"
                    ],
                    default: "pending"
                }
            }
        ],
        // FINAL PRICE AFTER CUSTOMER ACCEPT
        price: {
            type: Number,
            default: 0
        },
        commission: {
            type: Number,
            default: 0
        },
        status: {
            type: String,
            enum: [
                "pending",
                "accepted",
                "picked",
                "delivered",
                "cancelled"

            ],
            default: "pending"

        },
        tracking: {

            lat: Number,
            lng: Number
        }
    },
    {
        timestamps: true
    }

);
export default mongoose.model(
    "Booking",
    bookingSchema
);