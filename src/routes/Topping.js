const express = require("express");
const router = express.Router();

const { Auth, VerifyExists } = require("../middlewares");
const { toppingController } = require("../controllers");

router.get('/all', toppingController.getAll);
router.post('/dish-topping/:type', [Auth.validateToken], toppingController.cdrDishTopping);

/* router.post('/create', [Auth.validateToken], scheduleController.createSchedule);

router.put('/update/:id', [Auth.validateToken], scheduleController.updateSchedule);
router.delete('/delete/:id', [Auth.validateToken], scheduleController.deleteSchedule); */

module.exports = router;
