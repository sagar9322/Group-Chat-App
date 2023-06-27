const ChatBox = require('../models/chatbox');


exports.submitChat = async (req, res, next) => {
    const message = req.body.message;
    const userId = req.user.id;
try{
    await ChatBox.create({
        uid: userId,
        message: message
    });

    res.status(200).json({message: "Chat Submited Successfully"});
}catch(err){
    console.error("Somthing Went Wrong", err);
}

}
