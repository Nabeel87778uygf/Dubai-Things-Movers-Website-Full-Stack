import dotenv from "dotenv";

// Load ENV FIRST (VERY IMPORTANT)
dotenv.config();

import connectDB from "./config/db.js";
import app from "./app.js";

// Connect MongoDB
connectDB();

// PORT
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});