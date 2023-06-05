const express = require("express");
const router = express.Router();

const { Auth, VerifyExists } = require("../middlewares");
const { scheduleController } = require("../controllers");

router.get('/all', scheduleController.getAll);
router.get('/type/all', scheduleController.getAllType);
router.post('/create', [Auth.validateToken], scheduleController.createSchedule);
router.put('/update/:id', [Auth.validateToken], scheduleController.updateSchedule);
router.delete('/delete/:id', [Auth.validateToken], scheduleController.deleteSchedule);

module.exports = router;
