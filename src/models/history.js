'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class History extends Model {
        static associate(models) {
            History.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id', as: 'user' });
            /* History.belongsTo(models.AdminStaff, { foreignKey: 'adminId', targetKey: 'id', as: 'admin' }); */
            History.belongsTo(models.Order, { foreignKey: 'orderId', targetKey: 'id', as: 'order' });
            History.belongsTo(models.Blog, { foreignKey: 'blogId', targetKey: 'id', as: 'blog' });
        }
    }
    History.init({
        action: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'History',
        tableName: 'histories'
    });
    return History;
};