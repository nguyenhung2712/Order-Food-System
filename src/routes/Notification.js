const express = require("express");
const router = express.Router();

const { Auth, VerifyExists } = require("../middlewares");
const { notifController } = require("../controllers");

router.get('/all', [Auth.validateToken, VerifyExists.areExistedNotifs], notifController.getAll);
router.get('/:type/:id', [Auth.validateToken, VerifyExists.areExistedNotifs], notifController.getByReceiverId);
router.get('/:id', [Auth.validateToken, VerifyExists.isExistedNotif], notifController.getById);
router.post('/create', [Auth.validateToken, VerifyExists.isExistedUser], notifController.createNotif);
router.put('/update/:id', [Auth.validateToken, VerifyExists.isExistedNotif], notifController.updateNotif);
router.put('/:type/:id', [Auth.validateToken, VerifyExists.isExistedNotif], notifController.toggleNotif);

module.exports = router;
