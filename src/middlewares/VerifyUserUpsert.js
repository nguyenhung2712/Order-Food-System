const { User } = require("../models");

const checkExistedEmail = async (req, res, next) => {
    const { email } = req.body;
    if (!email) {
        next();
    } else {
        await User.findOne({
            where: { email: email }
        }).then(mail => {
            if (mail) {
                return res.status(400).json({
                    status: "error",
                    message: "Email vừa nhập đã tồn tại"
                });
            }
            next();
        });
    }
}

const checkExistedUsername = async (req, res, next) => {
    const { username } = req.body;
    if (!username) {
        next();
    } else {
        await User.findOne({
            where: { username }
        }).then(user => {
            if (user) {
                return res.status(400).json({
                    status: "error",
                    message: "Username vừa nhập đã tồn tại"
                });
            }
            next();
        });
    }
}

module.exports = {
    checkExistedEmail,
    checkExistedUsername
}