const User = require('../models/signup');
const bcrypt = require('bcrypt');


exports.addSignUpDetails = async (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const pnone = req.body.phone;
    const password = req.body.password;

    try {
        const availableUser = await User.findAll({ where: { email: email } });

        if (availableUser.length !== 0) {
            return res.status(409).json({ message: 'User is already available' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        await User.create({
            name: name,
            email: email,
            phone: pnone,
            password: hashedPassword
        });

        res.status(200).json({ message: "submitted" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error occurred while saving user details" });
    }
};