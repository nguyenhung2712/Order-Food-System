const { User } = require("../models");

const checkExistedUsernameOrEmail = async (req, res, next) => {
    const { username, email } = req.body;
    User.findOne({ 
        where: { username: username }
    })
        .then(userByUN => {
            if (userByUN) {
                res.status(400).json({
                    status: "error",
                    message: "Your username has been used, Please enter another username!"
                });
            }
            User.findOne({ 
                where: { email: email }
            }).then(userByMail => {
                if (userByMail) {
                    res.status(400).json({
                        status: "error",
                        message: "Your email has been used, Please enter another email!"
                    });
                }
                next();
            });
        });
}

module.exports = { checkExistedUsernameOrEmail }