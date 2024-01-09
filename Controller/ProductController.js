const post = require("../module/post")
const category = require("../module/category")
const wrapAsync = require("../utility/wrapAsync")
const { validateRequestWithBody } = require("twilio/lib/webhooks/webhooks")

//Adding Products
module.exports.AddProduct = wrapAsync(async (req, res, next) => {
    const listing = req.body.listing
    const image = []
    for (let i = 0; i < req.files.length; i++) {
        image.push(req.files[i]["filename"])
    }
    // Saving the images to cloudinary and getting back their url's
    const Post = await new post({
        title: listing.title, description: listing.description, price: listing.price,
        productId: listing.productId, categoryId: listing.categoryId, categoryName: listing.categoryName, image1: image[0], image2: image[1], image3: image[3]
    })
    await Post.save()
    res.redirect("/Admin")
})

//Adding Categorys
module.exports.AddCategory = wrapAsync(async (req, res, next) => {
    const { categoryName, categoryId } = req.body.category
    const image = req.file["filename"]
    const categoryData = await new category({ categoryName: categoryName, categoryId: categoryId, image: image })
    await categoryData.save()
    req.flash("success", "Category Added Successfully")
    res.redirect("/Admin")
})

//Edit Cateogry
module.exports.editCategory = wrapAsync(async (req, res) => {
    const { id } = req.params
    const { categoryId, categoryName } = req.body.category
    console.log(categoryId,categoryName)
    const categoryData = await category.findOneAndUpdate({ categoryId: id }, { categoryName: categoryName, categoryId: categoryId })
    req.flash("success" , "Category is Update")
    res.redirect("/Admin")
})