module.exports = (sequelize, DataTypes) => {
    const ConverReply = sequelize.define("ConverReply", {
        id: {
			type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true
		},
		repliedDate: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		message: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		images: {
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

	ConverReply.associate = (models) => {
		ConverReply.belongsTo(models.Conversation);
		ConverReply.belongsTo(models.User);
    };

    return ConverReply;
};