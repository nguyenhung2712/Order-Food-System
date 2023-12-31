'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.hasOne(models.Cart);
            User.hasOne(models.Token);

            User.hasMany(models.UserAddress, { foreignKey: 'userId' });
            User.hasMany(models.Rate, { foreignKey: 'userId' });
            User.hasMany(models.Order, { foreignKey: 'userId' });
            User.hasMany(models.Blog, { foreignKey: 'userId' });
            User.hasMany(models.Comment, { foreignKey: 'userId' });
            User.hasMany(models.CommentRep, { foreignKey: 'userId' });
            User.hasMany(models.Follow, { foreignKey: 'followingId' });
            User.hasMany(models.Follow, { foreignKey: 'followedId' });
            User.hasMany(models.Tracker, { foreignKey: 'userId' });
            User.hasMany(models.Interact, { foreignKey: 'userId' });
            User.hasMany(models.History, { foreignKey: 'userId' });

            User.hasMany(models.Interact, { foreignKey: 'reportedUId' });
            User.hasMany(models.ArchiveType, { foreignKey: 'userId' });
        }
    }
    User.init({
        username: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        avatar: DataTypes.STRING,
        gender: DataTypes.STRING,
        phoneNum: DataTypes.STRING,
        isActived: DataTypes.INTEGER,
        lastLogin: DataTypes.DATE,
        deletedAt: DataTypes.DATE,
        disabledAt: DataTypes.DATE,
        status: DataTypes.INTEGER,
        is2FA: DataTypes.TINYINT,
        isShared: DataTypes.TINYINT,
        fbID: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'User',
        tableName: 'users'
    });
    return User;
};