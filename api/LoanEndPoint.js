const router = require("express").Router();

const Loan = require("../model/Loan");
const User = require("../model/User");
const Book = require("../model/Book");

const verifyToken = require("../middlewares/verifyToken");

router.get("/:userId", async (req, res) => {
    const userId = req.params.userId;

    try {
        const response = await User.findByPk(userId, {
            attributes: ["id", "cpf", "name", "rg", "email", "phone", "createdAt"],
            include: {
                model: Loan,
                include: [Book]
            }
        });
        
        const dateNow = new Date();

        response.loads.forEach(load => {

            load = load.dataValues;

            if(load.dt_withdrawal === null) {
                load.status = "Aguardando retirada";

            } else if(load.dt_receipt != null) {
                load.status = "Entregue";

            } else if(new Date(load.dt_devolution) < dateNow) {
                load.status = "Atrasado";

            } else {
                load.status = "Em dia";
            }
        });

        res.status(200).json(response);

    } catch { res.status(500).end() }
});

router.post("/", async (req, res) => {
    const { idBook, idUser } = req.body;

    if(idBook && idUser) {
        try {
            const dateLoan = new Date().toISOString();

            await Loan.create({
                dt_load: dateLoan,
                id_book: idBook,
                id_user: idUser
            });

            res.status(200).end();

        } catch { res.status(500).end() }
    }
    res.status(400).end();
});

router.post("/withdrawal/:loanId", async (req, res) => {
    const loanId = req.params.loanId;

    try {
        const loan = await Loan.findByPk(loanId);

        if(loan.dt_withdrawal != null) {
            res.status(409).json({ error: "Livro já entregue" });
        }

        const dateNow = new Date();

        const dateWithdrawal = dateNow.toISOString();
        const dateDevolution = new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate() + 3, 23, 59).toISOString();

        await Loan.update({
            dt_withdrawal: dateWithdrawal,
            dt_devolution: dateDevolution

        }, { where: { id: loanId } })

        res.status(200).end();

    } catch { res.status(500).end() }
});

router.post("/renovate/:loanId", async (req, res) => {
    const loanId = req.params.loanId;

    try {
        const loan = await Loan.findByPk(loanId);

        const dateNow = new Date();
        const dateDevolution = new Date(loan.dt_devolution);

        if(dateDevolution < dateNow) {
            res.status(409).json({ error: "Não é possível renovar um empréstimo atrasado" });
        }

        const newDateDevolution = new Date(dateDevolution.getFullYear(), dateDevolution.getMonth(), dateDevolution.getDate() + 3, 23, 59).toISOString();

        await Loan.update({ dt_devolution: newDateDevolution }, { where: { id: loanId } });
        res.status(200).end();
        
    } catch { res.status(500).end() }
});

router.post("/refund/:loanId", async (req, res) => {
    const loanId = req.params.loanId;

    try {
        const loan = await Loan.findByPk(loanId);

        if(loan.dt_receipt != null) {
            res.status(409).json({ error: "Livro já devolvido" });
        }

        const dateReceipt = new Date().toISOString();

        await Loan.update({ dt_receipt: dateReceipt }, { where: { id: loanId } });
        res.status(200).end();

    } catch { res.status(500).end() }
});

module.exports = router;