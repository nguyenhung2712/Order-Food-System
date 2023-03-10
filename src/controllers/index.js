const controller = {
    userController: require('./user'),
    authController: require('./auth'),
    dishController: require('./dish'),
    dishTypeController: require('./dishType'),
    cartController: require('./cart'),
    rateController: require('./rate'),
    paymentController: require('./payment'),
    orderController: require('./order'),
    orderDetailController: require('./orderdetail'),
}

module.exports = controller;