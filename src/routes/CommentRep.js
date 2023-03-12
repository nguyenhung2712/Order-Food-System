const express = require("express");
const router = express.Router();

const { Auth, VerifyExists } = require("../middlewares");
const { commentRepController } = require("../controllers");

router.get('/all', VerifyExists.areExistedCommentReps, commentRepController.getAll);
router.get('/:type/:id', VerifyExists.areExistedCommentReps, commentRepController.getByFKId);
router.get('/:id', VerifyExists.isExistedComment, commentRepController.getById);
router.post('/create', [Auth.validateToken, VerifyExists.isExistedUser, VerifyExists.isExistedComment], commentRepController.createRep);
router.put('/update/:id',
    [Auth.validateToken, VerifyExists.isExistedCommentRep],
    commentRepController.updateRep
);
router.put('/:type/:id', [Auth.validateToken, VerifyExists.isExistedCommentRep], commentRepController.toggleRep);

module.exports = router;
