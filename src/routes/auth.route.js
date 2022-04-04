const express = require('express');
const {
    register,
    login
} = require('../controllers/auth.controller');

const router = express.Router();
// const upload = require('../middleware/upload')
const upload = require('../middleware/upload')
router
    .post('/register', upload, register)
    .post('/login', login)
module.exports = router