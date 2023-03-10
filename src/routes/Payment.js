const express = require("express");
const router = express.Router();

const { Auth, VerifyExists } = require("../middlewares");
const { paymentController } = require("../controllers");

router.get('/all', [Auth.validateToken, VerifyExists.areExistedPayments], paymentController.getAll);
router.get('/:id', [Auth.validateToken, VerifyExists.isExistedPayment], paymentController.getById);
router.get('/order/:id', [Auth.validateToken, VerifyExists.areExistedPayments], paymentController.getByOrderId);
router.put('/update/:id', [Auth.validateToken, VerifyExists.isExistedPayment], paymentController.updatePayment);
router.put('/:type/:id', [Auth.validateToken, VerifyExists.isExistedPayment], paymentController.togglePayment);

module.exports = router;
