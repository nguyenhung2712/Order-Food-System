'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        static associate(models) {
            Order.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id', as: 'user' });
            Order.belongsTo(models.Payment, { foreignKey: 'paymentId', targetKey: 'id', as: 'payment' });
            Order.belongsTo(models.Address, { foreignKey: 'addressId', targetKey: 'id', as: 'address' });

            Order.hasMany(models.OrderDetail, { foreignKey: 'orderId' });
            Order.hasMany(models.History, { foreignKey: 'orderId' });
        }
    }
    Order.init({
        predictDate: DataTypes.DATE,
        deletedAt: DataTypes.DATE,
        number: DataTypes.STRING,
        note: DataTypes.STRING,
        status: DataTypes.TINYINT
    }, {
        sequelize,
        modelName: 'Order',
    });
    return Order;
};