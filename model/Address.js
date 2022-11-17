const Sequelize = require("sequelize");
const connection = require("../db/connection");

const Address = connection.define("address", {
    street: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    number: {
        type: Sequelize.STRING(25),
        allowNull: false
    },
    neighborhood: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    complement: {
        type: Sequelize.STRING(150),
        allowNull: false
    },
    city: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    state: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    zip_code: {
        type: Sequelize.STRING(8),
        allowNull: false
    }

}, { createdAt: false, updatedAt: false });

module.exports = Address;