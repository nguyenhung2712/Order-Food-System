const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

const db = require("./models");

// Router
const controller = require("./routes");
app.use("/api/auth", controller.authsRouter);
app.use("/api/user", controller.usersRouter);
app.use("/api/info", controller.infosRouter);
app.use("/api/dish", controller.dishesRouter);
app.use("/api/dishtype", controller.dishTypesRouter);
app.use("/api/order", controller.ordersRouter);
app.use("/api/order-details", controller.orderDetailsRouter);
app.use("/api/rate", controller.ratesRouter);
app.use("/api/payment", controller.paymentsRouter);

db.sequelize.sync().then(() => {
    app.listen(3001, () => {
        console.log("Server running on port 3001");
    });
});