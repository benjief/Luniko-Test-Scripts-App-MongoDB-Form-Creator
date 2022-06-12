const express = require("express");
const morgan = require("morgan");
// const { urlencoded, json } = require("body-parser");
const cors = require("cors");

const app = express();

const connect = require("./connect");
const { Step, TestScript } = require("./schemas/schemas");
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
        await addSteps(testScript.toObject()._id.toString(), testScriptSteps);
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
                // "steps": 1
            }
        ).lean().exec();
        res.status(200).json(testScript);
    } catch (e) {
        res.status(500).send;
    }
});

app.get("/get-test-script-steps/:testScriptID", async (req, res) => {
    const testScriptID = req.params.testScriptID;
    try {
        const steps = await Step.find(
            { testScriptID: testScriptID }
        ).lean().exec();
        res.status(200).json(steps);
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
    // console.log(req.body);
    try {
        const testScript = await TestScript.findOneAndUpdate(
            { name: testScriptName },
            {
                name: testScriptName,
                owner: testScriptOwner,
                description: testScriptDescription,
                primaryWorkstream: testScriptPrimaryWorkstream,
                // steps: testScriptSteps
            },
            { new: true }
        ).exec();
        await deleteStepsAssociatedWithTestScript(testScript.toObject()._id.toString());
        // await addSteps(testScriptName, testScriptSteps);
        res.status(201).json(testScript.toObject());
    } catch (e) {
        res.status(500).send;
    }
});

app.delete("/delete-test-script/:testScriptID", async (req, res) => {
    const testScriptID = req.params.testScriptID;
    try {
        deletedTestScript = await TestScript.deleteOne({ _id: testScriptID });
        res.status(204).send;
    } catch (e) {
        res.status(500).send;
    }

});

// Helper functions
const addSteps = async (testScriptID, stepsToAdd) => {
    addTestScriptIDToSteps(testScriptID, stepsToAdd);
    await Step.create(stepsToAdd);
    // const updatedTestScript = await TestScript.updateOne(
    //     { name: testScriptName },
    //     { $set: { steps: steps } },
    //     { new: true }
    // );
}

const addTestScriptIDToSteps = (testScriptID, stepsToAdd) => {
    for (let i = 0; i < stepsToAdd.length; i++) {
        stepsToAdd[i]["testScriptID"] = testScriptID;
    }
}

const deleteStepsAssociatedWithTestScript = async (testScriptID) => {
    await Step.deleteMany({ testScriptID: testScriptID });
}

connect()
    .then(() => app.listen(5000, () => {
        console.log("Yay! Your server is running on http://localhost:5000!");
    }))
    .catch(e => console.error(e));
