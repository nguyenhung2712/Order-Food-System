module.exports = (sequelize, DataTypes) => {
    const District = sequelize.define("District", {
        code: {
			type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		name_en: {
			type: DataTypes.DECIMAL,
			allowNull: false,
		},
		full_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		full_name_en: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		code_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
    }, 
	{
		timestamps: false,
		createdAt: false,
		updatedAt: false,
	});

	District.associate = (models) => {
		District.hasMany(models.Ward, {
			onDelete: "cascade",
		});
		District.belongsTo(models.Province);
    };

    return District;
};