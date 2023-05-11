const express = require("express");
const router = express.Router();

const { Auth, VerifyExists } = require("../middlewares");
const { trackerController } = require("../controllers");

router.get('/:type/:id', [Auth.validateToken], trackerController.getTrackersById);
router.get('/history/user/:id', [Auth.validateToken, VerifyExists.isExistedUser], trackerController.getHistoryByUser);

module.exports = router;
