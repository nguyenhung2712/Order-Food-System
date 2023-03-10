const { User } = require("../models");

const comparePassword = async (req, res, next) => {
    
    User.findOne({ 
        where: { username: req.body.username }
    })
        .then(userRes => {
            if (userRes) {
                res.status(400).json({
                    status: "error",
                    text: "Your username has been used, Please enter another username!"
                });
            }
            next();
        });
}

module.exports = { comparePassword }