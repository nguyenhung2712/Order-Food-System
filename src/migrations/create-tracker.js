'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Trackers', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            statusCode: {
                allowNull: false,
                type: Sequelize.STRING
            },
            apiText: {
                allowNull: false,
                type: Sequelize.STRING
            },
            ipAddress: {
                allowNull: false,
                type: Sequelize.STRING
            },
            typeApi: {
                allowNull: false,
                type: Sequelize.STRING
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            userId: {
				type: Sequelize.UUID,
				references: {
					model: 'Users',
					key: 'id',
					as: 'userId',
				}
			},
            adminId: {
				type: Sequelize.UUID,
				references: {
					model: 'AdminStaffs',
					key: 'id',
					as: 'adminId',
				}
			},
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Trackers');
    }
};