import User from "../models/user.model.js"

const isAdmin = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "unauthorized! please login first.",

            });
        }
        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Only Admin can perform this action"
            });
        }

        next();

    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}

export default isAdmin