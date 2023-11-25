const express = require("express")
const router = express.Router()
const wrapAsync = require("../utility/wrapAsync")
const ExpressError = require("../utility/ExpressError")

router.get("/Admin", wrapAsync(async (req, res, next) => {
    res.render("Admin/index.ejs")
}))

module.exports = router