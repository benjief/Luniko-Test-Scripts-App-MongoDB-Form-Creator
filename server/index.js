const mongoose = require("mongoose");
const express = require("express");
const morgan = require("morgan");
const { urlencoded, json } = require("body-parser");

const app = express();

// Schemas and models

// Middleware
app.use(morgan("dev"));
app.use(urlencoded({ extended: true }));
app.use(json());

const connect = () => {
    return mongoose.connect('mongodb://127.0.0.1:27017/luniko', {
        autoIndex: true
    });
}

connect()
    .then(async connection => {
        app.listen(5000); // start server AFTER the DB is connected... could also do this FIRST, depending on the situation!
        console.log("Yay! Your server is running!");
    })
    .catch(e => console.error(e));