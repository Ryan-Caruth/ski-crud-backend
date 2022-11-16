const express = require('express');
const router = express.Router();
const { registration, login, logout } = require('../controllers/userAccount');

//Register a new user
router.post("/register", registration);
//log in a new user
router.post("/login", login)
//log the user out
router.get("/logout", logout);

module.exports = router;