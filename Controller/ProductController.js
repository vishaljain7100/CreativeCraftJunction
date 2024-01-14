const post = require("../module/post")
const category = require("../module/category")
const wrapAsync = require("../utility/wrapAsync")

//Adding Categorys
module.exports.AddCategory = wrapAsync(async (req, res, next) => {
    const { categoryName, categoryId } = req.body.category
    const image = req.file["filename"]
    const categoryData = await new category({ categoryName: categoryName, categoryId: categoryId, image: image })
    await categoryData.save()
    req.flash("success", "Category Added Successfully")
    res.redirect("/Admin/ViewCategory")
})

//Edit Cateogry
module.exports.editCategory = wrapAsync(async (req, res) => {
    const { id } = req.params
    const { categoryId, categoryName } = req.body.category
    const categoryData = await category.findOneAndUpdate({ categoryId: id }, { categoryName: categoryName, categoryId: categoryId })
    req.flash("success", "Category is Update")
    res.redirect("/Admin/ViewCategory")
})

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
        productId: listing.productId, categoryId: listing.categoryId, categoryName: listing.categoryName, image1: image[0], image2: image[1], image3: image[2]
    })
    await Post.save()
    req.flash("success", "Product Added Successfully")
    res.redirect("/Admin/ViewProduct")
})


// Edit product
module.exports.editProduct = wrapAsync(async (req, res) => {
    const listing = req.body.listing;
    const { id } = req.params;
    const image = [];
    // Loop through each image and checkbox
    for (let i = 1; i <= 3; i++) {
        //checking checkbox is true or false
        const changeImage = req.body[`changeImage${i}`] === 'on';
        //getting new photo
        const uploadedFiles = req.files[`listing[newImage${i}]`];

        if (changeImage && uploadedFiles && uploadedFiles.length > 0) {
            image.push(uploadedFiles[0].filename);
        } else {
            image.push(listing[`image${i}`]);
        }
    }

    // Update the post with the new data
    const updatedPost = await post.findOneAndUpdate({ productId: id }, {
        title: listing.title,
        description: listing.description,
        price: listing.price,
        productId: listing.productId,
        categoryId: listing.categoryId,
        categoryName: listing.categoryName,
        image1: image[0],
        image2: image[1],
        image3: image[2]
    });
    req.flash("success", "Post Updated Successfully");
    return res.redirect(`/Admin/ViewProduct`);
});