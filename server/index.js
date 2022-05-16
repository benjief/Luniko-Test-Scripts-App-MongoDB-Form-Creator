const express = require("express");
const morgan = require("morgan");
const { urlencoded, json } = require("body-parser");
const cors = require("cors");

const app = express();

const connect = require("./connect");
const { Step, TestScript } = require("./schemas/testScript");
const e = require("express");

// Middleware
app.use(morgan("dev"));
app.use(urlencoded({ extended: true }));
app.use(cors());
app.use(json());

// Queries
app.post("/add-test-script", async (req, res) => {
    const testScriptName = req.body.testScriptName;
    const testScriptOwner = req.body.testScriptOwner;
    const testScriptDescription = req.body.testScriptDescription;
    const testScriptPrimaryWorkstream = req.body.testScriptPrimaryWorkstream;
    const testScriptSteps = req.body.testScriptSteps;
    try {
        const testScript = await TestScript.create({
            name: testScriptName,
            owner: testScriptOwner,
            description: testScriptDescription,
            primaryWorkstream: testScriptPrimaryWorkstream,
        });
        await addSteps(testScriptName, testScriptSteps);
        res.status(201).json(testScript.toObject());
    } catch (e) {
        res.status(500).send;
    }
});

app.get("/get-test-script-names", async (req, res) => {
    const testScriptNames = await TestScript.find(
        {},
        { "name": 1, "_id": 0 }
    ).lean().exec();
    res.status(200).json(testScriptNames);
});

app.delete("/delete-test-script/:testScriptName", async (req, res) => {
    const testScriptName = req.params.testScriptName;
    try {
        console.log(testScriptName);
        deletedTestScript = await TestScript.deleteOne({ name: testScriptName });
        res.status(204).send;
    } catch (e) {
        res.status(500).send;
    }

})

// Helper functions
const addSteps = async (testScriptName, stepsToAdd) => {
    console.log("adding steps to", testScriptName);
    addTestScriptNameToSteps(testScriptName, stepsToAdd);
    console.log(stepsToAdd);
    const steps = await Step.create(stepsToAdd);
    console.log(steps);
    const updatedTestScript = await TestScript.updateOne(
        { name: testScriptName },
        { $set: { steps: steps } },
        { new: true }
    );
}

const addTestScriptNameToSteps = (testScriptName, stepsToAdd) => {
    for (let i = 0; i < stepsToAdd.length; i++) {
        stepsToAdd[i]["testScriptName"] = testScriptName;
    }
}

connect()
    .then(() => app.listen(5000, () => {
        console.log("Yay! Your server is running on http://localhost:5000!");
    }))
    .catch(e => console.error(e));
