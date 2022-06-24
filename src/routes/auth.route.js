const express = require("express");
const {
	register,
	login,
	verifyEmail,
} = require("../controllers/auth.controller");

// import middleware
const usersUpload = require("../middleware/usersUpload");
const upload = require("../middleware/upload");
const {
	registerValidation,
	loginValidation,
} = require("../validations/auth.validation");
const validation = require("../middleware/validation");

const router = express.Router();
router
	.post("/auth/register", usersUpload, registerValidation, validation, register) // uncomment its pakai middleware
	.post("/auth/login", loginValidation, validation, login)
	.get("/auth/verify-email", verifyEmail);
module.exports = router;
