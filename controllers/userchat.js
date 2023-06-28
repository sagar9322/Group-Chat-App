const ChatBox = require('../models/chatbox');
const User = require('../models/signup');
const { Op } = require('sequelize');


exports.submitChat = async (req, res, next) => {
    const message = req.body.message;
    const userId = req.user.id;
try{
    await ChatBox.create({
        uid: userId,
        username: req.user.name,
        message: message
    });

    res.status(200).json({message: "Chat Submited Successfully"});
}catch(err){
    console.error("Somthing Went Wrong", err);
}

}


exports.getAllMessages = async (req, res, next) => {

    const { timestamp } = req.query; // Get the timestamp parameter from the request query
    console.log(timestamp)

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
