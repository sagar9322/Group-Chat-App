const ChatBox = require('../models/chatbox');
const User = require('../models/signup');


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

    try{
        const allMessage = await ChatBox.findAll();

        res.status(200).json({data:allMessage, success:true});
    }catch(err) {
        console.error("somthing went wrong", err);
        res.status('404').json({success:false});
    }
    
}
