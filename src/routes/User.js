const express = require("express");
const router = express.Router();
const fileUploader = require('../config/cloudinary.config');

const { Auth } = require("../middlewares");
const { userController } = require("../controllers");
const { VerifyUserUpsert, VerifyExists } = require("../middlewares");

router.get('/all', Auth.validateToken, userController.getAll);
router.get('/:id', userController.getUser);
router.post('/gmail', userController.getUserByEmail);
router.post('/create', [Auth.validateToken], userController.createUser);
router.put('/change-password/:id', [Auth.validateToken], userController.changePassword);
router.put('/update/:id', [Auth.validateToken, VerifyUserUpsert.checkExistedUsername, VerifyUserUpsert.checkExistedEmail], userController.updateUser);
router.put('/upload-avatar/:id',
    [Auth.validateToken, VerifyExists.isExistedUser,
    fileUploader.single('image')],
    userController.uploadAvatarUser
);

router.post('/warn/:id', userController.sendWarningMail);
router.post('/restore/:id', userController.sendRestoreMail);
router.post('/newest-order/:id', userController.sendNewestOrder);

module.exports = router;