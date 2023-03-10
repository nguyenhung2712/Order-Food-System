/* const Info = require("./Info");
const Dish = require("./Dish");
const DishType = require("./DishType");
const Order = require("./Order");
const OrderDetails = require("./OrderDetails");
const Payment = require("./Payment");
const Rate = require("./Rate"); */

const initRoutes = (app) => {
    app.use("/api/auth", require("./Auth"));
    app.use("/api/user", require("./User"));
    app.use("/api/dish", require("./Dish"));
    app.use("/api/dish-type", require("./DishType"));
    app.use("/api/cart", require("./Cart"));
    /* app.use("/api/v1/info", Info);
    app.use("/api/v1/dish", Dish);
    app.use("/api/v1/dish-type", DishType);
    app.use("/api/v1/order", Order);
    app.use("/api/v1/order-detail", OrderDetails);
    app.use("/api/v1/payment", Payment);
    app.use("/api/v1/rate", Rate); */
}

module.exports = initRoutes;