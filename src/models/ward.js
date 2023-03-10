'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Ward extends Model {
		static associate(models) {
			Ward.belongsTo(models.District, { foreignKey: 'districtId', targetKey: 'id', as: 'district' });
			
			Ward.hasMany(models.Address, { foreignKey: 'wardId' });
		}
	}
	Ward.init({
		provinceName: DataTypes.STRING,
		provinceNameEn: DataTypes.STRING,
		fullname: DataTypes.STRING,
		fullnameEn: DataTypes.STRING,
		codeName: DataTypes.STRING
	}, {
		sequelize,
		modelName: 'Ward',
	});
	return Ward;
};