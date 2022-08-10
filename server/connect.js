const mongoose = require("mongoose");
const uri = process.env.MONGODB_URI;
// const uri = "mongodb+srv://benjief:SiCsFm%4013@luniko-test-scripts-app.m3xp4ta.mongodb.net/test"; // for dev purposes

const connect = () => {
    return mongoose.connect(uri, {
        autoIndex: true
    });
}

module.exports = connect;