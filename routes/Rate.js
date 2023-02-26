const express = require("express");
const { validateToken } = require("../middlewares/Auth");
const router = express.Router();
const { Rate, Dish, User } = require("../models");

router.get("/:type", async (req, res) => {
    try {
        const type = req.params.type;
        const rates = await Rate.findAll({
            where: { isEnabled: type === "all" ? 1 : 0 },
            include: ["User", "Dish"]
        });

        if (!rates || rates.length === 0) {
            res.json({ 
                status: "error",
                text: "These rates doesn't exist!" 
            });
        } else {
            res.json({ 
                status: "success",
                text: "Get rates successfully.",
                payload: rates
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
        const rate = await Rate.findByPk(id, { include: ["User", "Dish"] });

        if (!rate) {
            res.json({ 
                status: "error",
                text: "This rate doesn't exist!" 
            });
        } else {
            res.json({ 
                status: "success",
                text: "Get rate successfully.",
                payload: rate
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
        const { UserId, DishId, ...body } = req.body;
        const user = await User.findByPk(UserId);
        const dish = await Dish.findByPk(DishId);
        Order.create({...body})
            .then(rateRes => {
                rateRes.setUser(user);
                rateRes.setDish(dish);
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
        const rate = await Rate.findByPk(id);
        const { UserId, DishId, ...body } = req.body;
        const user = await User.findByPk(UserId);
        const dish = await Dish.findByPk(DishId);
        if (!rate) {
            res.json({
                status: "error",
                text: "This rate doesn't exist!"
            });
        }
        Rate.update(
            { ...body,},
            { where: { id: id } }
        )
            .then(rateRes => {
                rateRes.setUser(user);
                rateRes.setDish(dish);
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
        const rate = await Rate.findByPk(id);
        if (!rate) {
            res.json({
                status: "error",
                text: "This rate doesn't exist!"
            });
        }
        Rate.update(
            { isEnabled: toggle === "unable" ? 0 : 1 },
            { where: { id: id } }
        )
            .then(rateRes => {
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