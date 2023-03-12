const express = require("express");
const router = express.Router();

const { Auth, VerifyExists } = require("../middlewares");
const { commentController } = require("../controllers");

router.get('/all', VerifyExists.areExistedComments, commentController.getAll);
router.get('/:type/:id', VerifyExists.areExistedComments, commentController.getByFKId);
router.get('/:id', VerifyExists.isExistedComment, commentController.getById);
router.post('/create', [Auth.validateToken, VerifyExists.isExistedUser, VerifyExists.isExistedBlog], commentController.createComment);
router.put('/update/:id',
    [Auth.validateToken, VerifyExists.isExistedComment],
    commentController.updateComment
);
router.put('/:type/:id', [Auth.validateToken, VerifyExists.isExistedComment], commentController.toggleComment);

module.exports = router;
