const { 
    User, 
    OrderDetail, Order, Payment,
    DishType, Dish, 
    Rate,
    Cart,
    CartItem
} = require("../models");

const isExistedUser = async (req, res, next) => {
    let userId = req.body.userId ? req.body.userId : req.params.id;
    await User.findOne({ 
        where: { id: userId }
    })
        .then(userRes => {
            if (!userRes) {
                res.status(404).json({
                    status: "error",
                    message: "Doesn't Exist!"
                });
            }
            next();
        });
}

const areExistedUsers = async (req, res, next) => {
    await User.findAll()
        .then(users => {
            if (!users || users.length === 0) {
                res.status(404).json({
                    status: "error",
                    message: "Don't Exist!"
                });
            }
            next();
        });
}

const isExistedOrder = async (req, res, next) => {
    let orderId = req.body.orderId ? req.body.orderId : req.params.id;
    await Order.findOne({ 
        where: { id: orderId }
    })
        .then(order => {
            if (!order) {
                res.status(404).json({
                    status: "error",
                    message: "Order Doesn't Exist!"
                });
            }
            next();
        });
}

const areExistedOrders = async (req, res, next) => {
    let userId = req.body.userId ? req.body.userId : req.params.id;
    let orders;
    if (userId) {
        orders = await Order.findAll({
            where: { userId }
        });
    } else {
        orders = await Order.findAll();
    }

    if (!orders || !orders.length === 0){
        res.status(404).json({
            status: "error",
            message: "Don't Exist!"
        });
    }
    next();
}

const isExistedOrderDetail = async (req, res, next) => {
    const { id } = req.params;
    await OrderDetail.findOne({ 
        where: { id }
    })
        .then(detail => {
            if (!detail) {
                res.status(404).json({
                    status: "error",
                    message: "Order item Doesn't Exist!"
                });
            }
            next();
        });
}

const areExistedOrderDetails = async (req, res, next) => {
    let orderId = req.body.orderId ? req.body.orderId : req.params.id;
    await OrderDetail.findAll({ 
        where: { orderId }
    })
        .then(details => {
            if (!details || details.length === 0) {
                res.status(404).json({
                    status: "error",
                    message: "Don't Exist!"
                });
            }
            next();
        });
}

const isExistedDish = async (req, res, next) => {
    let dishId = req.body.dishId ? req.body.dishId : req.params.id;
    await Dish.findOne({ 
        where: { id: dishId }
    })
        .then(dish => {
            if (!dish) {
                res.status(404).json({
                    status: "error",
                    message: "Dish Doesn't Exist!"
                });
            }
            next();
        });
}

const areExistedDishes = async (req, res, next) => {
    let typeId = req.body.typeId ? req.body.typeId : req.params.id;
    let dishes;
    if (typeId) {
        dishes = await Dish.findAll({
            where: { typeId }
        });
    } else {
        dishes = await Dish.findAll();
    }
    await Dish.findAll({ 
        where: { id }
    })
        .then(dishes => {
            if (!dishes || dishes.length === 0) { 
                res.status(404).json({
                    status: "error",
                    message: "Don't Exist!"
                });
            }
            next();
        });
}

const isExistedDishType = async (req, res, next) => {
    const { id } = req.params;
    await DishType.findOne({ 
        where: { id }
    })
        .then(type => {
            if (!type) {
                res.status(404).json({
                    status: "error",
                    message: "Type Doesn't Exist!"
                });
            }
            next();
        });
}

const areExistedDishTypes = async (req, res, next) => {
    await DishType.findAll()
        .then(types => {
            if (!types || types.length === 0){
                res.status(404).json({
                    status: "error",
                    message: "Don't Exist!"
                });
            }
            next();
        });
}

const isExistedPayment = async (req, res, next) => {
    let paymentId = req.body.paymentId ? req.body.paymentId : req.params.id;
    await Payment.findOne({ 
        where: { id: paymentId }
    })
        .then(payment => {
            if (!payment) {
                res.status(404).json({
                    status: "error",
                    message: "Payment Doesn't Exist!"
                });
            }
            next();
        });
}

const areExistedPayments = async (req, res, next) => {
    let orderId = req.body.orderId ? req.body.orderId : req.params.id;
    let payments;
    if (orderId) {
        payments = await Payment.findAll({
            where: { orderId }
        });
    } else {
        payments = await Payment.findAll();
    }
    if (!payments || payments.length === 0){
        res.status(404).json({
            status: "error",
            message: "Don't Exist!"
        });
    }
    next();
}

const isExistedRate = async (req, res, next) => {
    const { id } = req.params;
    await Rate.findOne({ 
        where: { id }
    })
        .then(rate => {
            if (!rate) {
                res.status(404).json({
                    status: "error",
                    message: "Rate Doesn't Exist!"
                });
            }
            next();
        });
}

const areExistedRates = async (req, res, next) => {
    const { type, id } = req.params;
    let rates;
    if (type === "user") {
        rates = await Rate.findAll({ 
            where: { userId: id }
        });
    } else {
        rates = await Rate.findAll({
            where: { dishId: id }
        });
    }
    if (!rates) {
        res.status(404).json({
            status: "error",
            message: "Don't Exist!"
        });
    }
    next();
}

const isExistedCart = async (req, res, next) => {
    const { id } = req.params;
    await Cart.findOne({ 
        where: { id }
    })
        .then(cart => {
            if (!cart) {
                res.status(404).json({
                    status: "error",
                    message: "Cart Doesn't Exist!"
                });
            }
            next();
        });
}

const isExistedCartItem = async (req, res, next) => {
    const { id } = req.params;
    await CartItem.findOne({ 
        where: { id }
    })
        .then(item => {
            if (!item) {
                res.status(404).json({
                    status: "error",
                    message: "Item Doesn't Exist!"
                });
            }
            next();
        });
}

const areExistedCartItems = async (req, res, next) => {
    const { id } = req.params;
    await CartItem.findAll({ 
        where: { cartId: id }
    })
        .then(item => {
            if (!item) {
                res.status(404).json({
                    status: "error",
                    message: "Item Doesn't Exist!"
                });
            }
            next();
        });
}

const isExistedBlog = async (req, res, next) => {
    let blogId = req.body.blogId ? req.body.blogId : req.params.id;
    await Blog.findOne({ 
        where: { id: blogId }
    })
        .then(blog => {
            if (!blog) {
                res.status(404).json({
                    status: "error",
                    message: "Blog Doesn't Exist!"
                });
            }
            next();
        });
}

const areExistedBlogs = async (req, res, next) => {
    let userId = req.body.userId ? req.body.userId : req.params.id;
    let blogs;
    if (userId) {
        blogs = await Blog.findAll({
            where: { userId }
        });
    } else {
        blogs = await Blog.findAll();
    }
    if (!blogs || blogs.length === 0){
        res.status(404).json({
            status: "error",
            message: "Don't Exist!"
        });
    }
    next();
}

module.exports = { 
    isExistedUser,
    areExistedUsers,
    
    isExistedOrder,
    areExistedOrders,

    isExistedOrderDetail,
    areExistedOrderDetails,

    isExistedDish,
    areExistedDishes,

    isExistedDishType,
    areExistedDishTypes,

    isExistedPayment,
    areExistedPayments,

    isExistedRate,
    areExistedRates,

    isExistedCart,
    isExistedCartItem,
    areExistedCartItems,

    isExistedBlog,
    areExistedBlogs
}

