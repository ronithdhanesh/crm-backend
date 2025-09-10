const asyncHandler = require("express-async-handler");
const Customer = require("../models/customerModel");

// @desc    Get all customers
// @route   GET /api/customers
//@access public
const getCustomers = asyncHandler(async (req, res) => {
    const customers = await Customer.find();
    res.status(200).json(customers);
});

// @desc    Get a single customer by ID
// @route   GET /api/customers/:id
const getCustomer = asyncHandler(async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
        res.status(404);
        throw new Error("Customer not found");
    }
    res.status(200).json(customer);
});

// @desc    Create a new customer
// @route   POST /api/customers
const createCustomer = asyncHandler(async (req, res) => {
    const { name, email, phone } = req.body;
    
    if (!name || !email || !phone) {
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    const customer = await Customer.create({
        name,
        email, 
        phone
    });
    
    res.status(201).json(customer);
});

// @desc    Update a customer
// @route   PUT /api/customers/:id
const updateCustomer = asyncHandler(async (req, res) => {
    const customer = await Customer.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true } 
    );
    
    if (!customer) {
        res.status(404);
        throw new Error("Customer not found");
    }
    res.status(200).json(customer);
});

// @desc    Delete a customer
// @route   DELETE /api/customers/:id
const deleteCustomer = asyncHandler(async (req, res) => {
    // Correctly await the findByIdAndDelete operation
    const customer = await Customer.findByIdAndDelete(req.params.id);

    if (!customer) {
        res.status(404);
        throw new Error("Customer not found");
    }
    res.status(200).json({
        "message": `Customer ${req.params.id} deleted successfully`
    });
});


module.exports = { getCustomers, getCustomer, createCustomer, updateCustomer, deleteCustomer };
