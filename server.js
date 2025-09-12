const express = require("express");
const passport = require("passport")
const session = require("express-session")
const customerRouter = require("./routes/customerRoutes");
const orderRouter = require("./routes/orderRoutes");
const dashboardRouter = require("./routes/dashboardRoute")
const loginRouter = require("./routes/loginRoute");
const googleAuthRouter = require("./routes/authGoogle");
const dotenv = require("dotenv").config();
const connectDb = require("./config/dbConnection");
const { isLoggedIn } = require("./middleware/isLoggedIn");


connectDb();

app = express();
const port = process.env.PORT || 5002;

app.use(express.json())

app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use("/login", loginRouter)
app.use("/auth/google", googleAuthRouter)
app.use("/api/customers",isLoggedIn, customerRouter);
app.use("/api/orders",isLoggedIn, orderRouter)
app.use("/dashboard",isLoggedIn, dashboardRouter)

app.get("/", (req, res)=>{
    res.send("hii");
})
app.listen(port, ()=>{
    console.log("app running on port ",port)
})



console.log("server running ");

