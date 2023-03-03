const express = require("express");
const { validateToken } = require("../middlewares/Auth");
const router = express.Router();
const { Order, User, Payment } = require("../models");

router.get("/:type", async (req, res) => {
    try {
        const type = req.params.type;
        const orders = await Order.findAll({
            where: { isEnabled: type === "all" ? 1 : 0 },
            include: ["User", "Payment"]
        });

        if (!orders || orders.length === 0){
            res.json({ 
                status: "error",
                message: "Doesn't exist!" 
            });
        } else {
            res.json({ 
                status: "success",
                message: "Get orders successfully.",
                payload: orders
            });
        }
    } catch (err) {
        res.json({
            status: "error",
            message: err
        });
    }
});

router.get("/user-order/:id", validateToken, async (req, res) => {
    try {
        const id = req.params.id;
        const orders = await Order.findAll({
            where: { userId: id },
            include: ["User", "Payment"]
        });

        if (!orders || orders.length === 0) {
            res.json({ 
                status: "error",
                message: "Doesn't exist!" 
            });
        } else {
            res.json({ 
                status: "success",
                message: "Get orders successfully.",
                payload: orders
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
        const order = await Order.findByPk(id, { include: ["User", "Payment"] });

        if (!order) {
            res.json({ 
                status: "error",
                message: "Order doesn't exist!" 
            });
        } else {
            res.json({ 
                status: "success",
                message: "Get order Successfully.",
                payload: order
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
        const { UserId, PaymentId, ...body } = req.body;
        const user = await User.findByPk(UserId);
        const payment = await Payment.findByPk(PaymentId);
        Order.create({...body})
            .then(orderRes => {
                orderRes.setUser(user);
                orderRes.setPayment(payment);
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
        const order = await Order.findByPk(id);
        const { UserId, PaymentId, ...body } = req.body;
        const user = await User.findByPk(UserId);
        const payment = await Payment.findByPk(PaymentId);
        if (!order) {
            res.json({
                status: "error",
                message: "This type doesn't exist!"
            });
        }
        Order.update(
            { ...body,},
            { where: { id: id } }
        )
            .then(orderRes => {
                orderRes.setUser(user);
                orderRes.setPayment(payment);
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
        const order = await Order.findByPk(id);
        if (!order) {
            res.json({
                status: "error",
                message: "This type doesn't exist!"
            });
        }
        Order.update(
            { isEnabled: toggle === "unable" ? 0 : 1 },
            { where: { id: id } }
        )
            .then(orderRes => {
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