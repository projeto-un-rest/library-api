const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connection = require("./db/connection");

const User = require("./model/User");
const Address = require("./model/Address");
const Student = require("./model/Student");
const Teacher = require("./model/Teacher");
const Book = require("./model/Book");
const Load = require("./model/Loan");

const BookEndPoint = require("./api/BookEndPoint");

const app = express();


app.use(cors());

app.use("/uploads", express.static("uploads"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


connection.authenticate()
    .then(() => console.log("The MySQL Database has been connected"))
    .catch(error => console.log(error))

connection.sync()


app.use("/api/book", BookEndPoint);


app.get("/", (req, res) => {
    res.status(200).json({ status: "Ok" });
});

app.listen(4343, () => {
    console.log("The server has been connected");
});