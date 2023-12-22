const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dotenv = require("dotenv");
dotenv.config();
const User = require("./module/user");
const express = require("express")
const router = express.Router()

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:5500/user/auth/google/callback",
  passReqToCallback: true
},
  async function (request, accessToken, refreshToken, profile, done) {
    try {
      // Find or create user based on Google profile information
      const existingUser = await User.findOne({ email: profile.emails[0].value })

      if (existingUser) {
        // User already exists, return the existing user
        return done(null, existingUser);
      }
      else {
      }
    } catch (err) {
      return done(err);
    }
  }
));

// Serialize user to store in the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the stored session data
passport.deserializeUser((id, done) => {
  // Retrieve user from the database using the id
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
