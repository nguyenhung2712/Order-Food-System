const express = require("express");
const router = express.Router();

const { Auth, VerifyExists } = require("../middlewares");
const { converController } = require("../controllers");

router.get('/all', [Auth.validateToken, VerifyExists.areExistedConvers], converController.getAll);
router.get('/staff/:id', [Auth.validateToken, VerifyExists.areExistedConvers], converController.getByStaffId);
router.get('/:id', [Auth.validateToken, VerifyExists.isExistedConver], converController.getById);
router.post('/create', [Auth.validateToken, VerifyExists.isExistedStaff, VerifyExists.isExistedUser], converController.createConver);
router.put('/update/:id', [Auth.validateToken, VerifyExists.isExistedConver], converController.updateConver);
router.put('/:type/:id', [Auth.validateToken, VerifyExists.isExistedConver], converController.toggleConver);

module.exports = router;
