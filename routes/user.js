const express = require("express")
const router = express.Router()
const User = require("../module/user")
const { user } = require("../Schema")
const passport = require("passport")
const wrapAsync = require("../utility/wrapAsync")
const { signUp, verfiySignUp } = require('../Controller/userController')

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
router.post("/signUp", userValidaiton, signUp)
//otp verification and saving users after verification
router.post("/signUp/Verfication", verfiySignUp)

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