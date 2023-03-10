const services = {
    authService: require('./auth'),
    userService: require('./user'),
    dishService: require('./dish'),
    dishTypeService: require('./dishtype'),
    cartService: require('./cart'),
    rateService: require('./rate'),
    paymentService: require('./payment'),
    orderService: require('./order'),
    orderDetailService: require('./orderdetail'),
};

module.exports = services;