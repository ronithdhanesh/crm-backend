const express = require("express");
const customerRouter = require("./routes/customerRoutes");
const orderRouter = require("./routes/orderRoutes");
const dotenv = require("dotenv").config();
const connectDb = require("./config/dbConnection");

connectDb();

app = express();
const port = process.env.PORT || 5002;

app.use(express.json())
app.use("/api/customers", customerRouter);
app.use("/api/orders", orderRouter)

app.get("/", (req, res)=>{
    res.send("hii");
})
app.listen(port, ()=>{
    console.log("app running on port ",port)
})



console.log("server running ");

