const express = require("express")
const mongoose = require("mongoose")
const Schema = mongoose.Schema
const jwt = require("jsonwebtoken")
const passport = require("passport")
const passportlocalmongoose = require("passport-local-mongoose")

const userSchema = new Schema({
    username:{
        type:String,
        required:true
    },
    ContactNumber: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
    }
}, { timestamps: true })

userSchema.plugin(passportlocalmongoose, { usernameField: "email" })


const User = new mongoose.model("user", userSchema)
module.exports = User