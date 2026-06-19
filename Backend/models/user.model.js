import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            minlength: 6
        },
        role: {
            type: String,
            enum: [
                "customer",
                "driver",
                "admin"
            ],
            default: "customer"
        },
        phone: {
            type: String,
            default: ""
        },
        // DRIVER DATA
        vehicleType: {
            type: String,
            default: ""
        },
        vehicleNumber: {
            type: String,
            default: ""
        },
        licenseNumber: {
            type: String,
            default: ""
        },
        // DRIVER AVAILABLE OR BUSY
        isAvailable: {
            type: Boolean,
            default: true
        },
        // DRIVER TOTAL EARNING
        earnings: {
            type: Number,
            default: 0
        }
    },

    {
        timestamps: true
    }

);

export default mongoose.model(
    "User",
    userSchema
);