'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('Addresses', {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4
			},
			address: {
				type: Sequelize.STRING,
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
			},
            wardId: {
				allowNull: false,
				type: Sequelize.INTEGER,
				references: {
					model: 'Wards',
					key: 'id',
					as: 'wardId',
				}
			},
            districtId: {
				allowNull: false,
				type: Sequelize.INTEGER,
				references: {
					model: 'Districts',
					key: 'id',
					as: 'districtId',
				}
			},
            provinceId: {
				allowNull: false,
				type: Sequelize.INTEGER,
				references: {
					model: 'Provinces',
					key: 'id',
					as: 'provinceId',
				}
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('Addresses');
	}
};