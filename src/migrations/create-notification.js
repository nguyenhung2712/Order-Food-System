'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Notifications', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4
            },
            sentTime: {
                allowNull: false,
                type: Sequelize.DATE
            },
            isRead: {
                allowNull: false,
                type: Sequelize.TINYINT
            },
            checkTime: {
                allowNull: false,
                type: Sequelize.DATE
            },
            notifyType: {
                allowNull: false,
                type: Sequelize.STRING
            },
            deletedAt: {
                type: Sequelize.DATE
            },
            status: {
                allowNull: false,
                type: Sequelize.TINYINT
            },
            title: {
                allowNull: false,
                type: Sequelize.STRING
            },
            content: {
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
            receiverId: {
				allowNull: false,
				type: Sequelize.UUID,
				references: {
					model: 'Users',
					key: 'id',
					as: 'receiverId',
				}
			},
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Notifications');
    }
};