const express = require("express");
const userController = require("../controllers/userController");
const authenticateUser = require("../middlewares/userAuth");

const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/getUserDetails", [authenticateUser], userController.userDetails);

module.exports = router;
