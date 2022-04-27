const express = require("express");
const { register, login } = require("../controllers/auth.controller");

const router = express.Router();
const upload = require("../middleware/upload");
router
  .post('/register', upload, register) // uncomment its pakai middleware
  .post("/login", login);
module.exports = router;
