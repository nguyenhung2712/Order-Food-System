const express = require("express");
const bcrypt = require("bcrypt");
const { validateToken } = require("../middlewares/Auth");
const router = express.Router();
const { User } = require("../models");

router.get("/:type", validateToken, async (req, res) => {
    try {
        const type = req.params.type;
        const users = await User.findAll({
            where: { isEnabled: type === "all" ? 1 : 0 },
            include: "Info"
        });

        if (!users || users.length === 0) {
            res.json({ 
                status: "error",
                text: "Doesn't Exist!" 
            });
        } else {
            res.json({ 
                status: "success",
                text: "Get users successfully.",
                payload: users
            });
        }
    } catch (err) {
        res.json({
            status: "error",
            text: err
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
                text: "User Doesn't Exist!" 
            });
        } else {
            res.json({ 
                status: "success",
                text: "Get user successfully.",
                payload: user
            });
        }
    } catch (err) {
        res.json({
            status: "error",
            text: err
        });
    }
});

router.put("/change-password/:id", validateToken, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const id = req.params.id;
        const user = await User.findByPk(id);
    
        if (!user) {
            res.json({ 
                status: "error",
                text: "User Doesn't Exist!" 
            });
        } else {
            bcrypt.compare(oldPassword, user.password).then(async (match) => {
                if (!match) {
                    res.json({ 
                        status: "error",
                        text: "Wrong Password Entered!" 
                    });
                }
                bcrypt.hash(newPassword, 10).then((hash) => {
                    User.update(
                        { password: hash, },
                        { where: { username: user.username } }
                    )
                    res.json({ 
                        status: "success",
                        text: "Change account's password successfully.",
                    });
                });
            });
        }
    } catch (err) {
        res.json({
            status: "error",
            text: err
        });
    }
});

module.exports = router;