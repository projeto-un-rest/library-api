const router = require("express").Router();
const multer = require("multer");
const fs = require("fs");

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
    const { size, page } = req.query;
    const { limit, offset } = getPagination(size, page);

    try {
        const response = await Book.findAndCountAll({ limit, offset });
        const books = getPagingData(response, page, limit);
        res.status(200).json(books);

    } catch { res.status(500).end() }
});

module.exports = router;