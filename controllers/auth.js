const crypto = require("crypto");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const sendEmail = require("../utils/sendEmail");
const User = require("../models/User");

// @desc    Register user
// @route   Post /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    // Find if username and email exist in MongoDB
    const userExists = await User.findOne({
        $or: [{ email: email }, { name: name }],
    });

    if (userExists) {
        let errors = "";
        if (userExists.name === name) {
            errors = "User's Name already exists";
        } else {
            errors = "Email already exists";
        }
        return next(new ErrorResponse(errors, 400));
    }

    // Create user
    const user = await User.create({ name, email, password, role });

    sendTokenResponse(user, 200, res);
});

// @desc    Login user
// @route   Post /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
        return next(new ErrorResponse("Invalid email or password", 400));
    }

    // Check for user
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorResponse("Invalid credentials", 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorResponse("Invalid credentials", 401));
    }

    sendTokenResponse(user, 200, res);
});

// @desc    Get current logged in user
// @route   Post /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        return next(new ErrorResponse("Invalid credentials", 401));
    }

    res.status(200).json({
        success: true,
        data: user,
    });
});

// @desc    Forget password
// @route   Post /api/v1/auth/forgetpassword
// @access  Public
exports.forgetPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorResponse("There is no user with that email", 404));
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/auth/forgetpassword/${resetToken}`;
    const message = `Hello,\nWe've received a request to reset the password for ${process.env.FROM_NAME} account associated with ${user.email}.yeah. No changes have been made to your account yet.\nYou can reset your password by clicking the link below:\n\n
    ${resetUrl}`;

    try {
        await sendEmail({
            email: user.email,
            subject: `Reset your ${process.env.FROM_NAME} password`,
            message,
        });
        res.status(200).json({ success: true, data: "Email has been sent." });
    } catch (err) {
        console.error(err);
        user.resetPasswordExpire = undefined;
        user.resetPasswordToken = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorResponse("Email could not be sent.", 500));
    }

    res.status(200).json({
        success: true,
        data: resetToken,
    });
});

// @desc    Reset password
// @route   Post  /api/v1/auth/forgetpassword/:resettoken
// @access  Private
exports.resetPassword = asyncHandler(async (req, res, next) => {
    // Get hashed token
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.resettoken)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return next(new ErrorResponse("Invalid token credentials", 400));
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;

    await user.save();

    sendTokenResponse(user, 200, res);
});

// Get token from model, create cookie and response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
        ),
        httpOnly: true,
    };

    if (process.env.NODE_ENV === "production") {
        options.secure = true;
    }

    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        token,
    });
};
