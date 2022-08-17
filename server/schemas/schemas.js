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
        // required: true
    },
    dataInputtedByUser: {
        type: String,
        maxlength: 1000,
        default: ""
    }
});

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

testScript.pre('deleteOne', function (next) {
    console.log("deleting steps associated with:", this.getQuery()._id);
    Step.deleteMany({ testScriptID: this.getQuery()._id }).exec();
    // TestingSession.deleteMany({testScriptID: this.getQuery()._id}).exec();
    next();
});

testingSession.pre('deleteOne', function (next) {
    StepResponse.deleteMany({ sessionID: this.getQuery()._id }).exec();
    next();
})


step.index(
    { testScript: 1, number: 1 }
);

const Step = mongoose.model("step", step);
const TestingSession = mongoose.model("testingSession", testingSession);
const StepResponse = mongoose.model("stepResponse", stepResponse);
const TestScript = mongoose.model("testScript", testScript);

module.exports = { Step, TestingSession, StepResponse, TestScript };
