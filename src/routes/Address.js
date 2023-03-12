const express = require("express");
const router = express.Router();

const { Auth, VerifyExists } = require("../middlewares");
const { addressController } = require("../controllers");

router.get('/all', VerifyExists.areExistedAddresses, addressController.getAll);
router.get('/fk', VerifyExists.isExistedLocation, addressController.getByFKId);
router.get('/:id', VerifyExists.isExistedAddress, addressController.getById);
router.post('/create', [Auth.validateToken, VerifyExists.isExistedLocation], addressController.createAddress);
router.put('/update/:id', [Auth.validateToken, VerifyExists.isExistedAddress], addressController.updateAddress );
router.put('/:type/:id', [Auth.validateToken, VerifyExists.isExistedAddress], addressController.toggleAddress);

module.exports = router;
