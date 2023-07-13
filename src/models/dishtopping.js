'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class DishTopping extends Model {
        static associate(models) {
            DishTopping.belongsTo(models.Dish, { foreignKey: 'dishId', targetKey: 'id', as: 'dish' });
            DishTopping.belongsTo(models.Topping, { foreignKey: 'tppId', targetKey: 'id', as: 'topping' });
        }
    }
    DishTopping.init({}, {
        sequelize,
        modelName: 'DishTopping',
        tableName: 'dishtoppings'
    });

    return DishTopping;
};