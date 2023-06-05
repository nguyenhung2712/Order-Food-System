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
    app.use("/api/address", require("./Address"));
    app.use("/api/admin", require("./Admin"));
    app.use("/api/blog", require("./Blog"));
    app.use("/api/cart", require("./Cart"));
    app.use("/api/comment", require("./Comment"));
    app.use("/api/cmtrep", require("./CommentRep"));
    app.use("/api/conver", require("./Conver"));
    app.use("/api/follow", require("./Follow"));
    app.use("/api/location", require("./Location"));
    app.use("/api/message", require("./Message"));
    app.use("/api/notif", require("./Notification"));
    app.use("/api/order", require("./Order"));
    app.use("/api/order-detail", require("./OrderDetail"));
    app.use("/api/payment", require("./Payment"));
    app.use("/api/permiss", require("./Permiss"));
    app.use("/api/role", require("./Role"));
    app.use("/api/rate", require("./Rate"));
    app.use("/api/tracker", require("./Tracker"));
    app.use("/api/social", require("./SocialAuth"));
    app.use("/api/schedule", require("./Schedule"));
    app.use("/api/analytic", require("./Analytic"));
    app.use("/api/reason", require("./Reason"));
}

module.exports = initRoutes;