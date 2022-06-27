const express = require("express");
const morgan = require("morgan");
// const { urlencoded, json } = require("body-parser");
const cors = require("cors");

const app = express();

const connect = require("./connect");
const { Step, TestingSession, StepResponse, TestScript } = require("./schemas/schemas");
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
        ).sort({ number: "asc" }).lean().exec();
        res.status(200).json(steps);
    } catch (e) {
        res.status(500).send;
    }
});

app.get("/get-test-script-testing-sessions/:testScriptID", async (req, res) => {
    const testScriptID = req.params.testScriptID;
    try {
        const testingSessions = await TestingSession.find(
            { testScriptID: testScriptID }
        ).sort({updatedAt: "desc"}).lean().exec();
        await getTestingSessionResponses(testingSessions)
        res.status(200).json(testingSessions);
    } catch (e) {
        res.status(500).send;
    }
});

// app.get("/get-test-script-testing-sessions/:testScriptID", async (req, res) => {
//     const testScriptID = req.params.testScriptID;
//     try {
//         console.log(testScriptID);
//         const testingSessions = await TestingSession.find(
//             { testScriptID: testScriptID }
//         ).sort({ updatedAt: 'desc' }).lean().exec();
//         res.status(200).json(testingSessions);
//     } catch (e) {
//         res.status(500).send;
//     }
// });

// app.get("/get-testing-session-responses/:testingSessionID", async (req, res) => {
//     const testingSessionID = req.params.testingSessionID;
//     try {
//         // console.log("getting responses for:", testingSessionID);
//         const responses = await StepResponse.find(
//             { sessionID: testingSessionID }
//         ).lean().exec();
//         await addStepNumberAndDescription(responses);
//         res.status(200).json(responses);
//     } catch (e) {
//         res.status(500).send;
//     }
// });

// app.get("/get-testing-session-responses/:testingSessionID", async (req, res) => {
//     const testingSessionID = req.params.testingSessionID;
//     try {
//         // console.log("getting responses for:", testingSessionID);
//         const responses = await StepResponse.find(
//             { sessionID: testingSessionID }
//         ).lean().exec();
//         await addStepNumber(responses);
//         res.status(200).json(responses);
//     } catch (e) {
//         res.status(500).send;
//     }
// });

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
                steps: testScriptSteps
            },
            { new: true }
        ).exec();
        await deleteStepsAssociatedWithTestScript(testScript.toObject()._id.toString());
        await addSteps(testScript.toObject()._id.toString(), testScriptSteps);
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
    console.log(stepsToAdd);
    console.log("adding IDs to steps")
    addTestScriptIDToSteps(testScriptID, stepsToAdd);
    console.log("adding steps");
    try {
        await Step.create(stepsToAdd);
    } catch (e) {
        console.log(e);
    }
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

const getTestingSessionResponses = async (testingSessions) => {
    for (let i = 0; i < testingSessions.length; i++) {
        try {
            const testingSessionResponses = await StepResponse.find(
                { sessionID: testingSessions[i]._id, comments: { $ne: "" } }
            ).lean().exec();
            await addStepNumberToStepResponses(testingSessionResponses);
            testingSessions[i]["responses"] = testingSessionResponses;
        } catch (e) {
            console.log(e);
        }
    }
}

const addStepNumberToStepResponses = async (stepResponses) => {
    for (let i = 0; i < stepResponses.length; i++) {
        try {
            const stepNumber = await Step.find(
                { _id: stepResponses[i].stepID },
                { "number": 1 }
            ).lean().exec();
            stepResponses[i]["step"] = stepNumber[0]["number"];
        } catch (e) {
            console.log(e);
        }
    }
}

// const addTestingSessionResponsesToTestingSession = async (testingSession) => {

// }

// const addStepNumber/*AndDescription*/ = async (responses) => {
//     try {
//         for (let i = 0; i < responses.length; i++) {
//             const step = await Step.findOne(
//                 { _id: responses[i].stepID },
//                 {
//                     "number": 1,
//                     // "description": 1,
//                 }
//             ).lean().exec();
//             responses[i]["stepNumber"] = step["number"];
//             // responses[i]["stepDescription"] = step["description"];
//         }
//     } catch (e) {
//         console.log(e);
//     }
// }

const deleteStepsAssociatedWithTestScript = async (testScriptID) => {
    try {
        await Step.deleteMany({ testScriptID: testScriptID });
    } catch (e) {
        console.log(e);
    }
}

connect()
    .then(() => app.listen(5000, () => {
        console.log("Yay! Your server is running on http://localhost:5000!");
    }))
    .catch(e => console.error(e));
