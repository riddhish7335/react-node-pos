const express = require("express");
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");
const router = express.Router();


router.post("/createAdmin",authController.createAdmin);
router.post("/login",authController.login);
router.post("/getProfile",auth,authController.getProfile);

module.exports = router;