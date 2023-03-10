'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Address extends Model {
		static associate(models) {
            Address.belongsTo(models.Ward, { foreignKey: 'wardId', targetKey: 'id', as: 'ward' });
            Address.belongsTo(models.Province, { foreignKey: 'provinceId', targetKey: 'id', as: 'province' });
            Address.belongsTo(models.District, { foreignKey: 'districtId', targetKey: 'id', as: 'district' });

			Address.hasMany(models.UserAddress, { foreignKey: 'addressId' });
		}
	}
	Address.init({
		address: DataTypes.STRING,
		deletedAt: DataTypes.DATE,
		status: DataTypes.INTEGER
	}, {
		sequelize,
		modelName: 'Address',
	});
	return Address;
};