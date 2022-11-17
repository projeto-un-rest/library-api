const Sequelize = require("sequelize");
const connection = require("../db/connection");

const Book = connection.define("book", {
    title: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    publisher: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    edition: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    authors: {
        type: Sequelize.STRING(150),
        allowNull: false
    },
    image_path: {
        type: Sequelize.STRING(255),
        allowNull: true
    },
    subject: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    launch: {
        type: Sequelize.DATE,
        allowNull: false
    },
    copies: {
        type: Sequelize.INTEGER,
        allowNull: false
    }

}, { createdAt: false, updatedAt: false });

module.exports = Book;