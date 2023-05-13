const express = require("express");
const router = express.Router();
const fileUploader = require('../config/cloudinary.config');

const { Auth } = require("../middlewares");
const { userController } = require("../controllers");
const { VerifyUserUpsert, VerifyExists } = require("../middlewares");

router.get('/all', Auth.validateToken, userController.getAll);
router.get('/:id', userController.getUser);
router.post('/gmail', userController.getUserByEmail);
router.post('/create', [Auth.validateToken], userController.createUser);
router.put('/change-password/:id', [Auth.validateToken], userController.changePassword);
router.put('/update/:id', [Auth.validateToken, VerifyUserUpsert.checkExistedUsername, VerifyUserUpsert.checkExistedEmail], userController.updateUser);
router.put('/upload-avatar/:id',
    [Auth.validateToken, VerifyExists.isExistedUser,
    fileUploader.single('image')],
    userController.uploadAvatarUser);

/* router.get("/:type", [validateToken], async (req, res) => {
    try {
        const type = req.params.type;
        const users = await User.findAll({
            where: { isEnabled: type === "all" ? 1 : 0 },
            include: "Info"
        });

        if (!users || users.length === 0) {
            res.json({ 
                status: "error",
                message: "Doesn't Exist!" 
            });
        } else {
            res.json({ 
                status: "success",
                message: "Get users successfully.",
                payload: users
            });
        }
    } catch (err) {
        res.json({
            status: "error",
            message: err
        });
    }
});

router.get("/:id", validateToken, async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findByPk(id, { include: "Info" });
        if (!user) {
            res.json({ 
                status: "error",
                message: "User Doesn't Exist!" 
            });
        } else {
            res.json({ 
                status: "success",
                message: "Get user successfully.",
                payload: user
            });
        }
    } catch (err) {
        res.json({
            status: "error",
            message: err
        });
    }
});

router.post("/change-password/:id/:token", validateToken, async (req, res) => {
    try {
        const { userId, token } = req.params;
        const { password } = req.body;
        const user = await User.findByPk(userId);
        let currToken = await Token.findOne({ 
            where: { 
                UserId: user.id, 
                token: token
            } 
        });

        if (!currToken) {
            return res.json({ 
                status: "error",
                message: "Invalid link" 
            });
        }
    
        if (!user) {
            res.json({ 
                status: "error",
                message: "User Doesn't Exist!" 
            });
        } else {
            bcrypt.hash(password, 10).then((hash) => {
                User.update(
                    { password: hash, },
                    { where: { username: user.username } }
                )
                res.json({ 
                    status: "success",
                    message: "Change account's password successfully.",
                });
            });
        }
    } catch (err) {
        res.json({
            status: "error",
            message: err
        });
    }
});

router.put("/change-password/:id", validateToken, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findByPk(req.params.id);

        if (!user) {
            res.json({ 
                status: "error",
                message: "User Doesn't Exist!" 
            });
        }

        if (user.is2FA) {
            
            // send

        } else {
            bcrypt.compare(oldPassword, user.password).then(async (match) => {
                if (!match) {
                    res.json({ 
                        status: "error",
                        message: "Wrong Password Entered!" 
                    });
                }
                bcrypt.hash(newPassword, 10).then((hash) => {
                    User.update(
                        { password: hash, },
                        { where: { username: user.username } }
                    )
                    res.json({ 
                        status: "success",
                        message: "Change account's password successfully.",
                    });
                });
            });
        }
    } catch (err) {
        res.json({
            status: "error",
            message: err
        });
    }
}); */



module.exports = router;