'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Follow extends Model {
		static associate(models) {
			Follow.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id', as: 'following' });
			Follow.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id', as: 'follower' });
		}
	}
	Follow.init({
		status: DataTypes.TINYINT,
		deletedAt: DataTypes.DATE
	}, {
		sequelize,
		modelName: 'Follow',
	});
	return Follow;
};