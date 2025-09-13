const asyncHandler = require("express-async-handler");
const Customer = require("../models/customerModel");
const Order = require("../models/orderModel");

// @desc    Get all orders
// @route   GET /api/orders
const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find();
    res.status(200).json(orders);
});

// @desc    Get a single order
// @route   GET /api/orders/:id
const getOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        res.status(404);
        throw new Error("Order not found");
    }
    res.status(200).json(order);
});

// @desc    Create a new order and update the related customer
// @route   POST /api/orders
const createOrder = asyncHandler(async (req, res) => {
    const { customerId, orderNumber, totalAmount, items } = req.body;

    if (!customerId || !orderNumber || !totalAmount) {
        res.status(400);
        throw new Error("All fields are mandatory for an order");
    }

    // Step 1: Create and save the new order
    const newOrder = await Order.create({ customerId, orderNumber, totalAmount, items });

    // Step 2: Update the related customer's profile
    // Use $inc to increment and $set to update the date.
    await Customer.findByIdAndUpdate(
        customerId,
        {
            $inc: { totalSpend: totalAmount, visits: 1 },
            $set: { lastPurchaseDate: new Date() }
        },
        { new: true } // Returns the updated document
    );

    res.status(201).json(newOrder);
});

// @desc    Update an order
// @route   PUT /api/orders/:id
const updateOrder = asyncHandler(async (req, res) => {
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    if (!order) {
        res.status(404);
        throw new Error("Order not found");
    }
    res.status(200).json(order);
});

// @desc    Delete an order
// @route   DELETE /api/orders/:id
const deleteOrder = asyncHandler(async (req, res) => {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
        res.status(404);
        throw new Error("Order not found");
    }
    res.status(200).json({ message: `Order ${req.params.id} removed` });
});

module.exports = { getOrders, getOrder, createOrder, updateOrder, deleteOrder };
