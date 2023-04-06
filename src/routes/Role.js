const express = require("express");
const router = express.Router();

const { Auth, VerifyExists } = require("../middlewares");
const { roleController } = require("../controllers");

router.get('/all', [Auth.validateToken, VerifyExists.areExistedRoles], roleController.getAll);
router.get('/:id', [Auth.validateToken, VerifyExists.isExistedRole], roleController.getById);
router.post('/create', [Auth.validateToken], roleController.createRole);
router.put('/update/:id', [Auth.validateToken, VerifyExists.isExistedRole], roleController.updateRole);
router.put('/:type/:id', [Auth.validateToken, VerifyExists.isExistedRole], roleController.toggleRole);

router.get('/staff-role/:id', [Auth.validateToken, VerifyExists.isExistedStaff], roleController.getAdminRoleByAdminId);
router.get('/staff-other-role/:id', [Auth.validateToken, VerifyExists.isExistedStaff], roleController.getOtherAdminRoleByAdminId);
router.post('/staff-role/:type', [Auth.validateToken, VerifyExists.isExistedStaff, VerifyExists.isExistedRole], roleController.cdrAdminRole);

module.exports = router;
