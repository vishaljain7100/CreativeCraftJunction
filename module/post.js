const { string, number } = require("joi")
const mongoose = require("mongoose")
const Schema = mongoose.Schema

const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image1: {
        type: String,
        required: true
    },
    image2: {
        type: String
    },
    image3: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    productId: {
        type: Number,
        required: true
    },
    categoryId: {
        type: Number,
        required: true
    },
    categoryName: {
        type: String,
        required: true
    },

})

const post = new mongoose.model("post", postSchema)
module.exports = post