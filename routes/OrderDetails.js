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
                message: "Doesn't exist!" 
            });
        } else {
            res.json({ 
                status: "success",
                message: `Get order details of order ${id} successfully.`,
                payload: details
            });
        }
    } catch (err) {
        res.json({
            status: "error",
            message: err
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
                message: "Doesn't exist!" 
            });
        } else {
            res.json({ 
                status: "success",
                message: "Get detail Successfully.",
                payload: detail
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
        const { orderId, dishId, ...body } = req.body;
        const order = await Order.findByPk(orderId);
        const dish = await Dish.findByPk(dishId);
        OrderDetails.create({...body})
            .then(detailRes => {
                detailRes.setOrder(order);
                detailRes.setDish(dish);
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
                message: "This type doesn't exist!"
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
                message: "This detail doesn't exist!"
            });
        }
        OrderDetails.update(
            { isEnabled: toggle === "unable" ? 0 : 1 },
            { where: { id: id } }
        )
            .then(detailRes => {
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