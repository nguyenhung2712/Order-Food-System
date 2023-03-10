'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        return queryInterface.createTable(
            'Role_Permissions',
            {
                createdAt: {
                    allowNull: false,
                    type: Sequelize.DATE,
                },
                updatedAt: {
                    allowNull: false,
                    type: Sequelize.DATE,
                },
                permissionId: {
                    allowNull: false,
                    type: Sequelize.UUID,
                    references: {
                        model: 'Permissions',
                        key: 'id',
                        as: 'permissionId',
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
            }
        );
    },

    async down (queryInterface, Sequelize) {
        return queryInterface.dropTable('Role_Permissions');
    }
};
