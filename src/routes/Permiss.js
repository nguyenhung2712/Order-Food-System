const express = require("express");
const router = express.Router();

const { Auth, VerifyExists } = require("../middlewares");
const { permissController, roleController } = require("../controllers");

router.get('/all', [Auth.validateToken, VerifyExists.areExistedPermiss], permissController.getAll);
router.get('/:id', [Auth.validateToken, VerifyExists.isExistedPermiss], permissController.getById);
router.post('/create', [Auth.validateToken], permissController.createPermiss);
router.put('/update/:id', [Auth.validateToken, VerifyExists.isExistedPermiss], permissController.updatePermiss);
router.put('/:type/:id', [Auth.validateToken, VerifyExists.isExistedPermiss], permissController.togglePermiss);

router.get('/role-permiss/:id', [Auth.validateToken, VerifyExists.isExistedRole], permissController.getPermissionByRoleId);
router.post('/role-permiss/:type', [Auth.validateToken, VerifyExists.isExistedPermiss, VerifyExists.isExistedRole], permissController.cdrRolePermission);

module.exports = router;
