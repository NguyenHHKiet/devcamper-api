const express = require("express");
const {
    register,
    login,
    getMe,
    forgetPassword,
    resetPassword,
} = require("../controllers/auth");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/forgetpassword", forgetPassword);
router.put("/forgetpassword/:resettoken", resetPassword);

module.exports = router;
