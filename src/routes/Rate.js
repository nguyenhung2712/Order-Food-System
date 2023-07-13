const express = require("express");
const router = express.Router();

const { Auth, VerifyExists } = require("../middlewares");
const { rateController } = require("../controllers");
const fileUploader = require('../config/cloudinary.config');

router.get('/:type/:id', rateController.getById);
router.get('/paginate/:type/:id', rateController.getWithPaginate);
router.post('/create', [Auth.validateToken, VerifyExists.isExistedDish, VerifyExists.isExistedUser], rateController.createRate);
router.put('/update/:id', [Auth.validateToken, VerifyExists.isExistedRate], rateController.updateRate);
router.delete('/delete/:id', [Auth.validateToken, VerifyExists.isExistedRate], rateController.deleteRate);

router.get('/reports', Auth.validateToken, rateController.getAllReports);
router.put('/report/solve', Auth.validateToken, rateController.solveReport);
router.delete('/report/delete/:id', Auth.validateToken, rateController.deleteReport);


/* router.put('/upload-image/:id',
    [Auth.validateToken, VerifyExists.isExistedRate,
    fileUploader.single('image')],
    rateController.uploadRatingImage); */

module.exports = router;
