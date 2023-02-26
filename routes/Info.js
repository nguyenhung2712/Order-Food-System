const express = require("express");
const { validateToken } = require("../middlewares/Auth");
const router = express.Router();
const { Info } = require("../models");

router.get("/:type", validateToken, async (req, res) => {
    try {
        const type = req.params.type;
        const infos = await Info.findAll({
            where: { isEnabled: type === "all" ? 1 : 0 }
        });

        if (!infos || infos.length === 0) {
            res.json({ 
                status: "error",
                text: "These infos doesn't exist!" 
            });
        } else {
            res.json({ 
                status: "success",
                text: "Get infos successfully.",
                payload: infos
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
        const info = await Info.findByPk(id);

        if (!info) {
            res.json({ 
                status: "error",
                text: "This info doesn't exist!" 
            });
        } else {
            res.json({ 
                status: "success",
                text: "Get info successfully.",
                payload: info
            });
        }
    } catch (err) {
        res.json({
            status: "error",
            text: err
        });
    }
});

router.put("/update/:id", validateToken, async (req, res) => {
    try {
        const id = req.params.id;
        const info = await Info.findByPk(id);
        if (!info) {
            res.json({
                status: "error",
                text: "This info doesn't exist!"
            });
        }
        Info.update(
            { ...req.body,},
            { where: { id: id } }
        )
            .then(infoRes => {
                res.json({
                    status: "success",
                    text: "Update Successfully"
                });
            });
    } catch (err) {
        res.json({
            status: "error",
            text: err
        });
    }
});

router.put("/:toggle/:id", validateToken, async (req, res) => {
    try {
        const { toggle, id } = req.params;
        const info = await Info.findByPk(id);
        if (!info) {
            res.json({
                status: "error",
                text: "This info doesn't exist!"
            });
        }
        Info.update(
            { isEnabled: toggle === "unable" ? 0 : 1 },
            { where: { id: id } }
        )
            .then(infoRes => {
                res.json({
                    status: "success",
                    text: "Successfully"
                });
            });
    } catch (err) {
        res.json({
            status: "error",
            text: err
        });
    }
});

module.exports = router;