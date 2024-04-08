const express = require("express");
const { getReviews, getReview, addReview } = require("../controllers/reviews");

const Review = require("../models/Review");
const advancedResults = require("../middleware/advancedResults");

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require("../middleware/auth");

router
    .route("/")
    .get(
        advancedResults(Review, {
            path: "bootcamp",
            select: "name description",
        }),
        getReviews,
    )
    .post(protect, authorize("user", "admin"), addReview);

router.route("/:id").get(getReview);

module.exports = router;
