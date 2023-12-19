var GoogleStrategy = require('passport-google-oauth20').Strategy;
const dotenv = require("dotenv")
dotenv.config()

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "http://www.example.com/auth/google/callback"
},
  function (request, accessToken, refreshToken, profile, done) {
    console.log(profile)
    return done(null,profile)
  }
));