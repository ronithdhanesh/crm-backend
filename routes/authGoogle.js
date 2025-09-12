const express = require("express")
const router = express.Router()
const passport = require("passport")
const session = require('express-session');

require("../config/auth")


// @desc    Initiates the Google OAuth flow
// @route   GET /auth/google
// Passport.authenticate is the middleware that redirects to Google's login page
router.get("/", 
    passport.authenticate('google', { 
        scope: ["profile", "https://www.googleapis.com/auth/userinfo.email"] 
    })
);

// @desc    Google OAuth callback URL
// @route   GET /auth/google/callback
// This is the endpoint Google redirects to after login
router.get("/callback",
    passport.authenticate('google', { failureRedirect: '/auth/google/failure' }),
    (req, res) => {
        console.log("Authentication successful, redirecting to dashboard...");
        res.redirect("/dashboard");
    }
);

// @desc    Google OAuth authentication failed
// @route   GET /auth/google/failure
router.get("/failure", (req, res) => {
    res.send("Authentication failed");
});

module.exports = router;
