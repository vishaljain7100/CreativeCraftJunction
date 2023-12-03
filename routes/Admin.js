const express = require("express")
const router = express.Router()
const wrapAsync = require("../utility/wrapAsync")
const ExpressError = require("../utility/ExpressError")
const multer = require('multer')

// multer middleware to storge the db in upload folder
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

// schema validation


router.get("/", wrapAsync(async (req, res, next) => {
    res.render("Admin/Admin.ejs")
}))

// Add Category (get form route)
router.get("/Product", wrapAsync(async (req, res, next) => {
    res.render('Admin/Addproduct.ejs')
}))


// Add Category (Post route)
router.post("/Product",
    upload.fields([
        { name: "listing[image1]", maxCount: 1 },
        { name: "listing[image2]", maxCount: 1 },
        { name: "listing[image3]", maxCount: 1 },
    ]),
    wrapAsync(async (req, res) => {
        const images = []
        for (const key in req.files) {
            if (req.files[key].length > 0) {
                images.push(req.files[key][0].filename)
            }
        }


        
        // res.redirect('/Admin')
    }))

module.exports = router