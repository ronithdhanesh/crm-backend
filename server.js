const express = require("express");
const passport = require("passport");
const session = require("express-session");
const dotenv = require("dotenv").config();
const connectDb = require("./config/dbConnection");
const { isLoggedIn } = require("./middleware/isLoggedIn");
const path = require('path');
const cors = require('cors'); 


const customerRouter = require("./routes/customerRoutes");
const orderRouter = require("./routes/orderRoutes");
const dashboardRouter = require("./routes/dashboardRoute");
const loginRouter = require("./routes/loginRoute");
const googleAuthRouter = require("./routes/authGoogle");
const campaignRouter = require("./routes/campaignRouter");
const dummyVendorApi = require("./routes/dummyVendorApi");
const aiRouter = require("./routes/aiRoutes");

require("./config/auth");

const app = express();
const port = process.env.PORT || 5002;

connectDb();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET || "cats",
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, 
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 
    }
}));
app.use(passport.initialize());
app.use(passport.session());

app.use("/login", loginRouter);
app.use("/auth/google", googleAuthRouter);
app.use("/api/customers", isLoggedIn, customerRouter);
app.use("/api/orders", isLoggedIn, orderRouter);
app.use("/api/campaigns", isLoggedIn, campaignRouter);
app.use("/api/ai", isLoggedIn, aiRouter);
app.use("/dashboard", isLoggedIn, dashboardRouter);
app.use("/api/dummy-vendor", dummyVendorApi);

app.get("/", (req, res) => {
    res.send("hii");
});

app.get("/health", (req, res) => {
    res.json({ 
        status: "OK", 
        message: "Backend server is running",
        timestamp: new Date().toISOString()
    });
});

app.get("/api/auth/check", (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ 
            authenticated: true, 
            user: req.user || { name: 'Authenticated User' }
        });
    } else {
        res.status(401).json({ 
            authenticated: false,
            message: 'Not authenticated'
        });
    }
});

app.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.redirect("/login");
    });
});

app.listen(port, () => {
    console.log("app running on port ", port);
});
