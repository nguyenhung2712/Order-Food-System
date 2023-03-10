'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Cart extends Model {
        static associate(models) {
            Cart.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id', as: 'user' });
			Cart.hasMany(models.CartItem, { foreignKey: 'cartId' });
        }
    }
    Cart.init({
        total: DataTypes.DECIMAL,
        deletedAt: DataTypes.DATE,
        status: DataTypes.TINYINT
    }, {
        sequelize,
        modelName: 'Cart',
    });
    return Cart;
};