const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    // This is the link to the Customer model. It's crucial for the relationship.
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer", // This tells Mongoose that it refers to the "Customer" model
        required: [true, "An order must be linked to a customer"],
    },
    orderNumber: {
        type: String,
        required: [true, "Please add an order number"],
        unique: true,
    },
    totalAmount: {
        type: Number,
        required: [true, "Please add the total amount"],
    },
    items: {
        type: [String], // An array of products in the order
        default: [],
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Order", orderSchema);