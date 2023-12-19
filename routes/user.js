const express = require("express")
const router = express.Router()
const User = require("../module/user")
const { user } = require("../Schema")
const passport = require("passport")
const wrapAsync = require("../utility/wrapAsync")
const ExpressError = require("../utility/ExpressError")
const { trusted } = require("mongoose")


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
    try {
        const { username, email, password, ContactNumber } = req.body.user
        const newUser = new User({ username, email, ContactNumber })
        const registorUser = await User.register(newUser, password)
        req.flash("success", "Welcome to CreativeCraftJunction")
        res.redirect('/')
    } catch (err) {
        req.flash('error', err.message)
        res.redirect("/user/signUp")
    }
}))

//login get route
router.get("/login", (req, res) => {
    res.render("user/login")
})

//login through google
router.get('/login/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
    passport.authenticate('google',
        { failureRedirect: '/user/signUp', failureFlash: true, failureMessage: true, successFlash: true }
    ),
    (req, res) => {
        req.flash("success", "You loggedIn SuccessFully")
        console.log(req.flash())
        res.redirect("/")
    }
);





module.exports = router