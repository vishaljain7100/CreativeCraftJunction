// const jwt = require("jsonwebtoken")
// const wrapAsync = require("./utility/wrapAsync")

// //Authenticaiton of token(user)
// module.exports.tokenAuth = wrapAsync(async (req, res, next) => {
//     try {
//         const token = req.cookies.jwt
//         const verifyUser = jwt.verify(token, process.env.JWT_SECRET_KEY)
//         next()
//     }
//     catch (err) {
//         req.flash("error", "You should Login First")
//         res.redirect("/user/login")
//     }
// })

// //Logout function for user
// module.exports.LogOutFun = wrapAsync(async (req, res, next) => {
//     const token = req.cookies.jwt
//     const verifyUser = jwt.verify(token, process.env.JWT_SECRET_KEY)
//     if (verifyUser) {
//         res.clearCookie("jwt")
//         req.flash("success", "You logOut SuccessFully")
//         next()
//     }
// })

// //Checking User is login or signUp or not (User Exist or not in db)
// module.exports.UserExist = (req, res, next) => {
//     const token = req.cookies.jwt
//     if (token != undefined) {
//         const verifyUser = jwt.verify(token, process.env.JWT_SECRET_KEY)
//         res.locals.user = verifyUser
//         next()
//     }
//     else {
//         res.locals.user = null
//         next()
//     }
// }

// //Checking Admin Exist or not in DB
// module.exports.AdminExist = (req, res, next) => {
//     const token = req.cookies.jwtAdmin
//     if (token != undefined) {
//         const verifyUser = jwt.verify(token, process.env.JWT_SECRET_KEY)
//         res.locals.user = verifyUser
//         next()
//     }
//     else {
//         req.flash("error", "You are not Admin!")
//         res.redirect("/")
//     }
// }

// //Admin Logout
// module.exports.LogOutAdmin = wrapAsync(async (req, res, next) => {
//     const token = req.cookies.jwtAdmin
//     const verifyUser = jwt.verify(token, process.env.JWT_SECRET_KEY)
//     if (verifyUser) {
//         res.clearCookie("jwtAdmin")
//         req.flash("success", "You logOut SuccessFully")
//         next()
//     }
// })