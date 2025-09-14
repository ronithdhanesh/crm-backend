// server.js

// 1. Load environment variables. This MUST be the first line of code.
require("dotenv").config();

// 2. Import all required modules.
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const path = require("path");
const connectDb = require("./config/dbConnection");
const { isLoggedIn } = require("./middleware/isLoggedIn");

// Import all routers
const customerRouter = require("./routes/customerRoutes");
const orderRouter = require("./routes/orderRoutes");
const dashboardRouter = require("./routes/dashboardRoute");
const loginRouter = require("./routes/loginRoute");
const googleAuthRouter = require("./routes/authGoogle");
const campaignRouter = require("./routes/campaignRouter");
const dummyVendorApi = require("./routes/dummyVendorApi");
const aiRouter = require("./routes/aiRoutes");

// 3. Initialize the Express application.
const app = express();
const port = process.env.PORT || 5002;

// 4. Connect to the database.
connectDb();

// 5. Configure all middleware. The order is CRITICAL for the authentication flow.
app.use(express.json()); // For parsing JSON bodies in POST requests.
app.use(session({
    secret: "cats", // Use a secure secret from your .env file
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// 6. Define all your routes. This must be done AFTER middleware is set up.
app.use("/login", loginRouter);
app.use("/auth/google", googleAuthRouter);
app.use("/api/customers", isLoggedIn, customerRouter);
app.use("/api/orders", isLoggedIn, orderRouter);
app.use("/api/campaigns", isLoggedIn, campaignRouter);
app.use("/api/ai", isLoggedIn, aiRouter);
app.use("/dashboard", isLoggedIn, dashboardRouter);
app.use("/api/dummy-vendor", dummyVendorApi);

// Public root route
app.get("/", (req, res) => {
    res.send("hii");
});

// 7. Start the server. This is the last thing you do.
app.listen(port, () => {
    console.log("app running on port ", port);
});
