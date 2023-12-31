'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('Provinces', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.STRING
			},
			provinceName: {
				type: Sequelize.STRING,
				allowNull: false
			},
			provinceNameEn: {
				type: Sequelize.STRING,
				allowNull: false
			},
			fullname: {
				type: Sequelize.STRING,
				allowNull: false
			},
			fullnameEn: {
				type: Sequelize.STRING,
				allowNull: false
			},
			codeName: {
				type: Sequelize.STRING,
				allowNull: false
			},
            unitId: {
				allowNull: false,
				type: Sequelize.INTEGER,
				references: {
					model: 'Unit',
					key: 'id',
					as: 'unitId',
				}
			},
            regionId: {
				allowNull: false,
				type: Sequelize.INTEGER,
				references: {
					model: 'Regions',
					key: 'id',
					as: 'regionId',
				}
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('Provinces');
	}
};