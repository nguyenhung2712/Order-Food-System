const express = require("express");
const { validateToken } = require("../middlewares/Auth");
const router = express.Router();
const { Payment } = require("../models");

router.get("/:type", async (req, res) => {
    try {
        const type = req.params.type;
        const payment = await Payment.findAll({
            where: { isEnabled: type === "all" ? 1 : 0 }
        });

        if (!payment || payment.length === 0) {
            res.json({ 
                status: "error",
                text: "Doesn't exist!" 
            });
        } else {
            res.json({ 
                status: "success",
                text: "Get payments successfully.",
                payload: payment
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
        const payment = await Payment.findByPk(id);

        if (!payment) {
            res.json({ 
                status: "error",
                text: "This payment doesn't exist!" 
            });
        } else {
            res.json({ 
                status: "success",
                text: "Get payment Successfully.",
                payload: payment
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
        Payment.create({...req.body})
            .then(paymentRes => {
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
        const payment = await Payment.findByPk(id);
        if (!payment) {
            res.json({
                status: "error",
                text: "This payment doesn't exist!"
            });
        }
        Payment.update(
            { ...req.body,},
            { where: { id: id } }
        )
            .then(paymentRes => {
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
        const payment = await Payment.findByPk(id);
        if (!payment) {
            res.json({
                status: "error",
                text: "This type doesn't exist!"
            });
        }
        Payment.update(
            { isEnabled: toggle === "unable" ? 0 : 1 },
            { where: { id: id } }
        )
            .then(paymentRes => {
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