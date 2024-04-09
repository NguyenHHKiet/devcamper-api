const express = require("express");
const {
    register,
    login,
    logout,
    updatePassword,
    getMe,
    forgetPassword,
    resetPassword,
    updateDetails,
} = require("../controllers/auth");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", protect, getMe);
router.put("/updatedetails", protect, updateDetails);
router.put("/updatepassword", protect, updatePassword);
router.post("/forgetpassword", forgetPassword);
router.put("/forgetpassword/:resettoken", resetPassword);

module.exports = router;
