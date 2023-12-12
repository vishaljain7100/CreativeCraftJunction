const express = require("express")
const router = express.Router()
const wrapAsync = require("../utility/wrapAsync")
const ExpressError = require("../utility/ExpressError")
const multer = require('multer')
const { listing } = require("../Schema")
const post = require("../module/post")

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

//schema validiton function
const SchemaValidation = (req, res, next) => {
    let result = listing.validate(req.body.listing)
    if (result.error) {
        req.flash('error', result.error.message)
        res.redirect("/Admin/Product")
    } else {
        next()
    }
}

//Admin route
router.get("/", wrapAsync(async (req, res, next) => {
    res.render("Admin/Admin.ejs")
}))

// Add Category (get form route)
router.get("/Product", wrapAsync(async (req, res, next) => {
    res.render('Admin/Addproduct.ejs')
}))


// Add Category (Post route)
router.post("/Product",
    SchemaValidation,
    upload.fields([
        { name: "listing[image1]", maxCount: 1 },
        { name: "listing[image2]", maxCount: 1 },
        { name: "listing[image3]", maxCount: 1 },
    ]),
    wrapAsync(async (req, res, next) => {
        const files = req.files
        console.log(files)

        // console.log(images)
        const postDetails = req.body.listing
        const newPost = await new post(postDetails)
        // newPost.save()
        //     .then(res => console.log(res))
        //     .catch(err => console.log(err))
        // // res.redirect('/Admin')
    }))

module.exports = router