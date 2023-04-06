require("dotenv").config();
const { AdminStaff } = require("../models");

const isExistedUsername = (req, res, next) => {
	const { username } = req.body;
    AdminStaff.findOne({ 
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

module.exports = {
    isExistedUsername
}