const express = require("express");
const router = express.Router();

const { Auth, VerifyExists } = require("../middlewares");
const { rateController } = require("../controllers");

router.get('/:type/:id', [Auth.validateToken, VerifyExists.areExistedRates], rateController.getById);
router.post('/create', [Auth.validateToken, VerifyExists.isExistedDish, VerifyExists.isExistedUser], rateController.createRate);
router.put('/update/:id', [Auth.validateToken, VerifyExists.isExistedRate], rateController.updateRate);
router.put('/delete/:id', [Auth.validateToken, VerifyExists.isExistedRate], rateController.deleteRate);
router.put('/recover/:id', [Auth.validateToken, VerifyExists.isExistedRate], rateController.recoverRate);

module.exports = router;
