const express = require("express");
const router = express.Router();

const { Auth, VerifyExists } = require("../middlewares");
const { dishTypeController } = require("../controllers");

router.get('/all', [Auth.validateToken, VerifyExists.areExistedDishTypes], dishTypeController.getAll);
router.get('/:id', VerifyExists.isExistedDishType, dishTypeController.getById);
router.post('/create', Auth.validateToken, dishTypeController.createDishType);
router.post('/update/:id', [Auth.validateToken, VerifyExists.isExistedDishType], dishTypeController.updateDishType);
router.put('/:type/:id', [Auth.validateToken, VerifyExists.isExistedDishType], dishTypeController.toggleDishType);

module.exports = router;