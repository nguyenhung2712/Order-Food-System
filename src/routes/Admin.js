const express = require("express");
const router = express.Router();

const { Auth, VerifyExists, VerifyAdminUpsert } = require("../middlewares");
const { adminController } = require("../controllers");

router.get('/all'/* , [Auth.validateToken, VerifyExists.areExistedStaffs] */, adminController.getAll);
router.get('/:id', [Auth.validateToken, VerifyExists.isExistedStaff], adminController.getById);
router.post('/create', [Auth.validateToken, VerifyAdminUpsert.checkExistedUsername], adminController.createStaff);
router.put('/update/:id', [Auth.validateToken], adminController.updateStaff);
router.put('/:type/:id', [Auth.validateToken, VerifyExists.isExistedStaff], adminController.udraStaff);

module.exports = router;
