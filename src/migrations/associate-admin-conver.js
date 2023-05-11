'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('AdminConvers', {
            adminId: {
                allowNull: false,
                type: Sequelize.UUID,
                references: {
                    model: 'AdminStaffs',
                    key: 'id',
                    as: 'adminId',
                },
                primaryKey: true,
            },
            converId: {
                allowNull: false,
                type: Sequelize.UUID,
                references: {
                    model: 'Conversations',
                    key: 'id',
                    as: 'converId',
                },
                primaryKey: true,
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
        await queryInterface.dropTable('AdminConvers');
    }
};