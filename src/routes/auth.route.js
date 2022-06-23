const express = require("express");
const { register, login } = require("../controllers/auth.controller");

// import middleware
const upload = require("../middleware/upload");
const { registerValidation } = require("../validations/auth.validation");
const validation = require("../middleware/validation");

const router = express.Router();
router
	.post("/register", upload, registerValidation, validation, register) // uncomment its pakai middleware
	.post("/login", login);
module.exports = router;
