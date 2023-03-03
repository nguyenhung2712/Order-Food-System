module.exports = (sequelize, DataTypes) => {
    const Province = sequelize.define("Province", {
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

	Province.associate = (models) => {
		Province.hasMany(models.District, {
			onDelete: "cascade",
		});
    };

    return Province;
};