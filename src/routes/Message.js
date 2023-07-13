const express = require("express");
const router = express.Router();
const fileUploader = require('../config/cloudinary.config');

const { Auth } = require("../middlewares");
const { messageController } = require("../controllers");

router.post('/upload-image',
    [Auth.validateToken, fileUploader.array('images')],
    messageController.uploadImage
);
module.exports = router;
