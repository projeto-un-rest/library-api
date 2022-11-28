const Sequelize = require("sequelize");
const connection = require("../db/connection");

const Student = require("./Student");
const Teacher = require("./Teacher");
const Address = require("./Address");
const Load = require("./Loan");
const Book = require("./Book");

const User = connection.define("user", {
    cpf: {
        type: Sequelize.STRING(11),
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    rg: {
        type: Sequelize.STRING(8),
        allowNull: false,
        unique: true
    },
    email: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    phone: {
        type: Sequelize.STRING(11),
        allowNull: false
    },
    status: {
        type: Sequelize.STRING(10),
        allowNull: false
    }

}, { updatedAt: false });

Student.belongsTo(User, {
    constraint: true,
    foreignKey: "id_user"
});

User.hasOne(Student, {
    constraint: true,
    foreignKey: "id_user"
});

Teacher.belongsTo(User, {
    constraint: true,
    foreignKey: "id_user"
});

User.hasOne(Teacher, {
    constraint: true,
    foreignKey: "id_user"
});

User.hasMany(Address, {
    constraint: true,
    foreignKey: "id_user"
});

Load.belongsTo(Book, {
    constraint: true,
    foreignKey: "id_book"
});

Load.belongsTo(User, {
    constraint: true,
    foreignKey: "id_user"
});

User.hasMany(Load, {
    constraint: true,
    foreignKey: "id_user"
});

module.exports = User;