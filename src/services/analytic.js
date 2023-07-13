const {
    User, Order, OrderDetail, Payment,
    DishType, Dish, Schedule, AdminStaff, ScheduleType, AdminSchedule,
    Interact, Comment, CommentRep, Blog,
    Reason, Address, Province, Region
} = require("../models");
const { Op } = require('sequelize');
require("dotenv").config();
const sequelize = require("../../connectdb");

const monthNums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const getDashboardInfo = () => new Promise(async (resolve, reject) => {
    try {
        const curDate = new Date();

        const timeSinceMonday = (curDate.getDay() - 1) * 24 * 60 * 60 * 1000 + curDate.getTime() % (24 * 60 * 60 * 1000);
        const startOfWeek = new Date(curDate.getTime() - timeSinceMonday);

        const lastWeekDate = new Date(curDate.getTime() - 7 * 24 * 60 * 60 * 1000);

        // Doanh thu theo 12 tháng
        const payments = await Payment.findAll({ where: { status: 1 } });
        let revevueOfMonths = payments.reduce((acc, payment) => {
            let date = new Date(payment.updatedAt);
            let month = date.getMonth() + 1;
            acc[month] = (acc[month] ? acc[month] : 0) + Number(payment.paymentTotal)
            return acc;
        }, {});
        let revenueOf12Month = monthNums.map(month => (month in revevueOfMonths) ? revevueOfMonths[month] : 0)

        //Khách hàng mới, doanh thu tuần, SL đơn hàng, tình trạng shop
        const userRes = await User.findAndCountAll({
            where: {
                createdAt: {
                    [Op.between]: [lastWeekDate, curDate]
                }
            }
        })
        const weekPayments = await Payment.findAll({
            where: {
                status: 1,
                /* updatedAt: {
                    [Op.between]: [startOfWeek, curDate]
                } */
            }
        });
        let weekRevenue = weekPayments.reduce((acc, payment) => acc + Number(payment.paymentTotal), 0);


        //Doanh thu theo loại
        const types = await DishType.findAll({
            include: [
                {
                    model: Dish, include: [
                        {
                            model: OrderDetail, include: [
                                {
                                    model: Order, as: "order", where: { status: 1 }
                                }
                            ]
                        }
                    ]
                }
            ]
        });
        const products = await Dish.findAll({
            include: [
                {
                    model: OrderDetail, include: [
                        {
                            model: Order, as: "order", where: { status: 1 }
                        }
                    ]
                }
            ]
        });
        const schedules = await Schedule.findAll({
            include: [
                { model: ScheduleType, as: "type" },
                {
                    model: AdminSchedule,
                    include: [
                        { model: AdminStaff, as: "admin" }
                    ]
                }
            ]
        });

        resolve({
            status: "success",
            message: "Get dashboard info successfully.",
            payload: {
                revenueOf12Month,
                newUsers: userRes.count,
                weekRevenue,
                types,
                products,
                schedules
            }
        });
    } catch (error) {
        reject(error);
    }
})

const getBlogInfo = () => new Promise(async (resolve, reject) => {
    try {
        const blogs = await Blog.findAll({
            include: [
                { model: User, as: "user", },
                {
                    model: Interact,
                    where: { blogId: { [Op.not]: null } },
                    required: false,
                    include: [{ model: User, as: "user" }]
                },
                {
                    model: Comment, include: [
                        { model: CommentRep }
                    ]
                },
            ],
            attributes: { attributes: { exclude: ['userId'] } }
        });
        resolve({
            status: "success",
            message: "Get blogs info successfully.",
            payload: {
                blogs
            }
        });
    } catch (error) {
        reject(error);
    }
});

const getOrderInfo = () => new Promise(async (resolve, reject) => {
    try {
        const orders = await Order.findAll({
            include: [{ model: OrderDetail }]
        })
        let packaged = orders.filter((order) => (order.OrderDetails.length > 0 && [1, 2, 3].includes(order.status))).length;
        let shipping = orders.filter((order) => (order.OrderDetails.length > 0 && [1, 2].includes(order.status))).length;
        let delivered = orders.filter((order) => (order.OrderDetails.length > 0 && [1].includes(order.status))).length;
        let billed = orders.reduce((acc, order) => acc + order.billedNum, 0);

        let date = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
        const dishSubquery = `(SELECT IFNULL(SUM(quantity), 0) FROM orderdetails WHERE dishId = Dish.id AND DATE(createdAt) >= '${date.slice(0, 10)}')`;
        const dishes = await Dish.findAll({
            attributes: { include: [[sequelize.literal(`(Dish.quantityInDay - ${dishSubquery})`), 'quantityLeft']] }
        });
        let quantityLeft = dishes.reduce((acc, dish) => acc + Number(dish.dataValues.quantityLeft), 0);
        let sold = dishes.reduce((acc, dish) => acc + (dish.dataValues.quantityInDay - Number(dish.dataValues.quantityLeft)), 0)
        let stockout = dishes.filter((dish) => Number(dish.dataValues.quantityLeft) === 0).length;
        let lowStock = dishes.filter((dish) => Number(dish.dataValues.quantityLeft) <= 25).length;
        let inStock = dishes.filter((dish) => Number(dish.dataValues.quantityLeft) > 25).length;

        const cardData = {
            packaged, shipping, delivered, billed,
            quantityLeft, sold
        }
        const stockData = [
            { name: "Hết hàng", value: stockout, id: "stockout" },
            { name: "Còn ít", value: lowStock, id: "low-stock" },
            { name: "Có sẵn", value: inStock, id: "in-stock" }
        ]

        resolve({
            status: "success",
            message: "Get blogs info successfully.",
            payload: {
                cardData,
                stockData,
                orders
            }
        });
    } catch (error) {
        reject(error);
    }
});

const getProductInfo = () => new Promise(async (resolve, reject) => {
    try {
        const products = await Dish.findAll({
            include: [
                {
                    model: OrderDetail, include: [
                        {
                            model: Order, as: "order",
                            where: { status: 1 },
                        }
                    ]
                }
            ]
        });
        const details = await OrderDetail.findAll({
            include: [
                {
                    model: Order, as: "order", include: [
                        {
                            model: Address, as: "address",
                            include: [
                                {
                                    model: Province, as: "province", include: [
                                        { model: Region, as: "region" }
                                    ]
                                }
                            ]
                        }
                    ],
                }
            ]
        });

        const types = await DishType.findAll({
            include: [
                {
                    model: Dish, include: [
                        {
                            model: OrderDetail, include: [
                                {
                                    model: Order, as: "order"
                                }
                            ]
                        }
                    ]
                }
            ]
        });


        resolve({
            status: "success",
            message: "Get products info successfully.",
            payload: {
                products,
                details,
                types,
            }
        });
    } catch (error) {
        reject(error);
    }
});

const getBlogReportInfo = () => new Promise(async (resolve, reject) => {
    try {
        let blogReasons = await Reason.findAll({
            include: [
                {
                    model: Interact,
                    where: {
                        type: 2,
                        blogId: {
                            [Op.not]: null
                        },
                    },
                    required: false
                }
            ]
        });
        let blogNoneReason = await Interact.findAll({
            where: {
                reasonId: null,
                type: 2,
                blogId: {
                    [Op.not]: null
                },
            }
        });
        blogReasons = blogReasons.map(reason => ({
            name: reason.reasonName,
            value: reason.Interacts.length
        }));
        blogReasons.push({
            name: "Lý do khác",
            value: blogNoneReason.length
        });

        const blogReports = await Interact.findAll({
            where: {
                blogId: {
                    [Op.not]: null
                },
                type: 2
            }
        });

        resolve({
            status: "success",
            message: "Get report info successfully.",
            payload: {
                blogReasons,
                blogReports
            }
        });
    } catch (error) {
        reject(error);
    }
});
const getRatingReportInfo = () => new Promise(async (resolve, reject) => {
    try {
        let ratingReasons = await Reason.findAll({
            include: [
                {
                    model: Interact,
                    where: {
                        type: 2,
                        ratingId: {
                            [Op.not]: null
                        },
                    },
                    required: false
                }
            ]
        });
        let ratingNoneReason = await Interact.findAll({
            where: {
                reasonId: null,
                type: 2,
                ratingId: {
                    [Op.not]: null
                },
            }
        });
        ratingReasons = ratingReasons.map(reason => ({
            name: reason.reasonName,
            value: reason.Interacts.length
        }));
        ratingReasons.push({
            name: "Lý do khác",
            value: ratingNoneReason.length
        });

        const ratingReports = await Interact.findAll({
            where: {
                ratingId: {
                    [Op.not]: null
                },
                type: 2
            }
        });

        resolve({
            status: "success",
            message: "Get report info successfully.",
            payload: {
                ratingReasons,
                ratingReports
            }
        });
    } catch (error) {
        reject(error);
    }
});

const getCmtReportInfo = () => new Promise(async (resolve, reject) => {
    try {
        let cmtReasons = await Reason.findAll({
            include: [
                {
                    model: Interact,
                    where: {
                        type: 2,
                        commentId: {
                            [Op.not]: null
                        },
                        repId: {
                            [Op.not]: null
                        },
                    },
                    required: false
                }
            ]
        });
        let cmtNoneReason = await Interact.findAll({
            where: {
                reasonId: null,
                type: 2,
                commentId: {
                    [Op.not]: null
                },
                repId: {
                    [Op.not]: null
                },
            }
        });
        cmtReasons = cmtReasons.map(reason => ({
            name: reason.reasonName,
            value: reason.Interacts.length
        }));
        cmtReasons.push({
            name: "Lý do khác",
            value: cmtNoneReason.length
        });

        const cmtReports = await Interact.findAll({
            where: {
                commentId: {
                    [Op.not]: null
                },
                repId: {
                    [Op.not]: null
                },
                type: 2
            }
        });

        resolve({
            status: "success",
            message: "Get report info successfully.",
            payload: {
                cmtReasons,
                cmtReports
            }
        });
    } catch (error) {
        reject(error);
    }
});

module.exports = {
    getDashboardInfo,
    getBlogInfo,
    getOrderInfo,
    getProductInfo,
    getBlogReportInfo,
    getRatingReportInfo,
    getCmtReportInfo
}