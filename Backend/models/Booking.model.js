import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        driver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        fullName: String,
        phoneNumber: String,
        pickupAddress: String,
        dropAddress: String,
        movingDate: Date,
        estimatedItems: [String],

        serviceType: {
            type: String,
            enum: [
                "Home Shifting",
                "Office Relocation",
                "Furniture Moving",
                "Packing Services",
            ],
            required: true,
        },

        offers: [
            {
                driver: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                price: Number,
                status: {
                    type: String,
                    enum: ["pending", "accepted", "rejected"],
                    default: "pending",
                },
            },
        ],

        price: { type: Number, default: 0 },
        commission: { type: Number, default: 0 },

        status: {
            type: String,
            enum: [
                "pending",
                "assigned",
                "accepted",
                "picked",
                "delivered",
                "cancelled",
            ],
            default: "pending",
        },

        tracking: {
            lat: Number,
            lng: Number,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);