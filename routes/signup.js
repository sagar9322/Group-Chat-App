const express = require('express');

const router = express.Router();

const signUpContoller = require('../controllers/signup.js');
const loginController = require('../controllers/login.js');


router.post('/sign-up', signUpContoller.addSignUpDetails);
router.post('/log-in', loginController.getUserDetail);


module.exports = router;