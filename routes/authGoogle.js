const express = require("express");
const router = express.Router();
const passport = require("passport");

// The auth configuration is handled in a separate file, so we just need to require it.
require("../config/auth");

// Dynamic frontend redirect URL using an environment variable
// Temporarily set the frontend URL to the backend's URL for testing
const FRONTEND_URL = process.env.FRONTEND_URL || "https://mini-crm-backend-xeno.onrender.com";

// @desc    Initiates the Google OAuth flow
// @route   GET /auth/google
router.get("/", 
    passport.authenticate('google', { 
        scope: ["profile", "https://www.googleapis.com/auth/userinfo.email"] 
    })
);

// @desc    Google OAuth callback URL
// @route   GET /auth/google/callback
router.get("/callback",
    passport.authenticate('google', { failureRedirect: '/auth/google/failure' }),
    (req, res) => {
        // This final handler runs after the session has been established.
        // It redirects the user back to the live URL's dashboard.
        console.log(`Authentication successful, redirecting to live dashboard: ${FRONTEND_URL}/dashboard`);
        res.redirect(`${FRONTEND_URL}/dashboard`);
    }
);

// @desc    Google OAuth authentication failed
// @route   GET /auth/google/failure
router.get("/failure", (req, res) => {
    // It redirects to the live URL's login page in case of a failure.
    console.log(`Authentication failed, redirecting to live login page: ${FRONTEND_URL}/login`);
    res.redirect(`${FRONTEND_URL}/login`);
});

module.exports = router;