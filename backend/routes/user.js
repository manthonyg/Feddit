const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');

router.post('/user/register', UserController.createUser);

router.post('/user/login', UserController.loginUser);

module.exports = router;
