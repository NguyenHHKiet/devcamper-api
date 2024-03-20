const express = require("express");
const {
    createBootcamp,
    deleteBootcamp,
    getBootcamp,
    getBootcamps,
    updateBootcamp,
} = require("../controllers/bootcamps");

// Include other resource routers
const courseRouter = require("./courses");

const router = express.Router();

// Re-route into other resource routers
router.use("/:bootcampId/courses", courseRouter);

router.route("/").get(getBootcamps).post(createBootcamp);

router
    .route("/:id")
    .get(getBootcamp)
    .put(updateBootcamp)
    .delete(deleteBootcamp);

module.exports = router;
