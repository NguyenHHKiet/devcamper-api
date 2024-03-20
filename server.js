const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config({ path: "./config/config.env" });

// Connect to database
connectDB();

// Route files
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");

const app = express();

// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// Mount routes
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);

app.use(errorHandler);

const PORT = process.env.PORT || 8080;

const server = app.listen(
    PORT,
    console.log(
        `Server listening on ${process.env.NODE_ENV} mode on port ${PORT}`
            .yellow.bold,
    ),
);

// Handle unhandled promise rejections
process.on("uncaughtException", (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    // Close server & exit process
    server.close(() => process.exit(1));
});
