const express = require("express")
const router = express.Router()
const wrapAsync = require("../utility/wrapAsync")
const ExpressError = require("../utility/ExpressError")
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + ".png")
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
router.post("/Category",
    upload.fields([
        { name: "listing[image1]", maxCount: 1 },
        { name: "listing[image2]", maxCount: 1 },
        { name: "listing[image3]", maxCount: 1 },
    ]),
    wrapAsync(async (req, res) => {
        console.log(req.files["listing[image1]"][0].filename)
        let image1 = req.files['listing[image1]'][0].filename
        let image2 = req.files['listing[image2]'][1].filename
        let image3 = req.files['listing[image3]'][2].filename

        console.log(image1,image2,image3)
        res.redirect('/Admin')
    }))

module.exports = router