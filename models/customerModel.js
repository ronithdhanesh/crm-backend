const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a customer name"],
    },
    email: {
        type: String,
        required: [true, "Please add a customer email"],
        unique: true, 
    },
    phone: {
        type: String,
        required: [true, "Please add a customer phone number"],
    },
    totalSpend: {
        type: Number,
        default: 0,
    },
    visits: {
        type: Number,
        default: 0,
    },
    lastPurchaseDate: {
        type: Date,
    },
}, {
    timestamps: true
});

module.exports = mongoose.model("Customer", customerSchema);