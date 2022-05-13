const mongoose = require("mongoose");

const personnel = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    // email: {
    //     type: String,
    //     required: true,
    //     lowercase: true,
    //     unique: true,
    //     match: [/[^@]+@[^@]+\.+[^@]/]
    // }
});

// personnel.index({ firstName: 1, lastName: 1 }, { unique: true });

module.exports = mongoose.model("personnel", personnel);
