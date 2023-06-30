const ChatBox = require('../models/chatbox');
const User = require('../models/signup');
const { Op } = require('sequelize');
const Group = require('../models/group');
const Request = require('../models/request');
const GroupMembers = require('../models/groupMembers');


exports.submitChat = async (req, res, next) => {
    const message = req.body.message;
    const userId = req.user.id;
    const groupId = req.body.groupId;
    try {
        await ChatBox.create({
            uid: userId,
            username: req.user.name,
            message: message,
            groupId: groupId
        });

        res.status(200).json({ message: "Chat Submited Successfully" });
    } catch (err) {
        console.error("Somthing Went Wrong", err);
    }

}


exports.getAllMessages = async (req, res, next) => {

    const { timestamp } = req.query; // Get the timestamp parameter from the request query

    try {
        let messages;

        if (timestamp) {
            // Fetch messages newer than the provided timestamp
            messages = await ChatBox.findAll({
                where: {
                    createdAt: {
                        [Op.gt]: timestamp // Use greater than (>) operator to filter messages by timestamp
                    }
                }
            });
        } else {
            // Fetch all messages if no timestamp is provided
            messages = await ChatBox.findAll();
        }

        res.status(200).json({ data: messages, success: true });
    } catch (err) {
        console.error("Something went wrong:", err);
        res.status(404).json({ success: false });
    }

}

exports.getUserList = async (req, res, next) => {
    const groupId = req.body.groupId;
    try {
        const superAdmin = await Group.findOne({where: {Id: groupId}});
        const members = await GroupMembers.findAll({
            where: {
                groupId: groupId
            }
        });
        // Extract group IDs from members array
        const memberIds = members.map(member => member.memberId);
        const admin = members.filter(member => member.isAdmin===true);
        

        // Fetch groups based on the extracted group IDs
        const member = await User.findAll({
            where: {
                id: memberIds
            }
        });

        res.status(200).json({ members: member, success: true, admin: admin, superAdminId: superAdmin.createdId });
    } catch (err) {
        console.error("somthing went wrong", err);
    }
}

exports.createGroup = async (req, res, next) => {
    const groupName = req.body.groupName;
    console.log("><><", groupName)

    const response = await Group.create({
        createdId: req.user.id,
        groupName: groupName
    })

    await GroupMembers.create({
        groupId: response.id,
        memberId: req.user.id,
        isAdmin: true
    })
    if (response) {
        res.status(200).json({ success: true });
    }
}

exports.getGroupList = async (req, res, next) => {
    try {
        const members = await GroupMembers.findAll({
            where: {
                memberId: req.user.id
            }
        });
        // Extract group IDs from members array
        const groupIds = members.map(member => member.groupId);

        // Fetch groups based on the extracted group IDs
        const groups = await Group.findAll({
            where: {
                id: groupIds
            }
        });

        res.status(200).json({ groups: groups, success: true });
    } catch (err) {
        console.error("somthing went wrong", err);
    }
}

exports.storeRequest = async (req, res, next) => {
    const requestedUser = req.body.users;
    const groupId = req.body.groupId;
    const group = await Group.findAll({
        where: {
            id: groupId
        }
    });
    try {
        const createRequests = requestedUser.map(async (userId) => {
            await Request.create({
                groupId: groupId,
                groupName: group[0].groupName,
                requestedUser: userId,
                requestFrom: req.user.name
            });
        });

        await Promise.all(createRequests);
        res.status(200).json({ success: true });
    } catch (err) {
        console.error("somthing went wrong", err);
    }

}

exports.checkPendingRequest = async (req, res, next) => {

    try {
        const pendingRequest = await Request.findAll({
            where: {
                requestedUser: req.user.id
            }
        });

        res.status(200).json({ requests: pendingRequest });
    } catch (err) {
        console.error("somthing went wrong", err);
    }

}


exports.addToGroupMember = async (req, res, next) => {
    const requestedId = req.params.requestId;
    const request = await Request.findOne({
        where: {
            id: requestedId
        }
    })

    const groupId = request.groupId;
    const memberId = request.requestedUser;

    await GroupMembers.create({
        groupId: groupId,
        memberId: memberId,
        isAdmin: false
    });
    await request.destroy();

    res.status(200).json({ success: true });


}

exports.deleteRequest = async (req, res, next) => {
    const requestedId = req.params.requestId;
    try {
        const request = await Request.findOne({
            where: {
                id: requestedId
            }
        });

        if (request) {
            request.destroy();
        }

    } catch (err) {
        console.error("somthing went wrong", err);
    }

}


exports.getAllUserList = async (req, res, next)=> {
    try {
        const users = await User.findAll();

        res.status(200).json({ users: users, success: true });
    } catch (err) {
        console.error("somthing went wrong", err);
    }
}

exports.makeAdmin = async (req, res, next)=> {
    const groupId = req.body.groupId;
    const userId = req.body.userId;
    try{
        const member = await GroupMembers.findOne({where: {
            groupId: groupId,
            memberId: userId
        }});
    
        await member.update({
            isAdmin:true
        });
        res.status(200).json({success: true});
    }catch (err) {
        console.error("somthing went wrong", err);
    }
    
}

exports.deleteMember = async (req, res, next) => {
    const groupId = req.body.groupId;
    const userId = req.body.userId;
    try{
        const member = await GroupMembers.findOne({where: {
            groupId: groupId,
            memberId: userId
        }});
    
        await member.destroy();
        res.status(200).json({success: true});
    }catch (err) {
        console.error("somthing went wrong", err);
    }
}