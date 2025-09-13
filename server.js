const express = require("express");
const passport = require("passport");
const session = require("express-session");
const dotenv = require("dotenv").config();
const connectDb = require("./config/dbConnection");
const { isLoggedIn } = require("./middleware/isLoggedIn");

// Import all routers, including the dummy vendor API
const customerRouter = require("./routes/customerRoutes");
const orderRouter = require("./routes/orderRoutes");
const dashboardRouter = require("./routes/dashboardRoute");
const loginRouter = require("./routes/loginRoute");
const googleAuthRouter = require("./routes/authGoogle");
const campaignRouter = require("./routes/campaignRouter");
const dummyVendorApi = require("./routes/dummyVendorApi"); // New: Import the dummy vendor API

// Passport configuration is now in a separate file
require("./config/auth");

const app = express();
const port = process.env.PORT || 5002;

connectDb();

// Middlewares
app.use(express.json());
app.use(session({
    secret: "cats  ",
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Public Routes
app.use("/login", loginRouter);
app.use("/auth/google", googleAuthRouter);

// Protected API Routes
app.use("/api/customers", isLoggedIn, customerRouter);
app.use("/api/orders", isLoggedIn, orderRouter);
app.use("/api/campaigns", isLoggedIn, campaignRouter);
app.use("/dashboard", isLoggedIn, dashboardRouter);

// New: Add the dummy vendor API endpoint here
// Note: This is an un-protected route as it's a backend-to-backend call.
app.use("/api/dummy-vendor", dummyVendorApi);

// Root route
app.get("/", (req, res) => {
    res.send("hii");
});

// Start the server
app.listen(port, () => {
    console.log("app running on port ", port);
});

console.log("server running ");