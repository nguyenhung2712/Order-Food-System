'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		static associate(models) {
            User.belongsToMany(models.Blog, { through: 'Like_Blog' });

			User.hasOne(models.Cart);
            User.hasOne(models.Token);
            User.hasOne(models.Conversation);

			User.hasMany(models.UserAddress, { foreignKey: 'userId' });
			User.hasMany(models.Rate, { foreignKey: 'userId' });
			User.hasMany(models.Order, { foreignKey: 'userId' });
			User.hasMany(models.Notification, { foreignKey: 'receiverId' });
			User.hasMany(models.Blog, { foreignKey: 'userId' });
			User.hasMany(models.Comment, { foreignKey: 'userId' });
			User.hasMany(models.CommentRep, { foreignKey: 'userId' });
			User.hasMany(models.Message, { foreignKey: 'userId' });
			User.hasMany(models.Follow, { foreignKey: 'followingId' });
			User.hasMany(models.Follow, { foreignKey: 'followedId' });
            
		}
	}
	User.init({
		username: DataTypes.STRING,
		email: DataTypes.STRING,
		password: DataTypes.STRING,
		firstName: DataTypes.STRING,
		lastName: DataTypes.STRING,
		avatar: DataTypes.STRING,
		gender: DataTypes.INTEGER,
		phoneNum: DataTypes.STRING,
		isActived: DataTypes.INTEGER,
		lastLogin: DataTypes.DATE,
		deletedAt: DataTypes.DATE,
		status: DataTypes.INTEGER,
		is2FA: DataTypes.TINYINT
	}, {
		sequelize,
		modelName: 'User',
	});
	return User;
};