const mongoose = require("mongoose");
const Customer = require("./models/customerModel");
const Order = require("./models/orderModel");

// Load environment variables for the database connection string
require("dotenv").config();

// Connect to MongoDB
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
    // 1. Clear existing data
    await Customer.deleteMany({});
    await Order.deleteMany({});
    console.log("Existing customers and orders cleared.");

    // 2. Create sample customers
    const customers = await Customer.insertMany([
      { name: "John Doe", email: "john.doe@example.com", phone: "555-1234" },
      { name: "Jane Smith", email: "jane.smith@example.com", phone: "555-5678" },
      { name: "Bob Johnson", email: "bob.j@example.com", phone: "555-8765" },
    ]);
    console.log("Sample customers created:", customers.length);

    // 3. Create sample orders for the customers
    await Order.insertMany([
      // Orders for John Doe
      { customerId: customers[0]._id, orderNumber: "ORD-JD-001", totalAmount: 50.00, items: ["Product A", "Product B"] },
      { customerId: customers[0]._id, orderNumber: "ORD-JD-002", totalAmount: 75.50, items: ["Product C"] },
      // Orders for Jane Smith
      { customerId: customers[1]._id, orderNumber: "ORD-JS-001", totalAmount: 120.25, items: ["Product D"] },
      // Orders for Bob Johnson
      { customerId: customers[2]._id, orderNumber: "ORD-BJ-001", totalAmount: 25.00, items: ["Product E"] },
    ]);
    console.log("Sample orders created.");

    // IMPORTANT: Update the customer profiles with the new order data
    // This logic is typically handled in your API, but we do it here for seeding.
    for (const order of await Order.find()) {
        await Customer.findByIdAndUpdate(
            order.customerId,
            {
                $inc: { totalSpend: order.totalAmount, visits: 1 },
                $set: { lastPurchaseDate: order.createdAt }
            },
            { new: true }
        );
    }
    console.log("Customer profiles updated with order data.");

  } catch (error) {
    console.error("Error seeding database:", error.message);
  } finally {
    // Disconnect after all operations are complete
    await mongoose.disconnect();
    console.log("Database connection closed.");
  }
};

// Run the seeding function
seedData();
