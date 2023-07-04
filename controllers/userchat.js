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
        const memberEmail = members.map(member => member.memberId);
        const admin = members.filter(member => member.isAdmin===true);
        

        // Fetch groups based on the extracted group IDs
        const member = await User.findAll({
            where: {
                email: memberEmail
            }
        });

        res.status(200).json({ members: member, success: true, admin: admin, superAdminId: superAdmin.createdId });
    } catch (err) {
        console.error("somthing went wrong", err);
    }
}

exports.getAllMessages = async (req, res, next) => {
    const { groupId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
        const totalCount = await ChatBox.count({ where: { groupId } });

        const totalPages = Math.ceil(totalCount / limit);

        let offset = (page - 1) * limit;

        if (offset < 0) {
            offset = 0;
        }

        const messages = await ChatBox.findAll({
            where: { groupId },
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });

        res.status(200).json({ messages, totalPages });
    } catch (err) {
        console.error("Something went wrong", err);
    }
}

exports.createGroup = async (req, res, next) => {
    const groupName = req.body.groupName;
    

    const response = await Group.create({
        createdId: req.user.id,
        groupName: groupName
    })

    await GroupMembers.create({
        groupId: response.id,
        memberId: req.user.email,
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
                memberId: req.user.email
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
        const createRequests = requestedUser.map(async (userEmail) => {
            await Request.create({
                groupId: groupId,
                groupName: group[0].groupName,
                requestedUser: userEmail,
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
                requestedUser: req.user.email
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
        res.status(200).json({success:true});
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
    const userEmail = req.body.userEmail;
    try{
        const member = await GroupMembers.findOne({where: {
            groupId: groupId,
            memberId: userEmail
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
    const userEmail = req.body.userEmail;
    try{
        const member = await GroupMembers.findOne({where: {
            groupId: groupId,
            memberId: userEmail
        }});
    
        await member.destroy();
        res.status(200).json({success: true});
    }catch (err) {
        console.error("somthing went wrong", err);
    }
}