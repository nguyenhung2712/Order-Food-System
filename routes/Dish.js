const express = require("express");
const { validateToken } = require("../middlewares/Auth");
const router = express.Router();
const { Dish, DishType } = require("../models");

router.get("/:type", async (req, res) => {
    try {
        const type = req.params.type;
        const dishes = await Dish.findAll({
            where: { isEnabled: type === "all" ? 1 : 0 }
        });

        if (!dishes || dishes.length === 0) {
            res.json({ 
                status: "error",
                message: "Doesn't Exist!" 
            });
        } else {
            res.json({ 
                status: "success",
                message: "Get dishes successfully.",
                payload: dishes
            });
        }
    } catch (err) {
        res.json({
            status: "error",
            message: err
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const dish = await Dish.findByPk(id);
        if (!dish) {
            res.json({ 
                status: "error",
                message: "Dish Doesn't Exist!" 
            });
        } else {
            res.json({ 
                status: "success",
                message: "Get dish successfully.",
                payload: dish
            });
        }
    } catch (err) {
        res.json({
            status: "error",
            message: err
        });
    }
});

router.post("/add", validateToken, async (req, res) => {
    try {
        const { DishTypeId, ...body } = req.body;
        const dishType = await DishType.findByPk(DishTypeId);
        if (!dishType) {
            res.json({
                status: "error",
                message: "This type doesn't exist!"
            });
        }
        Dish.create({
            ...body,
            isEnabled: 1
        })
            .then(dishRes => {
                dishRes.setDishType(dishType);
                res.json({
                    status: "success",
                    message: "Add Successfully"
                });
            });
    } catch (err) {
        res.json({
            status: "error",
            message: err
        });
    }
});

router.put("/update/:id", validateToken, async (req, res) => {
    try {
        const id = req.params.id;
        const { DishTypeId, ...body } = req.body;
        const dish = await DishType.findByPk(id);
        const dishType = await DishType.findByPk(DishTypeId);
        if (!dish) {
            res.json({
                status: "error",
                message: "Dish doesn't exist!"
            });
        }
        Dish.update(
            { 
                ...body,
                isEnabled: 1
            },
            { where: { id: id } }
        )
            .then(dishRes => {
                dishRes.setDishType(dishType);
                res.json({
                    status: "success",
                    message: "Update Successfully"
                });
            });
    } catch (err) {
        res.json({
            status: "error",
            message: err
        });
    }
});

router.put("/:toggle/:id", validateToken, async (req, res) => {
    try {
        const { toggle, id } = req.params;
        const dish = await DishType.findByPk(id);
        if (!dish) {
            res.json({
                status: "error",
                message: "Dish doesn't exist!"
            });
        }
        Dish.update(
            { isEnabled: toggle === "unable" ? 0 : 1 },
            { where: { id: id } }
        )
            .then(dishRes => {
                res.json({
                    status: "success",
                    message: "Successfully"
                });
            });
    } catch (err) {
        res.json({
            status: "error",
            message: err
        });
    }
});

module.exports = router;
