const {
    Order, Payment, User, OrderDetail,
    District, Province, Ward, UserAddress, Address, Dish, DishType,
    History
} = require("../models");
const { v4: uuidv4 } = require("uuid");
const sendEmail = require("../utils/sendEmail");

const getAll = () => new Promise(async (resolve, reject) => {
    try {
        const response = await Order.findAll({
            include: [
                {
                    model: User, as: "user",
                    include: [
                        {
                            model: UserAddress,
                            include: [
                                {
                                    model: Address, as: "address",
                                    include: [
                                        { model: Province, as: "province" },
                                        { model: District, as: "district" },
                                        { model: Ward, as: "ward" },
                                    ]
                                }
                            ]
                        }
                    ]
                },
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
                        { model: Dish, as: "dish", include: [{ model: DishType, as: "type" }] },
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
                {
                    model: User, as: "user",
                    include: [
                        {
                            model: UserAddress,
                            include: [
                                {
                                    model: Address, as: "address",
                                    include: [
                                        { model: Province, as: "province" },
                                        { model: District, as: "district" },
                                        { model: Ward, as: "ward" },
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    model: Address, as: "address",
                    include: [
                        { model: Province, as: "province" },
                        { model: District, as: "district" },
                        { model: Ward, as: "ward" },
                        { model: UserAddress }
                    ]
                },
                {
                    model: OrderDetail,
                    include: [
                        { model: Dish, as: "dish", include: [{ model: DishType, as: "type" }] },
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
                {
                    model: User, as: "user",
                    include: [
                        {
                            model: UserAddress,
                            include: [
                                {
                                    model: Address, as: "address",
                                    include: [
                                        { model: Province, as: "province" },
                                        { model: District, as: "district" },
                                        { model: Ward, as: "ward" },
                                    ]
                                }
                            ]
                        }
                    ]
                },
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
                        { model: Dish, as: "dish", include: [{ model: DishType, as: "type" }] },
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
                        await History.create({
                            userId: order.userId, orderId: order.id, action: `Đã đặt đơn hàng #${order.number}`
                        });
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

const checkout = (orderId) => new Promise(async (resolve, reject) => {
    try {
        await Order.findByPk(orderId, {
            include: [
                {
                    model: User, as: "user",
                    include: [
                        {
                            model: UserAddress,
                            include: [
                                {
                                    model: Address, as: "address",
                                    include: [
                                        { model: Province, as: "province" },
                                        { model: District, as: "district" },
                                        { model: Ward, as: "ward" },
                                    ]
                                }
                            ]
                        }
                    ]
                },
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
                        { model: Dish, as: "dish", include: [{ model: DishType, as: "type" }] },
                    ]
                },
                { model: Payment, as: "payment" },
            ],
        })
            .then(async (order) => {
                const formatCurrency = new Intl.NumberFormat("en", {
                    style: 'currency',
                    currency: "USD",
                });
                await sendEmail(order.user.email, "Ordered Successfully", '',
                    `<!DOCTYPE html>
                <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
                    xmlns:o="urn:schemas-microsoft-com:office:office">
                
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="x-apple-disable-message-reformatting">
                    <title></title>
                
                    <link href="https://fonts.googleapis.com/css?family=Roboto:400,600" rel="stylesheet" type="text/css">
                
                    <style>
                        html,
                        body {
                            margin: 0 auto !important;
                            padding: 0 !important;
                            height: 100% !important;
                            width: 100% !important;
                            font-family: 'Roboto', sans-serif !important;
                            font-size: 14px;
                            margin-bottom: 10px;
                            line-height: 24px;
                            color: #8094ae;
                            font-weight: 400;
                        }
                
                        * {
                            -ms-text-size-adjust: 100%;
                            -webkit-text-size-adjust: 100%;
                            margin: 0;
                            padding: 0;
                        }
                
                        table,
                        td {
                            mso-table-lspace: 0pt !important;
                            mso-table-rspace: 0pt !important;
                        }
                
                        table {
                            border-spacing: 0 !important;
                            border-collapse: collapse !important;
                            table-layout: fixed !important;
                            margin: 0 auto !important;
                        }
                
                        table table table {
                            table-layout: auto;
                        }
                
                        a {
                            text-decoration: none;
                        }
                
                        img {
                            -ms-interpolation-mode: bicubic;
                        }
                    </style>
                
                </head>
                
                <body width="100%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #f5f6fa;">
                    <center style="width: 100%; background-color: #f5f6fa;">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#f5f6fa">
                            <tr>
                                <td style="padding: 40px 0;">
                                    <table style="width:100%;max-width:620px;margin:0 auto;">
                                        <tbody>
                                            <tr>
                                                <td style="text-align: center; padding-bottom:25px">
                                                    <a href="#"><img style="height: 40px" src="images/logo-dark2x.png" alt="logo"></a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table style="width:100%;max-width:620px;margin:0 auto;background-color:#ffffff;">
                                        <tbody>
                                            <tr>
                                                <td style="padding: 30px 30px 20px">
                                                    <p
                                                        style="text-align:center; font-size: 28px; font-weight: bold;padding-top: 12px; margin-bottom: 24px;">
                                                        Ordered Successfully</p>
                                                    <p style="margin-bottom: 10px;">Hi ${order.user.firstName + " " + order.user.lastName},</p>
                                                    <p style="margin-bottom: 10px;">We send you an invoice for your order
                                                        ${order.number}, please check your invoice.</p>
                                                    <p style="margin-bottom: 15px;">Hope you'll enjoy the experience, we're here if you
                                                        have any questions, drop us a line at <a
                                                            style="color: #6576ff; text-decoration:none;"
                                                            href="mailto:hung.n.61cnttclc@ntu.edu.vn">hung.n.61cnttclc@ntu.edu.vn</a>
                                                        anytime. </p>
                                                    <p style="margin-bottom: 10px;">We are glad you chose us to place your order. We
                                                        hope that you will be satisfied with your choice.</p>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table style="margin-top: 12px; width:100%;max-width:620px;margin:0 auto;background-color:#ffffff;">
                                        <thead>
                                            <tr>
                                                <th colspan="2"
                                                    style="padding-left: 30px; color: #6576ff; border-bottom: 1px solid #6576ff"
                                                    align="left">
                                                    ORDER INFORMATION #${order.number} (July 13, 2020 21:10:40 +07)
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                
                                            <tr>
                                                <td style="padding: 10px 20px 0; font-weight: bold;">
                                                    Billing Information
                                                </td>
                                                <td style="padding: 10px 20px 0; font-weight: bold;">
                                                    Delivery address
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 5px 20px">
                                                    <span style="display: block">${order.user.firstName + " " + order.user.lastName}</span>
                                                    <span style="display: block">${order.user.email}</span>
                                                    <span style="display: block">${order.user.phoneNum}</span>
                                                </td>
                                                <td style="padding: 5px 20px">
                                                    <span style="display: block">${order.user.firstName + " " + order.user.lastName}</span>
                                                    <span style="display: block">${order.address.addressEn + " Street"}</span>
                                                    <span style="display: block">${order.address.ward.fullnameEn + ", " + order.address.district.fullnameEn + ", " + order.address.province.fullnameEn}</span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                
                                    <table style=" width:100%;max-width:620px;margin:0 auto;background-color:#ffffff;">
                                        <thead>
                                            <tr>
                                                <th colspan="4"
                                                    style="padding-left: 30px; color: #6576ff; border-bottom: 1px solid #6576ff"
                                                    align="left">
                                                    ORDER DETAILS
                                                </th>
                                            </tr>
                                            <tr style=" border-bottom: 1px solid #6576ff">
                                                <th style="padding: 10px 20px ; font-weight: bold;" align="left">
                                                    Name
                                                </th>
                                                <th style="padding: 10px 20px ; font-weight: bold;" align="left">
                                                    Price
                                                </th>
                                                <th style="padding: 10px 20px ; font-weight: bold;" align="left">
                                                    Quantity
                                                </th>
                                                <th style="padding: 10px 20px ; font-weight: bold;" align="right">
                                                    Subtotal
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${order.OrderDetails.map((detail) => (
                        `<tr><td style="padding: 5px 20px" align="left">${detail.dish.dishNameEn}</td><td style="padding: 5px 20px" align="left">${formatCurrency.format(detail.dish.price)}</td><td style="padding: 5px 20px" align="left">${detail.quantity}</td><td style="padding: 5px 20px" align="right">${formatCurrency.format(Number(detail.quantity) * (Number(detail.dish.price) * 43) / 1000000)}</td></tr>`
                    ))}
                                            <tr>
                                                <td colspan="3" align="right" style="padding:7px 9px">
                                                    <strong><big>Total:</big></strong>
                                                </td>
                                                <td align="right" style="padding:5px 20px">
                                                    <strong><big><span>${formatCurrency.format(order.OrderDetails.reduce((accumulate, detail) => {
                        let price = (detail.dish.price * 43) / 1000000;
                        return accumulate + Number(price) * Number(detail.quantity)
                    }, 0))}</span></big></strong>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </center>
                </body>
                
                </html>`);
                resolve({
                    status: "success",
                    message: "Create order successfully.",
                    payload: order
                });
            });
    } catch (error) {
        reject(error);
    }
})

const updateOrder = (orderId, orderBody) => new Promise(async (resolve, reject) => {
    try {
        await Order.update(
            { ...orderBody },
            { where: { id: orderId } }
        )
            .then(() => Order.findByPk(orderId, {
                include: [
                    {
                        model: User, as: "user",
                        include: [
                            {
                                model: UserAddress,
                                include: [
                                    {
                                        model: Address, as: "address",
                                        include: [
                                            { model: Province, as: "province" },
                                            { model: District, as: "district" },
                                            { model: Ward, as: "ward" },
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
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
                            { model: Dish, as: "dish", include: [{ model: DishType, as: "type" }] },
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
                    {
                        model: User, as: "user",
                        include: [
                            {
                                model: UserAddress,
                                include: [
                                    {
                                        model: Address, as: "address",
                                        include: [
                                            { model: Province, as: "province" },
                                            { model: District, as: "district" },
                                            { model: Ward, as: "ward" },
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
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
                            { model: Dish, as: "dish", include: [{ model: DishType, as: "type" }] },
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
                    {
                        model: User, as: "user",
                        include: [
                            {
                                model: UserAddress,
                                include: [
                                    {
                                        model: Address, as: "address",
                                        include: [
                                            { model: Province, as: "province" },
                                            { model: District, as: "district" },
                                            { model: Ward, as: "ward" },
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
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
                            { model: Dish, as: "dish", include: [{ model: DishType, as: "type" }] },
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
    recoverOrder,
    checkout
}