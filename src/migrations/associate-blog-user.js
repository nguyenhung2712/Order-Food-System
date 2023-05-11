'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.createTable(
            'InteractBlogs',
            {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER
                },
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
                reason: {
                    type: Sequelize.STRING
                },
                status: {
                    allowNull: false,
                    type: Sequelize.TINYINT
                },
                type: {
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
                },
                blogId: {
                    allowNull: false,
                    type: Sequelize.UUID,
                    references: {
                        model: 'Blogs',
                        key: 'id',
                        as: 'blogId',
                    },
                },
            }
        );
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.dropTable('InteractBlogs');
    }
};
