'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Histories', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            action: {
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
            /* adminId: {
                allowNull: false,
                type: Sequelize.UUID,
                references: {
                    model: 'AdminStaffs',
                    key: 'id',
                    as: 'adminId',
                }
            }, */
            orderId: {
                type: Sequelize.UUID,
                references: {
                    model: 'Orders',
                    key: 'id',
                    as: 'orderId',
                }
            },
            blogId: {
                type: Sequelize.UUID,
                references: {
                    model: 'Blogs',
                    key: 'id',
                    as: 'blogId',
                }
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Histories');
    }
};