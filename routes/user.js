const express = require('express');

const router = express.Router();

const userAuthentication = require('../middleware/auth');
const userChatController = require('../controllers/userchat');


router.post('/chat/message', userAuthentication.authenticate, userChatController.submitChat);
router.get('/chat/get-msg', userChatController.getAllMessages);
router.post('/chat/user',userAuthentication.authenticate, userChatController.getUserList);
router.post('/chat/create-group', userAuthentication.authenticate, userChatController.createGroup);
router.post('/chat/group',userAuthentication.authenticate, userChatController.getGroupList);
router.post('/chat/send-request', userAuthentication.authenticate, userChatController.storeRequest);
router.post('/chat/pending-requests', userAuthentication.authenticate, userChatController.checkPendingRequest);
router.post('/chat/accept-request/:requestId', userChatController.addToGroupMember);
router.post('/chat/reject-request/:requestId', userChatController.deleteRequest);
router.get('/chat/userList', userChatController.getAllUserList);
router.post('/user/make-admin', userAuthentication.authenticate, userChatController.makeAdmin);
router.post('/user/delete', userAuthentication.authenticate, userChatController.deleteMember);

module.exports = router;