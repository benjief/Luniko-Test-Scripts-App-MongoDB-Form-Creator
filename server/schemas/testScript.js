const mongoose = require("mongoose");

const testScript = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "personnel", // TODO: add validation to this (i.e. make sure personnel is designated as a test script owner)
        required: true
    },
    description: {
        type: String,
        maxlength: 1000,
        required: true
    },
    testedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "personnel"
    },
    primaryWorkstream: {
        type: String,
        required: true
    },
    testedAt: {
        type: Date
    },
    pass: {
        type: String,
        required: true,
        default: "N"
    },
    steps:
        [{ type: mongoose.Schema.Types.ObjectId }]

}, { timestamps: true });

module.exports = mongoose.model("testScript", testScript);
