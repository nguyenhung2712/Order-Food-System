const express = require("express");
const router = express.Router();

const { Auth, VerifyExists } = require("../middlewares");
const { blogController } = require("../controllers");

router.get('/all', VerifyExists.areExistedBlogs, blogController.getAll);
router.get('/user/:id', VerifyExists.areExistedBlogs, blogController.getByUserId);
router.get('/:id', VerifyExists.isExistedBlog, blogController.getById);
router.post('/create', [Auth.validateToken, VerifyExists.isExistedUser], blogController.createBlog);
router.put('/update/:id', 
    [Auth.validateToken, VerifyExists.isExistedBlog], 
    blogController.updateBlog
);
router.put('/:type/:id', [Auth.validateToken, VerifyExists.isExistedBlog], blogController.toggleBlog);
router.post('/interact', [Auth.validateToken, VerifyExists.isExistedBlog, VerifyExists.isExistedUser], blogController.interactBlog);

module.exports = router;
