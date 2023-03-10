'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addColumn('Users', 'is2FA', {
                type: Sequelize.TINYINT,
                allowNull: false,
            })
        ]);
    },

    async down (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.removeColumn('Users', 'is2FA')
        ]);
    }
};
