const express = require("express");
const router = express.Router();

const { Auth, VerifyExists } = require("../middlewares");
const { orderDetailController } = require("../controllers");

router.get('/order/:id', [Auth.validateToken, VerifyExists.areExistedOrderDetails], orderDetailController.getByOrderId);
router.get('/:id', [Auth.validateToken, VerifyExists.isExistedOrderDetail], orderDetailController.getById);
router.post('/create', 
    [Auth.validateToken, VerifyExists.isExistedDish, VerifyExists.isExistedOrder], 
    orderDetailController.createDetail
);
router.put('/update/:id', [Auth.validateToken, VerifyExists.isExistedOrderDetail], orderDetailController.updateDetail);
router.put('/:type/:id', [Auth.validateToken, VerifyExists.isExistedOrderDetail], orderDetailController.toggleDetail);

module.exports = router;
