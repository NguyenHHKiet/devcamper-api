const asyncHandler = require("../middleware/async");
const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");

// @desc    Get all bootcamps
// @route   Get /api/v1/bootcamps
// @access  Public
// @query   location.state, housing, averageCost[lte]=10000
// crul filter     ?select=name,...&sort=-name
// pagination   ?page=2?limit=10
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };
    // Fields to exclude
    const removeFields = ["select", "sort"];
    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach((param) => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(req.query);

    // Create operations ($gt, $gte, etc)
    queryStr = queryStr.replace(
        /\b(gt|gte|lt|lte|in)\b/g,
        (match) => `$${match}`,
    );

    // Finding resources => mongoose object
    query = Bootcamp.find(JSON.parse(queryStr)).populate("courses");

    // Select Fields
    if (req.query.select) {
        const fields = req.query.select.split(",").join(" ");
        query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(",").join(" ");
        query = query.sort(sortBy);
    } else {
        // default sort by createdAt desc
        query = query.sort("-createdAt");
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 5;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Bootcamp.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const bootcamps = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit,
        };
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit,
        };
    }

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        pagination,
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

    bootcamp.remove();

    res.status(200).json({ success: true, data: {} });
});
