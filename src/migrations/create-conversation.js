'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Conversations', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING
            },
            slug: {
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
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            userId: {
                allowNull: false,
                type: Sequelize.UUID,
                references: {
                    model: 'Users',
                    key: 'id',
                    as: 'userId',
                }
            },
            adminId: {
                allowNull: false,
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
        await queryInterface.dropTable('Conversations');
    }
};