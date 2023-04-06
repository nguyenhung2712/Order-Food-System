const express = require("express");
const router = express.Router();

const { Auth, VerifyExists } = require("../middlewares");
const { trackerController } = require("../controllers");

router.get('/:type/:id', [Auth.validateToken], trackerController.getTrackersById);

module.exports = router;
