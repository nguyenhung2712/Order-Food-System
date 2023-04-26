const express = require("express");
const router = express.Router();

const { Auth, VerifyExists } = require("../middlewares");
const { followController } = require("../controllers");

router.get('/:type/:id', VerifyExists.areExistedFollows, followController.getByFKId);
router.get('/:id', VerifyExists.isExistedFollow, followController.getById);
router.post('/create', [Auth.validateToken, VerifyExists.isExistedUser], followController.createFollow);
router.delete('/delete/:id', [Auth.validateToken, VerifyExists.isExistedFollow], followController.deleteFollow);

module.exports = router;
