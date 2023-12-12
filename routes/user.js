const express = require("express")
const router = express.Router()
const User = require("../module/user")
const { userSchema } = require("../Schema")
const passport = require("passport")
const wrapAsync = require("../utility/wrapAsync")
const ExpressError = require("../utility/ExpressError")


//user validation funciton
const userValidaiton = (req, res, next) => {
    const result = userSchema.validate(req.body)
    if (result.error) {
        throw new ExpressError(400, result.error.message)
    } else {
        next()
    }
}

//sign Up route
router.get("/signUp", (req, res) => {
    res.render('user/signup.ejs')
})

router.post("/signUp", userValidaiton, wrapAsync(async (req, res, next) => {
    try {
        const { username, email, password } = req.body
        const newUser = new User({ username, email })
        const registorUser = await User.register(newUser, password)
        res.send(registorUser)
    } catch (err) {
        console.log(err)
        req.flash('error', err)
        res.redirect("/user/signUp")
    }
}))

module.exports = router