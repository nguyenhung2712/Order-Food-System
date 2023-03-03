module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define("Comment", {
        id: {
			type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true
		},
		commentDate: {
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

	Comment.associate = (models) => {
		Comment.hasMany(models.CommentReply , {
			onDelete: "cascade",
		});
		Comment.belongsTo(models.Blog);
		Comment.belongsTo(models.User);
    };

    return Comment;
};