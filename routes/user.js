const express = require("express")
const router = express.Router()
const User = require("../module/user")
const { user } = require("../Schema")
const passport = require("passport")
const wrapAsync = require("../utility/wrapAsync")
const bcrypt = require("bcrypt")
const _ = require("lodash")
const axios = require("axios")
const otpGenerator = require("otp-generator")
const OtpSchema = require("../module/otp")

//user validation funciton
const userValidaiton = (req, res, next) => {
    const result = user.validate(req.body.user)
    if (result.error) {
        console.log(result.error)
        req.flash("error", result.error.message)
        res.redirect('/user/signUp')
    } else {
        next()
    }
}

//sign Up route
router.get("/signUp", (req, res) => {
    res.render('user/signup.ejs')
})

//sign Up post route
router.post("/signUp", userValidaiton, wrapAsync(async (req, res, next) => {
    // const UserInDb = await User.find({ ContactNumber: req.body.user.ContactNumber })
    // if (UserInDb) {
    //     res.status(400).render("Error.ejs", { err: "user already exist" })
    // }

    //generating opt and storing in db
    const OTP = otpGenerator.generate(4, {
        digits: true, upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false
    })
    const { ContactNumber } = req.body.user

    const otp = new OtpSchema({ number: ContactNumber, otp: OTP })
    //hashing otp
    const salt = await bcrypt.genSalt(10)
    otp.otp = await bcrypt.hash(otp.otp, salt)

    const result = await otp.save()
    res.status(200).send("otp send successfully!")


    // try {
    //     const { username, email, password, ContactNumber } = req.body.user
    //     const newUser = new User({ username, email, ContactNumber })
    //     const registorUser = await User.register(newUser, password)
    //     req.flash("success", "Welcome to CreativeCraftJunction")
    //     res.redirect('/')
    // } catch (err) {
    //     req.flash('error', err.message)
    //     res.redirect("/user/signUp")
    // }
}))

//login get route
router.get("/login", (req, res) => {
    res.render("user/login")
})

//login post route
router.post("/login", wrapAsync(async (req, res, next) => {
    const { ContactNumber } = req.body
    const UserInDb = await User.find({ ContactNumber: ContactNumber })
    if (user) return res.status(400).send()

}))

//login through google
router.get('/login/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
    passport.authenticate('google',
        { failureRedirect: '/user/signUp' }
    ),
    (req, res) => {
        req.flash("success", "You loggedIn SuccessFully")
        console.log(req.flash())
        res.redirect("/")
    }
);





module.exports = router