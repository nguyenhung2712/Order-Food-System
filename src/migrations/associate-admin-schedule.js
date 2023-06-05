'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('AdminSchedules', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            adminId: {
                allowNull: false,
                type: Sequelize.UUID,
                references: {
                    model: 'AdminStaffs',
                    key: 'id',
                    as: 'adminId',
                },
            },
            scheduleId: {
                allowNull: false,
                type: Sequelize.UUID,
                references: {
                    model: 'Schedules',
                    key: 'id',
                    as: 'scheduleId',
                },
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
        await queryInterface.dropTable('AdminSchedules');
    }
};