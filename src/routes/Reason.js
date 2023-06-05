const express = require("express");
const router = express.Router();

const { reasonController } = require("../controllers");

router.get('/all', reasonController.getAll);

module.exports = router;
