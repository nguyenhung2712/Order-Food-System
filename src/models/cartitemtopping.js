'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class CartItemTopping extends Model {
        static associate(models) {
            CartItemTopping.belongsTo(models.CartItem, { foreignKey: 'cartItemId', targetKey: 'id', as: 'cartItem' });
            CartItemTopping.belongsTo(models.Topping, { foreignKey: 'tppId', targetKey: 'id', as: 'topping' });
        }
    }
    CartItemTopping.init({
        unit: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'CartItemTopping',
        tableName: 'cartitemtoppings'
    });
    CartItemTopping.removeAttribute("id");
    return CartItemTopping;
};