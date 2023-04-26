const express = require("express");
const router = express.Router();

const { Auth, VerifyExists } = require("../middlewares");
const { orderController } = require("../controllers");

router.get('/all', [Auth.validateToken, VerifyExists.areExistedOrders], orderController.getAll);
router.get('/:id', [Auth.validateToken, VerifyExists.isExistedOrder], orderController.getById);
router.get('/user/:id', Auth.validateToken, orderController.getByUserId);
router.post('/create',
    [Auth.validateToken, VerifyExists.isExistedUser, VerifyExists.isExistedAddress],
    orderController.createOrder
);
router.put('/update/:id', [Auth.validateToken, VerifyExists.isExistedOrder], orderController.updateOrder);
router.put('/:type/:id', [Auth.validateToken, VerifyExists.isExistedOrder], orderController.toggleOrder);
router.get('/export/:id/:locale', /* [Auth.validateToken, VerifyExists.isExistedOrder], */
    orderController.exportOrder);

module.exports = router;
