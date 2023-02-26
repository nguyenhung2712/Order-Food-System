module.exports = (sequelize, DataTypes) => {
    const Info = sequelize.define("Info", {
		id: {
			type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true
		},
		firstName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		lastName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		mobileNumber: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		avatar: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		lastUpdated: {
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

	Info.associate = (models) => {
		Info.hasOne(models.User, {
			onDelete: "cascade",
		});
    };

    return Info;
};