const express = require('express');

const router = express.Router();

const userAuthentication = require('../middleware/auth');
const userChatController = require('../controllers/userchat');


router.post('/message', userAuthentication.authenticate, userChatController.submitChat);
router.get('/get-msg/:groupId', userChatController.getAllMessages);
router.post('/user',userAuthentication.authenticate, userChatController.getUserList);
router.post('/create-group', userAuthentication.authenticate, userChatController.createGroup);
router.post('/group',userAuthentication.authenticate, userChatController.getGroupList);
router.post('/send-request', userAuthentication.authenticate, userChatController.storeRequest);
router.post('/pending-requests', userAuthentication.authenticate, userChatController.checkPendingRequest);
router.post('/accept-request/:requestId', userChatController.addToGroupMember);
router.post('/reject-request/:requestId', userChatController.deleteRequest);
router.get('/userList', userChatController.getAllUserList);
router.post('/make-admin', userAuthentication.authenticate, userChatController.makeAdmin);
router.post('/delete', userAuthentication.authenticate, userChatController.deleteMember);

module.exports = router;