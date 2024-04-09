const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const fileUpload = require("express-fileupload");
const helmet = require("helmet");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
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
const reviews = require("./routes/reviews");

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
// Prevent Cross-Site Scripting (XSS) attacks, Content Security Policy (CSP) vulnerabilities,...
app.use(helmet());

// decreases the downloadable amount of data that's served to users.
app.use(compression()); // compress responses

// File uploading
app.use(fileUpload());

// To remove data using these defaults:
app.use(mongoSanitize());

// Prevent XSS attacks
app.use(xss());

// Rate limit settings
// Use to limit repeated requests to public APIs and/or endpoints such as password reset.
app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
        standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
        // store: ... , // Redis, Memcached, etc. See below.
    }),
);

// Hpp protect against HTTP Parameter Pollution attacks
app.use(hpp());

// Enable CORS
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Mount routes
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/reviews", reviews);

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
    console.log(colors.rainbow("Server.JS!")),
);

// Handle unhandled promise rejections
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`.red);
    // Close server & exit process
    server.close(() => process.exit(1));
});
