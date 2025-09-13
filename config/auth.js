const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const dotenv = require("dotenv").config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// Passport.js configuration with the correct strategy
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  (accessToken, refreshToken, profile, done) => {
    // This function runs on a successful login.
    // It's retrieving the correct profile data and is ready for database integration.
    console.log("User logged in:", profile.displayName);
    return done(null, profile);
  }
));

// Session serialization: We only need to store the unique user ID
// This keeps the session lightweight and efficient.
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Session deserialization: Use the stored ID to retrieve the user
passport.deserializeUser((id, done) => {
    // For a real app, you would fetch the user from your database using this ID
    // For now, we'll just mock a user object.
    const user = { id: id, displayName: "Authenticated User" };
    done(null, user);
});