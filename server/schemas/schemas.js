const mongoose = require("mongoose");

// step schema
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
        // required: true
    },
    dataInputtedByUser: {
        type: String,
        maxlength: 1000,
        default: ""
    }
});

// testing session schema
const testingSession = new mongoose.Schema({
    testScriptID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "testScript"
    },
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
        default: false,
        required: true
    },
    stoppedTestingAtStep: {
        type: Number,
    },
    failedSteps: {
        type: Array,
        default: []
    },
    stepsWithMinorIssues: {
        type: Array,
        default: []
    }
}, { timestamps: true });

// step response schema
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
    },
    pass: {
        type: String,
        enum: ["P", "I", "F"],
        required: true
    },
    uploadedImage: {
        type: {
            imageName: String,
            imageURL: String
        }
    }
});

// test script schema
const testScript = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    name_lowercase: {
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
}, { timestamps: true });


// ensures that any steps associated with a test script being deleted from the database are also removed
testScript.pre('deleteOne', function (next) {
    console.log("deleting steps associated with:", this.getQuery()._id);
    Step.deleteMany({ testScriptID: this.getQuery()._id }).exec();
    // TestingSession.deleteMany({testScriptID: this.getQuery()._id}).exec();
    next();
});


// ensures that any step responses associated with a testing session being deleted from the database are also removed
testingSession.pre('deleteOne', function (next) {
    StepResponse.deleteMany({ sessionID: this.getQuery()._id }).exec();
    next();
})

// step numbers should be unique when scoped to a testScriptID (e.g. there shouldn't be miultiple step 1's for any particular test script)
step.index(
    { testScriptID: 1, number: 1 },
    { unique: true }
);

const Step = mongoose.model("step", step);
const TestingSession = mongoose.model("testingSession", testingSession);
const StepResponse = mongoose.model("stepResponse", stepResponse);
const TestScript = mongoose.model("testScript", testScript);

module.exports = { Step, TestingSession, StepResponse, TestScript };
