const express = require("express");
const morgan = require("morgan");
// const { urlencoded, json } = require("body-parser");
const cors = require("cors");

const app = express();

const connect = require("./connect");
const { Step, TestScript } = require("./schemas/testScript");
// const e = require("express");

// Middleware
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(urlencoded({ extended: true }));
// app.use(json());
app.use(cors());

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
    try {
        const testScriptNames = await TestScript.find(
            {},
            { "name": 1, "_id": 0 }
        ).lean().exec();
        res.status(200).json(testScriptNames);
    } catch (e) {
        res.status(500).send;
    }
});

app.get("/get-test-script/:testScriptName", async (req, res) => {
    const testScriptName = req.params.testScriptName;
    console.log("fetching", testScriptName);
    try {
        const testScript = await TestScript.findOne(
            { name: testScriptName },
            {
                "name": 1,
                "description": 1,
                "owner": 1,
                "primaryWorkstream": 1,
                "steps": 1
            }
        ).lean().exec();
        res.status(200).json(testScript);
    } catch (e) {
        res.status(500).send;
    }
});

app.put("/update-test-script", async (req, res) => {
    console.log("updating");
    const testScriptOwner = req.body.testScriptOwner;
    const testScriptName = req.body.testScriptName;
    const testScriptDescription = req.body.testScriptDescription;
    const testScriptPrimaryWorkstream = req.body.testScriptPrimaryWorkstream;
    const testScriptSteps = req.body.testScriptSteps;
    console.log(req.body);
    try {
        await deleteStepsAssociatedWithTestScript(testScriptName);
        const testScript = await TestScript.findOneAndUpdate(
            { name: testScriptName },
            {
                name: testScriptName,
                owner: testScriptOwner,
                description: testScriptDescription,
                primaryWorkstream: testScriptPrimaryWorkstream,
                steps: testScriptSteps
            },
            { new: true }
        ).exec();
        await addSteps(testScriptName, testScriptSteps);
        res.status(201).json(testScript.toObject());
    } catch (e) {
        res.status(500).send;
    }
});

app.delete("/delete-test-script/:testScriptName", async (req, res) => {
    const testScriptName = req.params.testScriptName;
    try {
        deletedTestScript = await TestScript.deleteOne({ name: testScriptName });
        res.status(204).send;
    } catch (e) {
        res.status(500).send;
    }

});

// Helper functions
const addSteps = async (testScriptName, stepsToAdd) => {
    addTestScriptNameToSteps(testScriptName, stepsToAdd);
    const steps = await Step.create(stepsToAdd);
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

const deleteStepsAssociatedWithTestScript = async (testScriptName) => {
    await Step.deleteMany({ testScriptName: testScriptName });
}

connect()
    .then(() => app.listen(5000, () => {
        console.log("Yay! Your server is running on http://localhost:5000!");
    }))
    .catch(e => console.error(e));
