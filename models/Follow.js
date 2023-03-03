module.exports = (sequelize, DataTypes) => {
    const Follow = sequelize.define("Follow", {
        id: {
			type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true
		},
		folowedDate: {
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

	Follow.associate = (models) => {
		Follow.belongsTo(models.User, { foreignKey: 'followedId' });
		Follow.belongsTo(models.User, { foreignKey: 'followingId' });
    };

    return Follow;
};