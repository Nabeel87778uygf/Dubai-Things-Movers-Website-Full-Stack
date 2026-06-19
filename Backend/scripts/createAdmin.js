import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/user.model.js";

dotenv.config();

const createAdmin = async () => {
    await mongoose.connect(
        process.env.MONGO_URI
    );
    const hashedPassword =
        await bcrypt.hash(
            process.env.ADMIN_PASSWORD,
            10
        );
    await User.create({
        name: "Super Admin",
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        role: "admin"
    });
    console.log("Admin Created");
    process.exit();

}
createAdmin();