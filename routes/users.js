const express = require("express");
const {
    createUser,
    deleteUser,
    getUser,
    getUsers,
    updateUser,
} = require("../controllers/users");

const User = require("../models/User");

const router = express.Router();

const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

// Generate
router.use(protect);
router.use(authorize("admin"));

router.route("/").get(advancedResults(User), getUsers).post(createUser);

router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
