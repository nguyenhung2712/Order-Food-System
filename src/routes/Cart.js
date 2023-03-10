const express = require("express");
const router = express.Router();

const { Auth, VerifyExists } = require("../middlewares");
const { cartController } = require("../controllers");

router.get('/:id', [Auth.validateToken, VerifyExists.isExistedCart], cartController.getCartById);
router.get('/items/:id', [Auth.validateToken, VerifyExists.areExistedCartItems], cartController.getItemsByCartId);
router.post('/create-item/:id', [Auth.validateToken, VerifyExists.isExistedCart], cartController.addItemToCart);
router.post('/create-items/:id', [Auth.validateToken, VerifyExists.isExistedCart], cartController.addItemsToCart);
router.put('/update-item/:id', 
    [Auth.validateToken, VerifyExists.isExistedCart, VerifyExists.isExistedCartItem], 
    cartController.updateItem
);
router.put('/update-items/:id', [Auth.validateToken, VerifyExists.isExistedCart], cartController.updateItems);//cân nhắc làm thêm middleware cartitems
router.put('/:type/:id', [Auth.validateToken, VerifyExists.isExistedCartItem], cartController.toggleItem);

module.exports = router;