import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import driverRoutes from "./routes/driver.routes.js";

const app = express();

app.use(express.json());

app.use(
    cors({
        origin: "http://localhost:8080",
        credentials: true,
    })
);

app.use("/api/auth", authRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/driver", driverRoutes);

export default app;