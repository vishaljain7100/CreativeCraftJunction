const express = require("express")
const router = express.Router()
const wrapAsync = require("../utility/wrapAsync")
const ExpressError = require("../utility/ExpressError")
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cd) {
        cd("null", "./uploads")
    },
    filename: function (req, file, cd) {
        const suppfix = Date.now() + Math.floor(Math.round() * 10000)
        cd("null", file.filename + suppfix)

    }
})

const upload = multer({ storage: storage })


router.get("/", wrapAsync(async (req, res, next) => {
    res.render("Admin/Admin.ejs")
}))

// Add Category (get form route)
router.get("/Category", wrapAsync(async (req, res, next) => {
    res.render('Admin/AddCategory.ejs')
}))

// Add Category (Post route)
router.post("/Category", upload.single("image"), wrapAsync(async (req, res, next) => {
    res.render('Admin/AddCategory.ejs')
    console.log(req.body)
    console.log(req.file)
}))




module.exports = router