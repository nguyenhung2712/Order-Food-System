'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Interact extends Model {
        static associate(models) {
            Interact.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id', as: 'user' });
            Interact.belongsTo(models.Reason, { foreignKey: 'reasonId', targetKey: 'id', as: 'reason' });
            Interact.belongsTo(models.Blog, { foreignKey: 'blogId', targetKey: 'id', as: 'blog' });
            Interact.belongsTo(models.Comment, { foreignKey: 'commentId', targetKey: 'id', as: 'comment' });
            Interact.belongsTo(models.CommentRep, { foreignKey: 'repId', targetKey: 'id', as: 'rep' });
            Interact.belongsTo(models.Rate, { foreignKey: 'ratingId', targetKey: 'id', as: 'rating' });
            Interact.belongsTo(models.User, { foreignKey: 'reportedUId', targetKey: 'id', as: 'reportedUser' });
            Interact.belongsTo(models.Dish, { foreignKey: 'dishId', targetKey: 'id', as: 'dish' });
        }
    }
    Interact.init({
        type: DataTypes.TINYINT,
        otherReason: DataTypes.STRING,
        deletedAt: DataTypes.DATE,
        status: DataTypes.TINYINT
    }, {
        sequelize,
        modelName: 'Interact',
        tableName: 'interacts'
    });
    return Interact;
};