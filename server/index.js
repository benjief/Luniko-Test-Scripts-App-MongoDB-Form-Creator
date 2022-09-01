const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

const connect = require("./connect");
const { Step, TestingSession, StepResponse, TestScript } = require("./schemas/schemas");

// import { deleteStepResponseImage } from "./firebase/config";

// Middleware
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
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
            name_lowercase: testScriptName.toLowerCase(),
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
        console.log("test");
        const testScriptNames = await TestScript.find(
            {},
            { "name_lowercase": 1, "_id": 0 }
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
            { name_lowercase: testScriptName },
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
        ).sort({ updatedAt: "desc" }).lean().exec();
        await getTestingSessionResponses(testingSessions)
        res.status(200).json(testingSessions);
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
    console.log("deleting", testScriptID);
    try {
        await TestScript.deleteOne({ _id: testScriptID })
            .then(response => {
                console.log(response);
                console.log("deleted test script");
                res.status(204).send(response);
            })
    } catch (e) {
        res.status(500).send;
    }
});

app.delete("/delete-testing-session/:testingSessionID", async (req, res) => {
    const testingSessionID = req.params.testingSessionID;
    try {
        await deleteImagesAssociatedWithTestingSession(testingSessionID);
        console.log("deleted images associated with testing session");
        await TestingSession.deleteOne({ _id: testingSessionID })
            .then(response => {
                console.log(response);
                console.log("testing session deleted");
                res.status(204).send(response);
            });
    } catch (e) {
        res.status(500).send;
    }
});

// Helper functions
/**
 * Calls addTestScriptIDToSteps (so that all steps contain a reference to the test script they are being submitted for) before creating step documents for each step in stepsToAdd.
 * @param {string} testScriptID - the ID of the test script that the steps being added to the database are a part of.
 * @param {array} stepsToAdd - array of steps for which database documents are to be written.
 */
const addSteps = async (testScriptID, stepsToAdd) => {
    // console.log(stepsToAdd);
    // console.log("adding IDs to steps")
    addTestScriptIDToSteps(testScriptID, stepsToAdd);
    // console.log("adding steps");
    try {
        await Step.create(stepsToAdd);
    } catch (e) {
        console.log(e);
    }
}

/**
 * Adds the correct test script ID to all steps in stepsToAdd array.
 * @param {string} testScriptID - the ID of the test script that the steps being added to the database are a part of.
 * @param {array} stepsToAdd - array of steps for which an ID attribute is to be written.
 */
const addTestScriptIDToSteps = (testScriptID, stepsToAdd) => {
    for (let i = 0; i < stepsToAdd.length; i++) {
        stepsToAdd[i]["testScriptID"] = testScriptID;
    }
}

/**
 * Fetches testing session responses from the database for an array of testing sessions. Note that step numbers (not directly stored in step response documents) are retrieved during this process with a call to addStepNumberToStepResponses.
 * @param {array} testingSessions - array of testing sessions for which results are to be fetched.
 */
const getTestingSessionResponses = async (testingSessions) => {
    for (let i = 0; i < testingSessions.length; i++) {
        try {
            const testingSessionResponses = await StepResponse.find(
                { sessionID: testingSessions[i]._id, $or: [{ comments: { $ne: "" } }, { uploadedImage: { $ne: null } }] }
            ).lean().exec();
            await addStepNumberToStepResponses(testingSessionResponses);
            testingSessions[i]["responses"] = testingSessionResponses;
        } catch (e) {
            console.log(e);
        }
    }
}

/**
 * Retrieves and adds a step number attribute (stored in step documents) to step response documents.
 * @param {array} stepResponses - array of step responses to which step numbers are to be retrieved/added.
 */
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

/**
 * Deletes step documents associated with a particular test script from the database.
 * @param {string} testScriptID - ID of the test script document for which steps are to be removed from the database.
 */
const deleteStepsAssociatedWithTestScript = async (testScriptID) => {
    try {
        await Step.deleteMany({ testScriptID: testScriptID });
    } catch (e) {
        console.log(e);
    }
}

// const loadFirebaseConfig = async () => {
//     const { deleteStepResponseImage } = await import("./firebase/config.mjs");
// }

/**
 * Retrieves step responses to delete for a given testing session and removes any images associated with said step responses from Google Firebase Cloud Storage (through calls to deleteStepResponseImage, a function dynamically imported from config.mjs in the firebase folder).
 * @param {string} testingSessionID - ID of the testing session for which associated images are to be removed from Google Firebase Cloud Storage.
 */
const deleteImagesAssociatedWithTestingSession = async (testingSessionID) => {
    try {
        const { deleteStepResponseImage } = await import("./firebase/config.mjs"); // dynamically imported firebase function
        // console.log("module loaded");
        const stepResponsesToDelete = await StepResponse.find(
            { sessionID: testingSessionID },
            { "uploadedImage": 1 }
        ).lean().exec();
        for (let i = 0; i < stepResponsesToDelete.length; i++) {
            if (stepResponsesToDelete[i]["uploadedImage"]) {
                console.log("deleting", stepResponsesToDelete[i]["uploadedImage"].imageName);
                await deleteStepResponseImage(stepResponsesToDelete[i]["uploadedImage"].imageName);
            }
        }
    } catch (e) {
        console.log(e);
    }
}

connect()
    // local connection code
    // .then(() => app.listen(5000, () => {
    //     console.log("Yay! Your server is running on http://localhost:5000!");
    // }))
    // .catch(e => console.error(e));

    // Heroku connection code
    .then(() => app.listen(process.env.PORT || 5000, () => {
        console.log("Yay! Your server is running on port 5000!");
    }))
    .catch(e => console.error(e));
