const express = require("express");
const { validateToken } = require("../middlewares/Auth");
const router = express.Router();
const { OrderDetails, Dish, Order } = require("../models");

router.get("/order-details/:type/:id", validateToken, async (req, res) => {
    try {
        const { type, id } = req.params.type;
        const details = await OrderDetails.findAll({
            where: { 
                isEnabled: type === "all" ? 1 : 0,
                orderId: id
            },
            include: ["Order", "Dish"]
        });
        if (!details || details.length === 0) {
            res.json({ 
                status: "error",
                text: "Doesn't exist!" 
            });
        } else {
            res.json({ 
                status: "success",
                text: `Get order details of order ${id} successfully.`,
                payload: details
            });
        }
    } catch (err) {
        res.json({
            status: "error",
            text: err
        });
    }
});

router.get("/:orderId/:dishId", validateToken, async (req, res) => {
    try {
        const { orderId, dishId } = req.params.id;
        const detail = await OrderDetails.findOne({ 
            include: ["Order", "Dish"] ,
            where: { 
                orderId: orderId,
                dishId: dishId
            }, 
        });

        if (!detail) {
            res.json({ 
                status: "error",
                text: "Doesn't exist!" 
            });
        } else {
            res.json({ 
                status: "success",
                text: "Get detail Successfully.",
                payload: detail
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
        const { orderId, dishId, ...body } = req.body;
        const order = await Order.findByPk(orderId);
        const dish = await Dish.findByPk(dishId);
        OrderDetails.create({...body})
            .then(detailRes => {
                detailRes.setOrder(order);
                detailRes.setDish(dish);
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

router.put("/update", validateToken, async (req, res) => {
    try {
        const { orderId, dishId, ...body } = req.body;
        const order = await Order.findByPk(orderId);
        const dish = await Dish.findByPk(dishId);
        const detail = await OrderDetails.findOne({ 
            include: ["Order", "Dish"] ,
            where: { 
                orderId: orderId,
                dishId: dishId
            }, 
        });
        if (!detail) {
            res.json({
                status: "error",
                text: "This type doesn't exist!"
            });
        }
        OrderDetails.update(
            { ...body,},
            { 
                where: { 
                    orderId: orderId,
                    dishId: dishId
                },  
            }
        )
            .then(detailRes => {
                detailRes.setOrder(order);
                detailRes.setDish(dish);
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

router.put("/:toggle/:orderId/:dishId", validateToken, async (req, res) => {
    try {
        const { toggle, orderId, dishId } = req.params;
        const detail = await OrderDetails.findOne({ 
            include: ["Order", "Dish"] ,
            where: { 
                orderId: orderId,
                dishId: dishId
            }, 
        });
        if (!detail) {
            res.json({
                status: "error",
                text: "This detail doesn't exist!"
            });
        }
        OrderDetails.update(
            { isEnabled: toggle === "unable" ? 0 : 1 },
            { where: { id: id } }
        )
            .then(detailRes => {
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