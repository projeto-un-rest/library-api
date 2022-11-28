const router = require("express").Router();
const bcrypt = require("bcryptjs");

const { Op } = require("sequelize");

const User = require("../model/User");
const Student = require("../model/Student");

const verifyToken = require("../middlewares/verifyToken");

router.get("/:cpf", async (req, res) => {
    const cpf = req.params.cpf;
    const user = await User.findOne({
        where: { cpf: cpf },
        include: Student,
        attributes: ["id", "cpf", "name", "rg", "email", "phone", "createdAt"],
    });
    
    if(!user || user.student === null) {
        res.status(404).end();

    } else {
        res.status(200).json(user);
    }
});

router.post("/", async (req, res) => {
    const { cpf, name, rg, email, phone, registration } = req.body;

    if(cpf && name && rg && email && phone && registration) {
        try {
            const response = await User.findOne({
                where: {
                    [Op.or]: [ { cpf: cpf }, { rg: rg } ]
                }
            });

            if(response != null) {
                res.status(409).json({ error: "Usuário já cadastrado" });
            }

            const status = "ATIVO";
            const temporaryPassword = Math.random().toString(36).substring(2, 10);

            const salt = bcrypt.genSaltSync(10);
            const password = bcrypt.hashSync(temporaryPassword, salt);

            const user = await User.create({ cpf, password, name, rg, email, phone, status });

            await Student.create({
                registration: registration,
                id_user: user.id
            });

            res.status(200).json({ temporaryPassword });

        } catch { res.status(500).end() }
    }
    res.status(400).end();
});

module.exports = router;