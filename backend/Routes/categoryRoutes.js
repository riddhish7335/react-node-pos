const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

router.post("/createCategory",auth,categoryController.createCategory);
router.post("/getCategories",auth,categoryController.getAllCategories);

 module.exports = router;