const express = require("express");
const router = express.Router();

const { Auth, VerifyExists } = require("../middlewares");
const { locationController } = require("../controllers");

router.get('/:type/:id', [Auth.validateToken, VerifyExists.isExistedLocation], locationController.getById);

router.get('/list/:type/:id', [Auth.validateToken, VerifyExists.areExistedLocations], locationController.getListsByFKId);

module.exports = router;
