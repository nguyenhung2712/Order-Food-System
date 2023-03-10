'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class District extends Model {
		static associate(models) {
			District.belongsTo(models.Province, { foreignKey: 'provinceId', targetKey: 'id', as: 'province' });
			
			District.hasMany(models.Ward, { foreignKey: 'districtId' });
			District.hasMany(models.Address, { foreignKey: 'districtId' });
		}
	}
	District.init({
		provinceName: DataTypes.STRING,
		provinceNameEn: DataTypes.STRING,
		fullname: DataTypes.STRING,
		fullnameEn: DataTypes.STRING,
		codeName: DataTypes.STRING
	}, {
		sequelize,
		modelName: 'District',
	});
	return District;
};