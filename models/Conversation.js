module.exports = (sequelize, DataTypes) => {
    const Conversation = sequelize.define("Conversation", {
        id: {
			type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true
		},
		name: {
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

	Conversation.associate = (models) => {
		Conversation.hasMany(models.ConverReply);
		Conversation.hasMany(models.ConverJoining, { foreignKey: 'converId'});
    };

    return Conversation;
};