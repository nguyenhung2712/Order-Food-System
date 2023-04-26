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
        wardName: DataTypes.STRING,
        wardNameEn: DataTypes.STRING,
        fullname: DataTypes.STRING,
        fullnameEn: DataTypes.STRING,
        codeName: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Ward',
        timestamps: false
    });
    return Ward;
};