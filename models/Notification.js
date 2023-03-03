module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define("Notification", {
        id: {
			type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true
		},
		sentTime: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		isRead: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		isCheck: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		url: {
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

	Notification.associate = (models) => {
		Notification.belongsTo(models.User, { foreignKey: 'senderId' });
		Notification.belongsTo(models.User, { foreignKey: 'receiverId' });
    };

    return Notification;
};