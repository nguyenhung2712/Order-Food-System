const { Order, Payment, User, Address, District, Province, Ward, OrderDetail, Dish } = require("../models");
const { v4: uuidv4 } = require("uuid");
const sendEmail = require("../utils/sendEmail");

const getAll = () => new Promise(async (resolve, reject) => {
    try {
        const response = await Order.findAll({
            include: [
                { model: User, as: "user" },
                {
                    model: Address, as: "address",
                    include: [
                        { model: Province, as: "province" },
                        { model: District, as: "district" },
                        { model: Ward, as: "ward" },
                    ]
                },
                {
                    model: OrderDetail,
                    include: [
                        { model: Dish, as: "dish" },
                    ]
                },
                { model: Payment, as: "payment" },
            ],
        });
        resolve({
            status: "success",
            message: "Get orders successfully.",
            payload: response
        });
    } catch (error) {
        reject(error);
    }
});

const getById = (orderId) => new Promise(async (resolve, reject) => {
    try {
        const order = await Order.findOne({
            where: { id: orderId },
            include: [
                { model: User, as: "user" },
                {
                    model: Address, as: "address",
                    include: [
                        { model: Province, as: "province" },
                        { model: District, as: "district" },
                        { model: Ward, as: "ward" },
                    ]
                },
                {
                    model: OrderDetail,
                    include: [
                        { model: Dish, as: "dish" },
                    ]
                },
                { model: Payment, as: "payment" },
            ],
        });
        resolve({
            status: "success",
            message: "Get order successfully.",
            payload: order
        });
    } catch (error) {
        reject(error);
    }
});

const getByUserId = (userId) => new Promise(async (resolve, reject) => {
    try {
        const orders = await Order.findAll({
            where: { userId },
            include: [
                { model: User, as: "user" },
                {
                    model: Address, as: "address",
                    include: [
                        { model: Province, as: "province" },
                        { model: District, as: "district" },
                        { model: Ward, as: "ward" },
                    ]
                },
                {
                    model: OrderDetail,
                    include: [
                        { model: Dish, as: "dish" },
                    ]
                },
                { model: Payment, as: "payment" },
            ],
        });
        resolve({
            status: "success",
            message: "Get orders successfully.",
            payload: orders
        });
    } catch (error) {
        reject(error);
    }
});

const createOrder = (paymentBody, orderBody) => new Promise(async (resolve, reject) => {
    try {
        await Payment.create({
            id: uuidv4(),
            ...paymentBody,
            deletedAt: null,
            status: 2
        })
            .then(async (payment) => {
                await Order.create({
                    id: uuidv4(),
                    ...orderBody,
                    paymentId: payment.id,
                    status: 4
                })
                    .then(async (order) => {
                        await sendEmail(orderBody.email, "Đặt hàng thành công", "Dưới đây là thông tin về đơn hàng của bạn....");
                        resolve({
                            status: "success",
                            message: "Create order successfully.",
                            payload: order
                        });
                    });
            });
    } catch (error) {
        reject(error);
    }
});

const updateOrder = (orderId, orderBody) => new Promise(async (resolve, reject) => {
    try {
        await Order.update(
            { ...orderBody },
            { where: { id: orderId } }
        )
            .then(() => Order.findByPk(orderId, {
                include: [
                    { model: User, as: "user" },
                    {
                        model: Address, as: "address",
                        include: [
                            { model: Province, as: "province" },
                            { model: District, as: "district" },
                            { model: Ward, as: "ward" },
                        ]
                    },
                    {
                        model: OrderDetail,
                        include: [
                            { model: Dish, as: "dish" },
                        ]
                    },
                    { model: Payment, as: "payment" },
                ],
            }))
            .then(order => {
                resolve({
                    status: "success",
                    message: "Update order successfully.",
                    payload: order
                });
            });
    } catch (error) {
        reject(error);
    }
});

const deleteOrder = (orderId) => new Promise(async (resolve, reject) => {
    try {
        await Order.update(
            {
                deletedAt: new Date(),
                status: 0
            },
            { where: { id: orderId } }
        )
            .then(() => Order.findByPk(orderId, {
                include: [
                    { model: User, as: "user" },
                    {
                        model: Address, as: "address",
                        include: [
                            { model: Province, as: "province" },
                            { model: District, as: "district" },
                            { model: Ward, as: "ward" },
                        ]
                    },
                    {
                        model: OrderDetail,
                        include: [
                            { model: Dish, as: "dish" },
                        ]
                    },
                    { model: Payment, as: "payment" },
                ],
            }))
            .then(order => {
                resolve({
                    status: "success",
                    message: "Delete order successfully.",
                    payload: order
                });
            });
    } catch (error) {
        reject(error);
    }
});

const recoverOrder = (orderId) => new Promise(async (resolve, reject) => {
    try {
        await Order.update(
            {
                deletedAt: null,
                status: 2
            },
            { where: { id: orderId } }
        )
            .then(() => Order.findByPk(orderId, {
                include: [
                    { model: User, as: "user" },
                    {
                        model: Address, as: "address",
                        include: [
                            { model: Province, as: "province" },
                            { model: District, as: "district" },
                            { model: Ward, as: "ward" },
                        ]
                    },
                    {
                        model: OrderDetail,
                        include: [
                            { model: Dish, as: "dish" },
                        ]
                    },
                    { model: Payment, as: "payment" },
                ],
            }))
            .then(order => {
                resolve({
                    status: "success",
                    message: "Recover order successfully.",
                    payload: order
                });
            });
    } catch (error) {
        reject(error);
    }
});

module.exports = {
    getAll,
    getById,
    getByUserId,
    createOrder,
    updateOrder,
    deleteOrder,
    recoverOrder
}