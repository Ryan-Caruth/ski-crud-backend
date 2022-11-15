const express = require('express');
const router = express.Router();
const { registration } = require('../controllers/userAccount');

//Register a new user
router.post("/register", registration);

module.exports = router;