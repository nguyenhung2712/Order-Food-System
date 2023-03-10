'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class CartItem extends Model {
        static associate(models) {
            CartItem.belongsTo(models.Dish, { foreignKey: 'dishId' });

            CartItem.belongsTo(models.Cart, { foreignKey: 'cartId', targetKey: 'id', as: 'cart' });
        }
    }
    CartItem.init({
        quantity: DataTypes.INTEGER,
        deletedAt: DataTypes.DATE,
        status: DataTypes.TINYINT,
        expiryDate: DataTypes.DATE
    }, {
        sequelize,
        modelName: 'CartItem',
    });
    return CartItem;
};