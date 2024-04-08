const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const fileUpload = require("express-fileupload");
const helmet = require("helmet");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/error");
const ErrorResponse = require("./utils/errorResponse");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config({ path: "./config/config.env" });

// Connect to database
connectDB();

// Route files
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const auth = require("./routes/auth");
const users = require("./routes/users");

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// Helmet helps secure Express apps by setting HTTP response headers.
app.use(helmet());

// decreases the downloadable amount of data that's served to users.
app.use(compression()); // compress responses

// File uploading
app.use(fileUpload());

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Mount routes
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);

// next handler error if something goes wrong ---------------------------
app.use((req, res, next) => {
    // Error goes via `next()` method now
    setImmediate(() => {
        next(new ErrorResponse("Something went wrong!!!", 500));
    });
});
app.use(errorHandler);

const PORT = process.env.PORT || 8080;

const server = app.listen(
    PORT,
    console.log(
        `Server listening on ${process.env.NODE_ENV} mode on port ${PORT}`
            .yellow.bold,
    ),
    console.log(colors.rainbow("OMG Rainbows!")),
);

// Handle unhandled promise rejections
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`.red);
    // Close server & exit process
    server.close(() => process.exit(1));
});
