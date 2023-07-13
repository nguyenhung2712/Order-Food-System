'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class OrderDetail extends Model {
        static associate(models) {
            OrderDetail.belongsTo(models.Dish, { foreignKey: 'dishId', targetKey: 'id', as: 'dish' });
            OrderDetail.belongsTo(models.Order, { foreignKey: 'orderId', targetKey: 'id', as: 'order' });
        }
    }
    OrderDetail.init({
        price: DataTypes.DECIMAL,
        quantity: DataTypes.INTEGER,
        deletedAt: DataTypes.DATE,
        status: DataTypes.TINYINT
    }, {
        sequelize,
        modelName: 'OrderDetail',
        tableName: 'orderdetails'
    });
    return OrderDetail;
};