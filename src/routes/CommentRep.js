const express = require("express");
const router = express.Router();

const { Auth, VerifyExists } = require("../middlewares");
const { commentRepController } = require("../controllers");
const fileUploader = require('../config/cloudinary.config');

router.get('/all', VerifyExists.areExistedCommentReps, commentRepController.getAll);
router.get('/:type/:id', VerifyExists.areExistedCommentReps, commentRepController.getByFKId);
router.get('/:id', VerifyExists.isExistedComment, commentRepController.getById);
router.post('/create', [Auth.validateToken, VerifyExists.isExistedUser], commentRepController.createRep);
router.put('/upload-image/:id',
    [Auth.validateToken, fileUploader.single('image')],
    commentRepController.uploadRepCommentImage
);
router.put('/update/:id',
    [Auth.validateToken, VerifyExists.isExistedCommentRep],
    commentRepController.updateRep
);
router.put('/:type/:id', [Auth.validateToken, VerifyExists.isExistedCommentRep], commentRepController.toggleRep);
router.post('/interact', [Auth.validateToken, VerifyExists.isExistedCommentRep, VerifyExists.isExistedUser], commentRepController.interactRep);

module.exports = router;
