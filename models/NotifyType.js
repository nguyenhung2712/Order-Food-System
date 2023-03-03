module.exports = (sequelize, DataTypes) => {
    const NotifyType = sequelize.define("NotifyType", {
        id: {
			type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true
		},
		activity: {
			type: DataTypes.STRING,
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

	NotifyType.associate = (models) => {
		NotifyType.hasMany(models.Notification , {
			onDelete: "cascade",
		});
    };

    return NotifyType;
};