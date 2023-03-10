const express = require("express");
const router = express.Router();

const { Auth, VerifyExists } = require("../middlewares");
const { orderController } = require("../controllers");

router.get('/all', VerifyExists.areExistedOrders, orderController.getAll);
router.get('/:id', VerifyExists.isExistedOrder, orderController.getById);
router.post('/create', [Auth.validateToken, VerifyExists.isExistedUser], orderController.createOrder);
router.put('/update/:id', [Auth.validateToken, VerifyExists.isExistedOrder], orderController.updateOrder);
router.put('/:type/:id', [Auth.validateToken, VerifyExists.isExistedOrder], orderController.toggleOrder);

module.exports = router;
