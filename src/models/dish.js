'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Dish extends Model {
        static associate(models) {
            Dish.belongsTo(models.DishType, { foreignKey: 'typeId', targetKey: 'id', as: 'type' });

            Dish.hasOne(models.CartItem, { foreignKey: 'dishId' });
            
			Dish.hasMany(models.Rate, { foreignKey: 'dishId' });
			Dish.hasMany(models.OrderDetail, { foreignKey: 'dishId' });
        }
    }
    Dish.init({
        dishName: DataTypes.STRING,
        price: DataTypes.DECIMAL,
        image: DataTypes.STRING,
        ingredients: DataTypes.STRING,
        deletedAt: DataTypes.DATE,
        status: DataTypes.TINYINT
    }, {
        sequelize,
        modelName: 'Dish',
    });
    return Dish;
};