const router = require("express").Router();

const Address = require("../model/Address");

const verifyToken = require("../middlewares/verifyToken");

router.post("/", async (req, res) => {
    const { userId, street, number, neighborhood, complement, city, state, zipCode } = req.body;

    if(userId && street && number && zipCode) {
        try {
            await Address.create({
                street: street,
                number: number,
                neighborhood: neighborhood,
                complement: complement,
                city: city,
                state: state,
                zip_code: zipCode,
                id_user: userId
            });

            res.status(200).end();

        } catch { res.status(500).end() }
    }
    res.status(400).end();
});

router.delete("/:addressId", async (req, res) => {
    const addressId = req.params.addressId;

    try {
        await Address.destroy({ where: { id: addressId } });
        res.status(200).end();

    } catch { res.status(500).end() }
});

module.exports = router;