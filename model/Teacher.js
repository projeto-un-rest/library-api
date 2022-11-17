const Sequelize = require("sequelize");
const connection = require("../db/connection");

const Teacher = connection.define("teacher", {
    academic_title: {
        type: Sequelize.STRING(100),
        allowNull: false
    }

}, { id: false, createdAt: false, updatedAt: false });

module.exports = Teacher;