const { User } = require("../models");

const checkExistedEmail = async (req, res, next) => {
    const { email } = req.body;
    await User.findOne({ 
        where: { email: email }
    }).then(userByMail => {
        if (userByMail) {
            console.log(userByMail);
            return res.status(400).json({
                status: "error",
                message: "Email vừa nhập đã tồn tại"
            });
        }
        next();
    });
}

module.exports = { checkExistedEmail }