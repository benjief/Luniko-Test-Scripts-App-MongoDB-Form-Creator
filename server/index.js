const express = require("express");
const morgan = require("morgan");
const { urlencoded, json } = require("body-parser");
const cors = require("cors");

const app = express();

const connect = require("./connect");
const TestScript = require("./schemas/testScript");
const Personnel = require("./schemas/personnel");
const Step = require("./schemas/step");

// Middleware
app.use(morgan("dev"));
app.use(urlencoded({ extended: true }));
app.use(cors());
app.use(json());

// Queries
app.post("/add-personnel", async (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    // const personnelToCreate = req.body.personnel;
    try {
        const personnel = await Personnel.create({
            firstName: firstName,
            lastName: lastName
        }
            // personnelToCreate
        );
        res.status(201).json(personnel.toObject());
    } catch (e) {
        res.status(500).send;
    }
});

connect('mongodb://127.0.0.1:27017/luniko')
    .then(() => app.listen(5000, () => {
        console.log("Yay! Your server is running on http://localhost:5000!");
    }))
    .catch(e => console.error(e));
