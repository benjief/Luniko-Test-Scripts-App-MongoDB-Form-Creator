const mongoose = require("mongoose");

const step = new mongoose.Schema({
    testScriptID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "testScript",
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
    pass: {
        type: Boolean,
        default: false,
        required: true
    },
    comments: {
        type: String
    }
});

step.index({ testScriptID: 1, number: 1 }, { unique: true });

exports = mongoose.model("step", step);