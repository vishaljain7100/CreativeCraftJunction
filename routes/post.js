const express = require("express")
const router = express.Router()
const post = require("../module/post")
const wrapAsync = require("../utility/wrapAsync")
const category = require("../module/category")

// Main page
router.get('/', wrapAsync(async (req, res, next) => {
    const posts = await post.find()
    const categorys = await category.find()
    res.render("index.ejs", { posts, categorys })
}))

// Categort Route
router.get("/Category/:id", wrapAsync(async (req, res, next) => {
    let { id } = req.params
    let categorys = await post.find({ categoryId: id })
    let CategoryName = categorys[0].categoryName
    res.render("Category.ejs", { categorys, CategoryName })
}))

//Product route
router.get("/category/:CategoryName/:id", wrapAsync(async (req, res, next) => {
    const { CategoryName, id } = req.params
    const product = await post.find({ productId: id })
    const AllCateProduct = await post.find({ categoryName: CategoryName })
    res.render("Product.ejs", { product, AllCateProduct })
}))

module.exports = router