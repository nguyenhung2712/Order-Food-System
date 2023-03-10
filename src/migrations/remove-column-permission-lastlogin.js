'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.removeColumn('Permissions', 'lastLogin')
        ]);
    },

    async down (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addColumn('Permissions', 'lastLogin', {
                type: Sequelize.TINYINT,
                allowNull: false,
            })
        ]);
    }
};
