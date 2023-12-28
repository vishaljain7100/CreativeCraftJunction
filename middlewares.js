const User = require("./module/user")
const jwt = require("jsonwebtoken")

// console.log(jwt)
const wrapAsync = require("./utility/wrapAsync")
const ExpressError = require("./utility/ExpressError")

module.exports.tokenAuth = wrapAsync(async (req, res, next) => {
    try {
        const token = req.cookies.jwt
        const verifyUser = jwt.verify(token, process.env.JWT_SECRET_KEY)
        next()
    }
    catch (err) {
        req.flash("error", "You should Login First")
        res.redirect("/user/login")
    }
})
