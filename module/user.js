const express = require("express")
const mongoose = require("mongoose")
const Schema = mongoose.Schema
const passportLocalMongoose = require("passport-local-mongoose")
const jwt = require("jsonwebtoken")

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    ContactNumber: {
        type: Number,
        required: true
    }
}, { timestamps: true })


userSchema.method.generateJWT = function () {
    const token = jwt.sign({
        _id: this._id,
        ContactNumber: this.ContactNumber
    }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" })
}

userSchema.plugin(passportLocalMongoose)

const User = new mongoose.model("user", userSchema)
module.exports = User