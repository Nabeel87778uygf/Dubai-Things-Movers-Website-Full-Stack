import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

// REGISTER
export const register = async (req, res) => {

    try {

        const {
            name,
            email,
            phone,
            password,
            role,

            // DRIVER FIELDS
            vehicleType,
            vehicleNumber,
            licenseNumber

        } = req.body;

        // REQUIRED FIELDS

        if (
            !name ||
            !email ||
            !phone ||
            !password
        ) {

            return res.status(400).json({

                success: false,

                message: "Please fill all fields"

            });

        }

        // CHECK USER EXIST

        const existingUser =
            await User.findOne({
                email
            });

        if (existingUser) {

            return res.status(400).json({

                success: false,

                message: "User already exists"

            });

        }

        // PASSWORD HASH

        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );

        // CREATE USER

        const user = await User.create({

            name, email, phone, password: hashedPassword,


            role:
                role || "customer",


            // DRIVER INFORMATION

            vehicleType:
                role === "driver"
                    ? vehicleType
                    : "",

            vehicleNumber:
                role === "driver"
                    ? vehicleNumber
                    : "",
            licenseNumber:
                role === "driver"
                    ? licenseNumber
                    : ""

        });

        // TOKEN

        const token =
            generateToken(user);

        res.status(201).json({

            success: true,

            message: "User registered successfully",

            token,

            user: {

                id: user._id,

                name: user.name,

                email: user.email,

                phone: user.phone,

                role: user.role,


                vehicleType: user.vehicleType,

                vehicleNumber: user.vehicleNumber,

                licenseNumber: user.licenseNumber

            }

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// LOGIN
export const login = async (req, res) => {


    try {


        const {
            email,
            password
        } = req.body;

        const user =
            await User.findOne({
                email
            });

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found"

            });

        }

        const isMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!isMatch) {
            return res.status(401).json({

                success: false,

                message: "Invalid credentials"

            });
        }

        const token =
            generateToken(user);

        res.json({

            success: true,

            token,
            user: {
                id: user._id,

                name: user.name,

                email: user.email,

                phone: user.phone,

                role: user.role,


                vehicleType: user.vehicleType,

                vehicleNumber: user.vehicleNumber,

                licenseNumber: user.licenseNumber,

                isAvailable: user.isAvailable,

                earnings: user.earnings
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET CURRENT USER
export const getMe = (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
};

// GET DRIVERS
export const getDrivers = async (req, res) => {
    try {
        const drivers = await User.find({
            role: "driver"
        }).select("-password");
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