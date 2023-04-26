const express = require("express");
const router = express.Router();

const { Auth, VerifyExists } = require("../middlewares");
const { addressController } = require("../controllers");

router.get('/all', VerifyExists.areExistedAddresses, addressController.getAll);
router.get('/fk', VerifyExists.isExistedLocation, addressController.getByFKId);
router.get('/:id', VerifyExists.isExistedAddress, addressController.getById);
router.post('/create',
    [
        Auth.validateToken,
        VerifyExists.isExistedAddressByL
    ],
    addressController.createAddress
);
router.put('/update/:id', [Auth.validateToken, VerifyExists.isExistedAddress], addressController.updateAddress);
router.put('/:type/:id', [Auth.validateToken, VerifyExists.isExistedAddress], addressController.toggleAddress);

router.get('/user-address/:id', [Auth.validateToken], addressController.getUserAddressById);
router.get('/default-user-address/:id', [Auth.validateToken], addressController.getUserAddressByDefault);

router.post('/create-user-address',
    [
        Auth.validateToken,
        VerifyExists.isExistedAddress,
        VerifyExists.isExistedUser,
    ],
    addressController.createUserAddress
);
router.put('/update-user-address',
    [
        Auth.validateToken,
        VerifyExists.isExistedAddress,
        VerifyExists.isExistedUser,
    ],
    addressController.updateUserAddress
);
router.put('/user-address/:type',
    [
        Auth.validateToken,
        VerifyExists.isExistedAddress,
        VerifyExists.isExistedUser,
    ],
    addressController.updateUserAddress
);

module.exports = router;
