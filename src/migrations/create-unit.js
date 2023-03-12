'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('Units', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
            fullname: {
				type: Sequelize.STRING,
				allowNull: false
			},
			fullnameEn: {
				type: Sequelize.STRING,
				allowNull: false
			},
			shortName: {
				type: Sequelize.STRING,
				allowNull: false
			},
			shortNameEn: {
				type: Sequelize.STRING,
				allowNull: false
			},
			codeName: {
				type: Sequelize.STRING,
				allowNull: false
			},
            codeNameEn: {
				type: Sequelize.STRING,
				allowNull: false
			}
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('Units');
	}
}; 