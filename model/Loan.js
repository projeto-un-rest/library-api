const Sequelize = require("sequelize");
const connection = require("../db/connection");

const Load = connection.define("load", {
    dt_load: {
        type: Sequelize.DATE,
        allowNull: false
    },
    dt_devolution: {
        type: Sequelize.DATE,
        allowNull: false
    },
    dt_receipt: {
        type: Sequelize.DATE,
        allowNull: false
    }

}, { createdAt: false, updatedAt: false });

module.exports = Load;