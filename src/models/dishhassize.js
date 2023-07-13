'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class DishHasSize extends Model {
        static associate(models) {
            DishHasSize.belongsTo(models.Dish, { foreignKey: 'dishId', targetKey: 'id', as: 'dish' });
            DishHasSize.belongsTo(models.DishSize, { foreignKey: 'sizeId', targetKey: 'id', as: 'size' });
        }
    }
    DishHasSize.init({
        price: DataTypes.DECIMAL,
        quantityInDay: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'DishHasSize',
    });
    return DishHasSize;
};