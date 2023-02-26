const { User } = require("../models");

const checkExistedUsernameOrEmail = async (req, res, next) => {
    const { username, email } = req.body;

    User.findOne({ 
        where: { username: username }
    })
        .then(userRes => {
            if (userRes) {
                res.status(400).json({
                    status: "error",
                    text: "Your username has been used, Please enter another username!"
                });
            }
            User.findOne({ 
                where: { email: email }
            }).then(userRes => {
                if (userRes) {
                    res.status(400).json({
                        status: "error",
                        text: "Your email has been used, Please enter another email!"
                    });
                }
                next();
            });
        });
}

module.exports = { checkExistedUsernameOrEmail }