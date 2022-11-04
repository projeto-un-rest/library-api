const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const destinationPath = path.basename("uploads");

        if(!fs.existsSync(destinationPath)) {
            fs.mkdirSync(destinationPath);
        }

        cb(null, destinationPath);
    },

    filename: (req, file, cb) => {
        const dateNow = new Date().toISOString().replace(/:/g, "-");
        cb(null, dateNow + file.originalname);
    }
});

const limits = {
    fileSize: 1024 * 1024 * 2
}

const fileFilter = (req, file, cb) => {
    const fileType = file.mimetype;
    const acceptTypes = ["image/jpeg", "image/png"];

    if(acceptTypes.includes(`${ fileType }`)) {
        cb(null, true);

    } else {
        cb(new multer.MulterError(), false);
    }
}

module.exports = { storage, limits, fileFilter };