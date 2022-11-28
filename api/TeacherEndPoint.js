const router = require("express").Router();

const User = require("../model/User");
const Teacher = require("../model/Teacher");

const verifyToken = require("../middlewares/verifyToken");

router.get("/:cpf", async (req, res) => {
    const cpf = req.params.cpf;
    const user = await User.findOne({
        where: { cpf: cpf },
        include: Teacher,
        attributes: ["id", "cpf", "name", "rg", "email", "phone", "createdAt"],
    });

    if(!user || user.teacher === null) {
        res.status(404).end();

    } else {
        res.status(200).json(user);
    }
}); 

router.post("/", async (req, res) => {
    const { cpf, name, rg, email, phone, academic_title } = req.body;

    if(cpf && name && rg && email && phone && academic_title) {
        try {
            const response = await User.findOne({ where: { cpf: cpf } });

            if(response != null) {
                res.status(409).json({ error: "CPF já cadastrado" });
            }

            const status = "ATIVO";
            const temporaryPassword = Math.random().toString(36).substring(2, 10);

            const salt = bcrypt.genSaltSync(10);
            const password = bcrypt.hashSync(temporaryPassword, salt);

            const user = await User.create({ cpf, password, name, rg, email, phone, status });

            await Teacher.create({
                academic_title: academic_title,
                id_user: user.id
            });

            res.status(200).json({ temporaryPassword });

        } catch(error) { res.status(500).end(); console.log(error) }
    }
    res.status(400).end();
});

module.exports = router;