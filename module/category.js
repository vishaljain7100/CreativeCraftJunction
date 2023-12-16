const express = require("express")
const mongoose = require("mongoose")
const Schema = mongoose.Schema

const categorySchema = new Schema({
    categoryName: {
        type: String,
        required: true
    },
    categoryId: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        // required: true,
        default: "https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/81fXTjBQhuL.jpg"
    }
})

const category = new mongoose.model("category", categorySchema)
module.exports = category