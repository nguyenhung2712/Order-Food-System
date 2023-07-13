const express = require("express");
const router = express.Router();

const { Auth } = require("../middlewares");
const { analyticController } = require("../controllers");

router.get('/dashboard', [Auth.validateToken], analyticController.getDashboardInfo);
router.get('/blog', [Auth.validateToken], analyticController.getBlogInfo);
router.get('/order', [Auth.validateToken], analyticController.getOrderInfo);
router.get('/product', [Auth.validateToken], analyticController.getProductInfo);

router.get('/report/blog', [Auth.validateToken], analyticController.getBlogReportInfo);
router.get('/report/rating', [Auth.validateToken], analyticController.getRatingReportInfo);
router.get('/report/comment', [Auth.validateToken], analyticController.getCmtReportInfo);

module.exports = router;