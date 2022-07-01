const mongoose = require("mongoose");

const step = new mongoose.Schema({
    testScriptID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "testScript"
    },
    number: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        maxlength: 1000,
        required: true
    },
    // pass: {
    //     type: Boolean,
    //     default: false,
    //     required: true
    // },
    // comments: {
    //     type: String
    // },
    // id: {
    //     type: String
    // }
});

const testingSession = new mongoose.Schema({
    testScriptID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "testScript"
    },
    // testScriptID: {
    //     type: String
    // },
    tester: {
        type: {
            firstName: String,
            lastName: String
        },
        required: true
    },
    pass: {
        type: Boolean,
        required: true
    },
    complete: {
        type: Boolean,
        default: false
    },
    stoppedTestingAtStep: {
        type: Number,
    },
    failedSteps: {
        type: Array,
        default: []
    },
}, { timestamps: true });

const stepResponse = new mongoose.Schema({
    sessionID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "testingSession"
    },
    stepID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "step"
    },
    comments: {
        type: String,
        required: true
    },
    pass: {
        type: Boolean,
        // default: false,
        required: true
    }
});

const testScript = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    owner: {
        type: {
            firstName: String,
            lastName: String
        },
        required: true
    },
    description: {
        type: String,
        maxlength: 1000,
        required: true
    },
    primaryWorkstream: {
        type: String,
        required: true
    },
    /*steps: [step]*/
}, { timestamps: true });

testScript.pre('deleteOne', function (next) {
    try {
        const testScriptID = this.getQuery()._id;
        console.log("deleting testing sessions associated with:", testScriptID);
        TestingSession.deleteMany({ testScriptID: testScriptID }).exec();
        console.log("deleting steps associated with:", testScriptID);
        Step.deleteMany({ testScriptID: testScriptID }).exec();
        next();
    } catch (e) {
        console.log(e);
    }
});

testingSession.pre('remove', function (next) { // TODO: test this... doesn't seem to be working
    const testingSessionID = this.getQuery()._id;
    try {
        console.log("deleting step responses associated with:", testingSession);
        StepResponse.deleteMany({ sessionID: testingSessionID}).exec();
        next();
    } catch (e) {
        console.log(e);
    }
});

step.index(
    { testScript: 1, number: 1 }
);

testingSession.index(
    { testscript: 1, _id: 1 }
);

const Step = mongoose.model("step", step);
const TestingSession = mongoose.model("testingSession", testingSession);
const StepResponse = mongoose.model("stepResponse", stepResponse);
const TestScript = mongoose.model("testScript", testScript);

module.exports = { Step, TestingSession, StepResponse, TestScript };
