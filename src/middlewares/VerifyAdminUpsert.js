require("dotenv").config();
const { AdminStaff } = require("../models");

const checkExistedUsername = async (req, res, next) => {
    const { username } = req.body;
    await AdminStaff.findOne({
        where: { username }
    })
        .then(staff => {
            if (staff) {
                return res.json({
                    status: "error",
                    message: "Tên đăng nhập vừa nhập đã tồn tại"
                });
            }
            next();
        });
};
const checkExistedEmail = async (req, res, next) => {
    const { email } = req.body;
    await AdminStaff.findOne({
        where: { email }
    })
        .then(staff => {
            if (staff) {
                return res.json({
                    status: "error",
                    message: "Email vừa nhập đã tồn tại"
                });
            }
            next();
        });
};

module.exports = {
    checkExistedUsername,
    checkExistedEmail
}