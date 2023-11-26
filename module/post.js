const mongoose = require("mongoose")
const Schema = mongoose.Schema

const postSchema = new Schema({
    categoryId: Number,
    productId: String,
    price: Number,
    image: String,
    categoryName: {
        type: String,
        required: true
    }
})

const post = new mongoose.model("post", postSchema)
module.exports = post