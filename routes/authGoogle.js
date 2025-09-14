const express = require("express");
const router = express.Router();
const passport = require("passport");

// The auth configuration is handled in a separate file, so we just need to require it.
require("../config/auth");

// @desc    Initiates the Google OAuth flow
// @route   GET /auth/google
// This middleware redirects the user to Google's login page.
router.get("/", 
    passport.authenticate('google', { 
        scope: ["profile", "https://www.googleapis.com/auth/userinfo.email"] 
    })
);

// @desc    Google OAuth callback URL
// @route   GET /auth/google/callback
// This is the endpoint Google redirects to after a successful login.
router.get("/callback",
    passport.authenticate('google', { failureRedirect: '/auth/google/failure' }),
    (req, res) => {
        // This final handler runs after the session has been established.
        console.log("Authentication successful, redirecting to frontend...");
        res.redirect("http://localhost:5173");
    }
);

// @desc    Google OAuth authentication failed
// @route   GET /auth/google/failure
router.get("/failure", (req, res) => {
    console.log("Authentication failed, redirecting to frontend...");
    res.redirect("http://localhost:5173?error=auth_failed");
});

module.exports = router;