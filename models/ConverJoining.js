module.exports = (sequelize, DataTypes) => {
    const ConverJoining = sequelize.define("ConverJoining", {
		converId: {
			type: DataTypes.UUID,
			unique:"conver_user_comp",
			allowNull: false,
			primaryKey: true
		},
		userId: {
			type: DataTypes.UUID,
			unique:"conver_user_comp",
			allowNull: false,
			primaryKey: true
		},
		joinedDate: {
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
	},);
	ConverJoining.removeAttribute('id');
	ConverJoining.associate = (models) => {
		ConverJoining.belongsTo(models.User, {foreignKey: 'userId'});
		ConverJoining.belongsTo(models.Conversation, {foreignKey: 'converId'});
    };
	
    return ConverJoining;
};