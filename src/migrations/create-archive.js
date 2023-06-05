'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Archives', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            admin: {
                type: Sequelize.UUID,
                references: {
                    model: 'AdminStaffs',
                    key: 'id',
                    as: 'admin',
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
            typeId: {
                type: Sequelize.UUID,
                references: {
                    model: 'ArchiveTypes',
                    key: 'id',
                    as: 'typeId',
                }
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Archives');
    }
};