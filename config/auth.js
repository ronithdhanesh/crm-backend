const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const dotenv = require("dotenv").config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// Dynamic callback URL based on the environment
const callbackURL = process.env.NODE_ENV === 'production' 
    ? "https://mini-crm-backend-xeno.onrender.com/auth/google/callback"
    : "http://localhost:5002/auth/google/callback";

// Passport.js configuration with the correct strategy
passport.use(new GoogleStrategy({
    callbackURL: callbackURL,
    clientSecret: GOOGLE_CLIENT_SECRET,
    clientID: GOOGLE_CLIENT_ID,
},
(accessToken, refreshToken, profile, done) => {
    console.log("User logged in:", profile.displayName);
    return done(null, profile);
}));

// Session serialization: We only need to store the unique user ID.
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Session deserialization: Use the stored ID to retrieve the user's data.
passport.deserializeUser((id, done) => {
    const user = { id: id, displayName: "Authenticated User" };
    done(null, user);
});
