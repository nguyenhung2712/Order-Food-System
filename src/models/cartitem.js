'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class CartItem extends Model {
        static associate(models) {
            CartItem.belongsTo(models.Dish, { foreignKey: 'dishId', targetKey: 'id', as: 'product' });

            CartItem.belongsTo(models.Cart, { foreignKey: 'cartId', targetKey: 'id', as: 'cart' });
        }
    }
    CartItem.init({
        quantity: DataTypes.INTEGER,
        expiryDate: DataTypes.DATE
    }, {
        sequelize,
        modelName: 'CartItem',
    });
    return CartItem;
};