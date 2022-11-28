const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../model/User");

const verifyToken = require("../middlewares/verifyToken");

require("dotenv").config();

router.post("/authenticate", async (req, res) => {
    const { cpf, password } = req.body;

    if(cpf && password) {
        try {
            const user = await User.findOne({ where: { cpf: cpf } });

            if(user) {

                const isCorrectLogin = bcrypt.compareSync(password, user.password);

                if(isCorrectLogin) {

                    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
                        expiresIn: 86400000
                    });

                    res.status(200).json({
                        id: user.id,
                        cpf: user.cpf,
                        name: user.name,
                        rg: user.rg,
                        email: user.email,
                        phone: user.phone,
                        createdAt: user.createAt,
                        token: token
                    });
                }
                res.status(401).end()
            }
            res.status(401).end()

        } catch { res.status(500).end() }
    }
    res.status(400).end()
});

router.put("/:id", async (req, res) => {
    const { email, phone } = req.body;

    const id = req.params.id;

    try {
        await User.update({ email, phone }, { where: { id: id } });
        res.status(200).end();

    } catch { res.status(500).end() }
});

router.delete("/:id", async (req, res) => {
    const id = req.params.id;

    try {
        await User.update({ status: "INATIVO" }, { where: { id: id } });
        res.status(200).end();

    } catch { res.status(500).end() }
});

module.exports = router;