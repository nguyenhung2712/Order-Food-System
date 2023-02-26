module.exports = (sequelize, DataTypes) => {
    const Rate = sequelize.define("Rate", {
        id: {
			type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true
		},
		score: {
			type: DataTypes.DECIMAL,
			allowNull: false,
		},
		remarks: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		ratingDate: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		isEnabled: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	}, 
	{
		timestamps: false,
		createdAt: false,
		updatedAt: false,
	});

	Rate.associate = (models) => {
		Rate.belongsTo(models.Dish);
		Rate.belongsTo(models.User);
    };

    return Rate;
};