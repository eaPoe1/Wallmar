const express = require('express');
const checkAuth = require('../utils/checkAuth');
const { signup, confirm, login, profile } = require('../controllers/auth');

const router = express.Router();



router.post('/signup', signup);

router.get('/confirm/:id', confirm);

router.post('/login', login);

router.get('/profile', checkAuth, profile);


module.exports = router;