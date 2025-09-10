const { timeStamp } = require("console");
const mongoose = require("mongoose");

const customerSchema = mongoose.Schema({
    name: {
        type: String,
        required:[true, "please add contact name"]
    },

    email: {
        type: String,
        required:[true, "please add your email"]
    },

    phone: {
        type: String,
        required: [true, "please add your phone number "]
    }
}, {
    timeStamps: true
});

module.exports = mongoose.model("Customer", customerSchema)