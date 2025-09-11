const express = require("express");
const cors = require("cors");
const dbConnect = require("./config/dbConnect.js");
const userRoute = require("./routes/userRoute.js");
const blogRoute = require("./routes/blogRoute.js");
const { cloudinaryConfig } = require("./config/cloudinaryConfig.js");
const { PORT } = require("./config/dotenv.config.js");
const logger = require("./utils/logger.js");

// create server
const app = express();

// cors
app.use(
    cors({
        origin: [
            "https://blog-app-1729.vercel.app",
            "http://localhost:3000",
            "http://localhost:5173",
            "http://localhost:5174",
        ],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "x-requested-with"],
    })
);

// middleware
app.use(express.json());

// Health Check Route
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        uptime: process.uptime(), // server kitni der se chal raha hai
        timestamp: new Date(), // abhi ka time
    });
});

// routes
app.use("/api/v1", userRoute);
app.use("/api/v1", blogRoute);

// listen to server
app.listen(PORT, () => {
    // cloudinary config
    cloudinaryConfig();
    logger.info("Server is running on port 3000");
    // connect db
    dbConnect();
});