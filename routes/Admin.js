const express = require("express")
const router = express.Router()
const wrapAsync = require("../utility/wrapAsync")
const ExpressError = require("../utility/ExpressError")
const multer = require('multer')
const { listing } = require("../Schema")
const { categorySchema } = require("../Schema")
const post = require("../module/post")
const category = require("../module/category")
const Admin = require("../module/Admin")
const { AdminLoginVerficaiton, AdminLogin } = require("../Controller/AdminController")
const { AdminExist, LogOutAdmin } = require("../middlewares")
const fs = require("fs")
const { AddProduct, AddCategory, editCategory, editProduct } = require("../Controller/ProductController")

// multer middleware to storge the db in upload folder
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = "./uploads"
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir)
        }
        cb(null, dir)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now()
        cb(null, file.fieldname + '-' + uniqueSuffix + ".png")
    }
})

const upload = multer({
    storage: storage
})

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

//schema validiton function
const CategorySchemaValidation = (req, res, next) => {
    let result = categorySchema.validate(req.body.category)
    if (result.error) {
        req.flash('error', result.error.message)
        res.redirect("/Admin/Category")
    } else {
        next()
    }
}

//Admin route
router.get("/", AdminExist, wrapAsync(async (req, res, next) => {
    res.render("Admin/Admin.ejs")
}))

// Add Category (get form route)
router.get("/Category", AdminExist, (req, res, next) => {
    res.render("Admin/AddCategory")
})

// Add Category (Post route)
router.post("/Category",
    AdminExist,
    upload.single("image"),
    CategorySchemaValidation,
    AddCategory
)

//category view route
router.get('/ViewCategory',AdminExist, async (req, res) => {
    const AllCategorys = await category.find({})
    res.render("Admin/showCategory.ejs", { AllCategorys })
})

//Cateogory Edit
router.get('/Category/Edit/:id',AdminExist, async (req, res) => {
    const { id } = req.params
    const Categorys = await category.find({ categoryId: id })
    res.render("Admin/EditCategory.ejs", { Categorys })
})

//Category Edit post
router.post("/Category/Edit/:id",AdminExist, CategorySchemaValidation, editCategory)

//Delete Category 
router.get("/Category/Delete/:id",AdminExist, wrapAsync(async (req, res) => {
    const { id } = req.params
    await category.findOneAndDelete({ categoryId: id })
    req.flash("success", "Category Deleted Successfully")
    res.redirect('/Admin/ViewCategory')
}))

// Add Product (get form route)
router.get("/Product", AdminExist, wrapAsync(async (req, res, next) => {
    res.render('Admin/Addproduct.ejs')
}))

// Add Product (Post route)
router.post("/Product",
    AdminExist,
    upload.array("listing[image]", 3),
    SchemaValidation,
    AddProduct
)

//Product view route
router.get('/ViewProduct',AdminExist, async (req, res) => {
    const AllProducts = await post.find({})
    res.render("Admin/showProduct.ejs", { AllProducts })
})

// Product Edit
router.get('/Product/Edit/:id',AdminExist, async (req, res) => {
    const { id } = req.params
    const Products = await post.find({ productId: id })
    res.render("Admin/EditProduct.ejs", { Products })
})

router.post("/Product/Edit/:id",
AdminExist,
    upload.fields([
        { name: "listing[newImage1]", maxCount: 1 },
        { name: "listing[newImage2]", maxCount: 1 },
        { name: "listing[newImage3]", maxCount: 1 }
    ]),
    editProduct
);

//Delete Product 
router.get("/Product/Delete/:id",AdminExist, wrapAsync(async (req, res) => {
    const { id } = req.params
    await post.findOneAndDelete({ productId: id })
    req.flash("success", "Product Deleted Successfully")
    res.redirect('/Admin/ViewProduct')
}))

//generating OTP for Admin
router.get("/login", AdminLogin)

//Verifing Admin OTP
router.post("/Login/Verificaiton", AdminLoginVerficaiton)

//Admin Logout route
router.get("/logout", AdminExist, LogOutAdmin, wrapAsync(async (req, res) => {
    res.redirect("/")
}))

router.all("*", wrapAsync(async (req, res, next) => {
    throw new ExpressError(404, "Page not found!")
}))

router.use((err, req, res, next) => {
    let { status = 500 } = err
    req.flash("error", status, err.message)
    res.redirect("/Admin")
})

module.exports = router