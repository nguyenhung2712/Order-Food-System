'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class UserAddress extends Model {
        static associate(models) {
            UserAddress.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id', as: 'user' });
            UserAddress.belongsTo(models.Address, { foreignKey: 'addressId', targetKey: 'id', as: 'address' });
        }
    }
    UserAddress.init({
        isDefault: DataTypes.INTEGER,
        title: DataTypes.STRING,
        deletedAt: DataTypes.DATE,
        status: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'UserAddress',
        tableName: 'useraddresses'
    });
    UserAddress.removeAttribute("id");
    return UserAddress;
};