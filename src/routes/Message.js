const express = require("express");
const router = express.Router();

const { Auth, VerifyExists } = require("../middlewares");
const { messageController } = require("../controllers");

router.get('/conver/:id', [Auth.validateToken, VerifyExists.areExistedMessages], messageController.getByConverId);
router.get('/:id', [Auth.validateToken, VerifyExists.isExistedMessage], messageController.getById);
router.post('/create',
    [
        Auth.validateToken,
        VerifyExists.isExistedConver
    ],
    messageController.createMessage
);
router.put('/update/:id', [Auth.validateToken, VerifyExists.isExistedMessage], messageController.updateMessage);
router.put('/:type/:id', [Auth.validateToken, VerifyExists.isExistedMessage], messageController.toggleMessage);

module.exports = router;
