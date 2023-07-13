'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Topping extends Model {
        static associate(models) {
            Topping.hasMany(models.DishTopping, { foreignKey: 'tppId' });
            Topping.hasMany(models.CartItemTopping, { foreignKey: 'tppId' });
        }
    }
    Topping.init({ tppName: DataTypes.STRING, }, {
        sequelize,
        modelName: 'Topping',
        tableName: 'toppings'
    });
    return Topping;
};