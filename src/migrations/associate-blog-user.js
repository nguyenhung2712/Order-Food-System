'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        return queryInterface.createTable(
            'Like_Blogs',
            {
                createdAt: {
                    allowNull: false,
                    type: Sequelize.DATE,
                },
                updatedAt: {
                    allowNull: false,
                    type: Sequelize.DATE,
                },
                deletedAt: {
                    type: Sequelize.DATE
                },
                status: {
                    allowNull: false,
                    type: Sequelize.TINYINT
                },
                userId: {
                    allowNull: false,
                    type: Sequelize.UUID,
                    references: {
                        model: 'Users',
                        key: 'id',
                        as: 'userId',
                    },
                    primaryKey: true,
                },
                blogId: {
                    allowNull: false,
                    type: Sequelize.UUID,
                    references: {
                        model: 'Blogs',
                        key: 'id',
                        as: 'blogId',
                    },
                    primaryKey: true,
                },
            }
        );
    },

    async down (queryInterface, Sequelize) {
        return queryInterface.dropTable('Like_Blog');
    }
};
