const express = require('express');

const router = express.Router();

const signUpContoller = require('../controllers/signup.js');


router.post('/sign-up', signUpContoller.addSignUpDetails);


module.exports = router;