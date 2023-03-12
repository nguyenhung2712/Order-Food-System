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
    blogService: require('./blog'),
    commentService: require('./comment'),
    commentRepService: require('./commentrep'),
    notifService: require('./notification'),
    followService: require('./follow'),
    locationService: require('./location'),
    addressService: require('./address'),
    adminService: require('./admin'),
    roleService: require('./role'),
    permissService: require('./permiss'),
    messageService: require('./message'),
    converService: require('./conver'),
};

module.exports = services;