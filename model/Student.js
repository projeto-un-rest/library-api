const Sequelize = require("sequelize");
const connection = require("../db/connection");

const Student = connection.define("student", {
    registration: {
        type: Sequelize.STRING(50),
        allowNull: false
    }

}, { id: false, createdAt: false, updatedAt: false });

module.exports = Student;