const express = require("express");
const router = express.Router();

const { Auth, VerifyExists } = require("../middlewares");
const { cartController } = require("../controllers");

router.get('/:id', /* [VerifyExists.isExistedCart], */ cartController.getCartByUserId);
router.get('/items/:id', [Auth.validateToken, VerifyExists.areExistedCartItems], cartController.getItemsByCartId);
router.post('/create-item/:id', [Auth.validateToken, VerifyExists.isExistedCart], cartController.addItemToCart);
router.put('/remove-item/:pId/:cId', [Auth.validateToken], cartController.removeItem);
router.delete('/delete-item/:pId/:cId', [Auth.validateToken], cartController.deleteItem);
router.delete('/clear-items/:id', [Auth.validateToken, VerifyExists.isExistedCart], cartController.clearItems);
/* router.post('/create-items/:id', [Auth.validateToken, VerifyExists.isExistedCart], cartController.addItemsToCart);
router.put('/update-item/:id',
    [Auth.validateToken, VerifyExists.isExistedCart, VerifyExists.isExistedCartItem],
    cartController.updateItem
);
router.put('/update-items/:id', [Auth.validateToken, VerifyExists.isExistedCart], cartController.updateItems);
router.put('/:type/:id', [Auth.validateToken, VerifyExists.isExistedCartItem], cartController.toggleItem); */


module.exports = router;