const User = require('../models/signup');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();


function generateAccessToken(id) {
    return jwt.sign({ userId: id }, process.env.TOKEN_SECRET_KEY);
}




exports.getUserDetail = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            return res.status(404).json({ message: "Email or Password doesn't match" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            return res.status(200).json({ message: 'Login Successfully', token: generateAccessToken(user.id), username:user.name });
        } else {
            return res.status(401).json({ message: "Password is incorrect" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "An error occurred" });
    }
};