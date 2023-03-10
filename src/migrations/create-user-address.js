'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('UserAddresses', {
			userId: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
				references: {
					model: 'Users',
					key: 'id',
					as: 'userId',
				}
			},
			addressId: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
				references: {
					model: 'Addresses',
					key: 'id',
					as: 'addressId',
				}
			},
			isDefault: {
				type: Sequelize.TINYINT,
				allowNull: false
			},
			deletedAt: {
				type: Sequelize.DATE
			},
			status: {
				type: Sequelize.TINYINT,
				allowNull: false
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			}
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('UserAddresses');
	}
};