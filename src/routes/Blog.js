const express = require("express");
const router = express.Router();
const fileUploader = require('../config/cloudinary.config');

const { Auth, VerifyExists } = require("../middlewares");
const { blogController } = require("../controllers");

router.get('/all', blogController.getAll);
router.get('/all/sort', blogController.getAllBySort);
router.get('/user/:id', VerifyExists.areExistedBlogs, blogController.getByUserId);
router.get('/user/sort/:id', VerifyExists.areExistedBlogs, blogController.getBySortUserId);
router.get('/slug/:slug', blogController.getBySlug);
router.get('/:id', VerifyExists.isExistedBlog, blogController.getById);
router.post('/create', [Auth.validateToken, VerifyExists.isExistedUser], blogController.createBlog);
router.put('/update/:id',
    [Auth.validateToken, VerifyExists.isExistedBlog],
    blogController.updateBlog
);
router.put('/:type/:id', [Auth.validateToken, VerifyExists.isExistedBlog], blogController.toggleBlog);
router.post('/interact', [Auth.validateToken, VerifyExists.isExistedBlog, VerifyExists.isExistedUser], blogController.interactBlog);

router.post('/upload-image', [fileUploader.single('file')], blogController.uploadBlogImage);


module.exports = router;
