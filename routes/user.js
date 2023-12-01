const express = require("express")
const router = express.Router()


router.get("/signUp", (req,res) => {
    res.render('signUp/signup.ejs')
})

module.exports = router