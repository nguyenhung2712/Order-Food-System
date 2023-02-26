const express = require("express");
const { validateToken } = require("../middlewares/Auth");
const router = express.Router();
const { DishType } = require("../models");

router.get("/:type", async (req, res) => {
    try {
        const type = req.params.type;
        const dishTypes = await DishType.findAll({
            where: { isEnabled: type === "all" ? 1 : 0 }
        });

        if (!dishTypes || dishTypes.length === 0) {
            res.json({ 
                status: "error",
                text: "This type doesn't exist!" 
            });
        } else {
            res.json({ 
                status: "success",
                text: "Get dish types successfully.",
                payload: dishTypes
            });
        }
    } catch (err) {
        res.json({
            status: "error",
            text: err
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const dishType = await Dish.findByPk(id);

        if (!dishType) {
            res.json({ 
                status: "error",
                text: "This type doesn't exist!" 
            });
        } else {
            res.json({ 
                status: "success",
                text: "Get dish type Successfully.",
                payload: dishType
            });
        }
    } catch (err) {
        res.json({
            status: "error",
            text: err
        });
    }
});

router.post("/add", validateToken, async (req, res) => {
    try {
        DishType.create({...req.body})
            .then(dishTypeRes => {
                res.json({
                    status: "success",
                    text: "Add Successfully"
                });
            });
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
        const dishType = await DishType.findByPk(id);
        if (!dishType) {
            res.json({
                status: "error",
                text: "This type doesn't exist!"
            });
        }
        DishType.update(
            { ...req.body,},
            { where: { id: id } }
        )
            .then(dishTypeRes => {
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
        const dishType = await DishType.findByPk(id);
        if (!dishType) {
            res.json({
                status: "error",
                text: "This type doesn't exist!"
            });
        }
        DishType.update(
            { isEnabled: toggle === "unable" ? 0 : 1 },
            { where: { id: id } }
        )
            .then(dishTypeRes => {
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