const mongoose = require("mongoose");
const Customer = require("../models/customerModel");
const Order = require("../models/orderModel");

require("dotenv").config();

const connectDb = async () => {
    try {
        const connection_string = process.env.MONGO_URL;
        if (!connection_string) {
            throw new Error("MONGO_URL is not defined in the .env file.");
        }
        await mongoose.connect(connection_string);
        console.log("Connected to the database. Starting to seed data...");
    } catch (error) {
        console.error("Database connection error:", error.message);
        process.exit(1);
    }
};

const seedData = async () => {
    await connectDb();

    try {
        await Customer.deleteMany({});
        await Order.deleteMany({});
        console.log("Existing customers and orders cleared.")

        const customers = await Customer.insertMany([
            { name: "John Doe", email: "john.doe@example.com", phone: "555-1234" },
            { name: "Jane Smith", email: "jane.smith@example.com", phone: "555-5678" },
            { name: "Bob Johnson", email: "bob.j@example.com", phone: "555-8765" },
        ]);
        console.log("Sample customers created:", customers.length);

        const orders = await Order.insertMany([
            { customerId: customers[0]._id, orderNumber: "ORD-JD-001", totalAmount: 50.00, items: ["Product A", "Product B"] },
            { customerId: customers[0]._id, orderNumber: "ORD-JD-002", totalAmount: 75.50, items: ["Product C"] },
            { customerId: customers[1]._id, orderNumber: "ORD-JS-001", totalAmount: 120.25, items: ["Product D"] },
            { customerId: customers[2]._id, orderNumber: "ORD-BJ-001", totalAmount: 25.00, items: ["Product E"] },
        ]);
        console.log("Sample orders created:", orders.length);
        for (const order of orders) {
            await Customer.findByIdAndUpdate(
                order.customerId,
                {
                    $inc: { totalSpend: order.totalAmount, visits: 1 },
                    $set: { lastPurchaseDate: order.createdAt }
                }
            );
        }
        console.log("Customer profiles updated with order data.");

    } catch (error) {
        console.error("Error seeding database:", error.message);
    } finally {
        await mongoose.disconnect();
        console.log("Database connection closed.");
    }
};
seedData();