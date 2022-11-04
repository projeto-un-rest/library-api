const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connection = require("./db/connection");

const app = express();


app.use(cors());

app.use("/uploads", express.static("uploads"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


connection.authenticate()
    .then(() => console.log("The MySQL Database has been connected"))
    .catch(error => console.log(error))

connection.sync()


app.get("/", (req, res) => {
    res.status(200).json({ status: "Ok" });
});

app.listen(4343, () => {
    console.log("The server has been connected");
});