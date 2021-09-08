
const express = require('express');
const router = express.Router();

const authCtrl = require('../controllers/auth');

// Registration
router.post('/signup', authCtrl.signUp);

// Login
router.post('/signin', authCtrl.signIn);

module.exports = router;