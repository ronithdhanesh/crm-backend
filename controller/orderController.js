const Order = require("../models/orderModel")
const asyncHandler = require("express-async-handler");

//@desc get all order
//@route GET api/orders
const getOrders = asyncHandler(async (req, res)=>{
    const orders = await Order.find();
    res.status(200).json(orders);
})

const getOrder = asyncHandler(async (req, res)=>{
    const order = await Order.findById(req.params.id);
    res.status(200).json(order);
})

const createOrder = asyncHandler(async (req, res) => {
    const {customerId,orderNumber,totalAmount,items} = req.body;
    if(!customerId || !orderNumber || !totalAmount || !items){
        res.status(400);
        throw new Error("all fields are required");
    }
    const order = await Order.create({
        customerId,
        orderNumber,
        totalAmount,
        items
    })
    res.status(201).json(order);
})

const updateOrder = asyncHandler(async (req, res) => {

    const order = await Order.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true}
    );
    if(!order){
        res.status(404);
        throw new Error("order not found")
    }
    res.status(201).json(order);
})

const deleteOrder = asyncHandler(async (req, res) => {
    const order = await Order.findByIdAndDelete(req.params.id);
    if(!order){
        res.status(404);
        throw new Error("order not found")
    }
    res.status(201).json({"message": `order id ${req.params.id} has been deleted`})
})

module.exports = {getOrder,getOrders, updateOrder, deleteOrder, createOrder};