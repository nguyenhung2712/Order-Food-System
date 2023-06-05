const express = require("express");
const router = express.Router();

const { Auth } = require("../middlewares");
const { analyticController } = require("../controllers");

router.get('/dashboard', /* [Auth.validateToken], */ analyticController.getDashboardInfo);
router.get('/blog', /* [Auth.validateToken], */ analyticController.getBlogInfo);
router.get('/report', /* [Auth.validateToken], */ analyticController.getReportInfo);
router.get('/order', /* [Auth.validateToken], */ analyticController.getOrderInfo);

module.exports = router;