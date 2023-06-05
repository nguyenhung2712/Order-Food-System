const express = require("express");
const router = express.Router();
const fileUploader = require('../config/cloudinary.config');

const { Auth, VerifyExists } = require("../middlewares");
const { dishController } = require("../controllers");

router.get('/all', [VerifyExists.areExistedDishes], dishController.getAll);
router.post('/all/available', [VerifyExists.areExistedDishes], dishController.getAllAvailable);
router.get('/:id', VerifyExists.isExistedDish, dishController.getById);
router.get('/slug/:slug', dishController.getBySlug);
router.post('/create', [Auth.validateToken, VerifyExists.isExistedDishType], dishController.createDish);
router.put('/update/:id',
    [Auth.validateToken, VerifyExists.isExistedDish],
    dishController.updateDish
);
router.put('/:type/:id', [Auth.validateToken, VerifyExists.isExistedDish], dishController.toggleDish);

router.post('/upload-image/:id', [Auth.validateToken, VerifyExists.isExistedDish, fileUploader.array('files')], dishController.uploadDishImage);

module.exports = router;
