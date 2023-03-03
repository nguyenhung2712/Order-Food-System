module.exports = (sequelize, DataTypes) => {
    const CommentReply = sequelize.define("CommentReply", {
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
		image: {
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

	CommentReply.associate = (models) => {
		CommentReply.belongsTo(models.User);
		CommentReply.belongsTo(models.Comment);
    };

    return CommentReply;
};