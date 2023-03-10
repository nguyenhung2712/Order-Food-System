const express = require("express");
const router = express.Router();

const { Auth, VerifyExists } = require("../middlewares");
const { dishController } = require("../controllers");

router.get('/all', dishController.getAll);
router.get('/:id', VerifyExists.isExistedDish, dishController.getById);
router.post('/create', [Auth.validateToken, VerifyExists.isExistedDishType], dishController.createDish);
router.put('/update/:id', 
    [Auth.validateToken, VerifyExists.isExistedDish, VerifyExists.isExistedDishType], 
    dishController.updateDish
);
router.put('/:type/:id', [Auth.validateToken, VerifyExists.isExistedDish], dishController.toggleDish);

module.exports = router;
