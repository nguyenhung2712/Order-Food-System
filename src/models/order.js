'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        static associate(models) {
            Order.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id', as: 'user' });
            Order.belongsTo(models.Payment, { foreignKey: 'paymentId', targetKey: 'id', as: 'payment' });

            Order.hasMany(models.OrderDetail, { foreignKey: 'orderId' });
        }
    }
    Order.init({
        predictDate: DataTypes.DATE,
        deletedAt: DataTypes.DATE,
        status: DataTypes.TINYINT
    }, {
        sequelize,
        modelName: 'Order',
    });
    return Order;
};