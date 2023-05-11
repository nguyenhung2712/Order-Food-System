const express = require("express");
const router = express.Router();

const { Auth, VerifyExists } = require("../middlewares");
const { commentController } = require("../controllers");
const fileUploader = require('../config/cloudinary.config');

router.get('/all', VerifyExists.areExistedComments, commentController.getAll);
router.get('/:type/:id', VerifyExists.areExistedComments, commentController.getByFKId);
router.get('/:id', VerifyExists.isExistedComment, commentController.getById);
router.post('/create', [Auth.validateToken, VerifyExists.isExistedUser, VerifyExists.isExistedBlog], commentController.createComment);

router.put('/upload-image/:id',
    [Auth.validateToken, VerifyExists.isExistedComment,
    fileUploader.single('image')],
    commentController.uploadCommentImage);

router.put('/update/:id',
    [Auth.validateToken, VerifyExists.isExistedComment],
    commentController.updateComment
);
router.put('/delete/:id', [Auth.validateToken, VerifyExists.isExistedComment], commentController.deleteComment);
router.post('/interact', /* [Auth.validateToken, VerifyExists.isExistedUser, VerifyExists.isExistedComment], */ commentController.interactComment);

module.exports = router;
