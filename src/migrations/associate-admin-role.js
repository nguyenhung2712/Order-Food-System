'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        return queryInterface.createTable(
            'Admin_Roles',
            {
                createdAt: {
                    allowNull: false,
                    type: Sequelize.DATE,
                },
                updatedAt: {
                    allowNull: false,
                    type: Sequelize.DATE,
                },
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
                roleId: {
                    allowNull: false,
                    type: Sequelize.UUID,
                    references: {
                        model: 'Roles',
                        key: 'id',
                        as: 'roleId',
                    },
                    primaryKey: true,
                },
                deletedAt: {
                    type: Sequelize.DATE
                },
                status: {
                    allowNull: false,
                    type: Sequelize.TINYINT
                },
            }
        );
    },

    async down (queryInterface, Sequelize) {
        return queryInterface.dropTable('Admin_Role');
    }
};
