'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('Follows', {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4
			},
			status: {
				type: Sequelize.TINYINT
			},
			deletedAt: {
				type: Sequelize.DATE
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
            followingId: {
				allowNull: false,
				type: Sequelize.UUID,
				references: {
					model: 'Users',
					key: 'id',
					as: 'followingId',
				}
			},
            followedId: {
				allowNull: false,
				type: Sequelize.UUID,
				references: {
					model: 'Users',
					key: 'id',
					as: 'followedId',
				}
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('Follows');
	}
};