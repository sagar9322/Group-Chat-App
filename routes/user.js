const express = require('express');

const router = express.Router();

const userAuthentication = require('../middleware/auth');
const userChatController = require('../controllers/userchat');


router.post('/chat/message', userAuthentication.authenticate, userChatController.submitChat);


module.exports = router;