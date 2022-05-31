const mongoose = require("mongoose");

const step = new mongoose.Schema({
    testScriptID: {
        type: String,
        required: true
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

const testScript = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    owner: {
        firstName: String,
        lastName: String
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
const TestScript = mongoose.model("testScript", testScript);

module.exports = { Step, TestScript };