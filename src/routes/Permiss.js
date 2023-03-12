const express = require("express");
const router = express.Router();

const { Auth, VerifyExists } = require("../middlewares");
const { permissController } = require("../controllers");

router.get('/all', [Auth.validateToken, VerifyExists.areExistedPermiss], permissController.getAll);
router.get('/:id', [Auth.validateToken, VerifyExists.isExistedPermiss], permissController.getById);
router.post('/create', [Auth.validateToken], permissController.createPermiss);
router.put('/update/:id', [Auth.validateToken, VerifyExists.isExistedPermiss], permissController.updatePermiss);
router.put('/:type/:id', [Auth.validateToken, VerifyExists.isExistedPermiss], permissController.togglePermiss);

module.exports = router;
