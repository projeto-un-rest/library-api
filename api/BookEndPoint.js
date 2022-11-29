const router = require("express").Router();
const multer = require("multer");
const fs = require("fs");

const { Op } = require("sequelize");

const Book = require("../model/Book");

const verifyToken = require("../middlewares/verifyToken");
const { storage, limits, fileFilter } = require("../config/multer");

const upload = multer({ storage, limits, fileFilter });

const getPagination = (size, page) => {
    const limit = size ? + size : 10;
    const offset = page ? page * limit : 0;

    return { limit, offset }
}

const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: books } = data;
    const currentPage = page ? + page : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, books, currentPage, totalPages }
}

router.get("/", async (req, res) => {
    const { title, size, page } = req.query;
    const { limit, offset } = getPagination(size, page);

    let conditions = {};

    if(title) {
        conditions.title = { [Op.like]: `${ title }%` }
    }

    try {
        const response = await Book.findAndCountAll({ limit: limit, offset: offset, where: conditions });
        const books = getPagingData(response, page, limit);
        res.status(200).json(books);

    } catch { res.status(500).end() }
});

router.get("/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const book = await Book.findOne({ where: { id: id } });
        res.status(200).json(book);

    } catch { res.status(500).end() }
});

router.post("/", async (req, res) => {
    const { title, publisher, edition, authors, subject, launch, copies } = req.body;

    try {
        const book = await Book.create({
            title,
            publisher,
            edition,
            authors,
            subject,
            launch,
            copies
        });

        res.status(200).json({
            msg: "Livro cadastrado com sucesso",
            bookId: book.id
        });
        
    } catch { res.status(500).end() }
});

const uploadImage = upload.single("image");

router.put("/image/:bookId", async (req, res) => {
    const bookId = req.params.bookId;

    try {
        const book = await Book.findOne({ where: { id: bookId } });

        if(!book) {
            res.status(404).end();

        } else if (book.image_path) {
            fs.unlinkSync(book.image_path);

        } else {
            uploadImage(req, res, async (error) => {

                if(error instanceof multer.MulterError) {
                    res.status(400).json({ error: "Arquivo Inválido" });
    
                } else if (error) {
                    res.status(500).end();
    
                }  else if (!req.file) {
                    res.status(422).json({ error: "A imagem é obrigatória" });
    
                } else {
                    await Book.update({ image_path: req.file.path }, { where: { id: book.id } });
                    res.status(200).end();
                }
            });
        }

    } catch { res.status(500).end() }
});

router.put("/:bookId", async (req, res) => {
    const { title, publisher, edition, authors, subject, launch, copies } = req.body;

    const bookId = req.params.bookId;

    try {
        await Book.update({
            title,
            publisher,
            edition,
            authors,
            subject,
            launch,
            copies

        }, { where: { id: bookId } });

        res.status(200).json({ msg: "Livro atualizado com sucesso" });

    } catch { res.status(500).end() }
});

router.delete("/:bookId", async (req, res) => {
    const bookId = req.params.bookId;

    try {
        const book = await Book.findOne({ where: { id: bookId } });

        if(!book) {
            res.status(404).end();

        } else if (book.image_path) {
            fs.unlinkSync(book.image_path);
        }

        await Book.destroy({ where: { id: book.id } });
        res.status(200).json({ msg: "Livro excluído com sucesso" });

    } catch { res.status(500).end() }
});

module.exports = router;