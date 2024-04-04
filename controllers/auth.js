const path = require("path");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");

// @desc    Register user
// @route   Get /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
    res.status(200).json({success: true});

});
