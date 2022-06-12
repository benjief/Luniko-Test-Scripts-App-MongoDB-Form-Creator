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
    console.log("deleting steps associated with:", this.getQuery()._id);
    Step.deleteMany({ testScriptID: this.getQuery()._id }).exec();
    next();
});

step.index(
    { testScript: 1, number: 1 }
);

const Step = mongoose.model("step", step);
const TestingSession = mongoose.model("testingSession", testingSession);
const StepResponse = mongoose.model("stepResponse", stepResponse);
const TestScript = mongoose.model("testScript", testScript);

module.exports = { Step, TestScript };
