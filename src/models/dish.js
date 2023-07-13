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
            Dish.hasMany(models.DishTopping, { foreignKey: 'dishId' });
            Dish.hasMany(models.Interact, { foreignKey: 'dishId' });
            Dish.hasMany(models.DishHasSize, { foreignKey: 'dishId' });
        }
    }
    Dish.init({
        dishName: DataTypes.STRING,
        dishNameEn: DataTypes.STRING,
        price: DataTypes.DECIMAL,
        image: DataTypes.STRING,
        ingredients: DataTypes.STRING,
        ingredientsEn: DataTypes.STRING,
        slug: DataTypes.STRING,
        deletedAt: DataTypes.DATE,
        status: DataTypes.TINYINT,
        quantityInDay: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Dish',
        tableName: 'dishes'
    });
    return Dish;
};