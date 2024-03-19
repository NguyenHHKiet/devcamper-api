const asyncHandler = require("../middleware/async");
const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");

// @desc    Get all bootcamps
// @route   Get /api/v1/bootcamps
// @access  Public
// @query   location.state, housing, averageCost[lte]=10000
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    let query;

    let queryStr = JSON.stringify(req.query);

    queryStr = queryStr.replace(
        /\b(gt|gte|lt|lte|in)\b/g,
        (match) => `$${match}`,
    );
    console.log(queryStr);

    query = Bootcamp.find(JSON.parse(queryStr));

    const bootcamps = await query;

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps,
    });
});

// @desc    Get single bootcamp
// @route   Get /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return next(
            new ErrorResponse(
                `Bootcamp not found with id of ${req.params.id}`,
                404,
            ),
        );
    }

    res.status(200).json({ success: true, data: bootcamp });
});

// @desc    Create new bootcamp
// @route   Post /api/v1/bootcamps
// @access  Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({ success: true, data: bootcamp });
});

// @desc    Update bootcamp
// @route   Put /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!bootcamp) {
        return next(err);
    }

    res.status(200).json({ success: true, data: bootcamp });
});

// @desc    Delete bootcamp
// @route   Delete /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

    if (!bootcamp) {
        return next(err);
    }

    res.status(200).json({ success: true, data: {} });
});
