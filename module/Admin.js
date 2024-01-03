const express = require("express")
const mongoose = require("mongoose")
const Schema = mongoose.Schema
const jwt = require("jsonwebtoken")
const passport = require("passport")

const AdminSchema = new Schema({
    ContactNumber: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
    }
}, { timestamps: true })


AdminSchema.methods.generateJWT = async function () {
    const token = jwt.sign({
        _id: this._id,
        ContactNumber: this.ContactNumber
    }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
    return token;
};

const Admin = new mongoose.model("Admin", AdminSchema)
module.exports = Admin