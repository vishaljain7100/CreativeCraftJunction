const express = require("express")
const router = express.Router()
const User = require("../module/user")
const { user } = require("../Schema")
const wrapAsync = require("../utility/wrapAsync")
const bcrypt = require("bcrypt")
const _ = require("lodash")
const axios = require("axios")
const otpGenerator = require("otp-generator")
const OtpSchema = require("../module/otp")
const dotenv = require("dotenv")
const fast2sms = require("fast2sms")

dotenv.config()
const authToken = process.env.Twilio_authToken
const accountSid = process.env.Twilio_accoundSid

//Expired OTP input Function
const ExpiredOTP = async (req, res, next) => {
    const otpHolder = await OtpSchema.find({ number: ContactNumber })
    if (otpHolder.length === 0) {
        req.flash('error', "You use an Expired OTP!")
        res.redirect("/user/signUp")
        next()
    }
}

//sending otp to user
module.exports.signUp = wrapAsync(async (req, res) => {
    const { ContactNumber, email } = req.body.user
    //if user exist then login page redirect
    const userExist = await User.find({ ContactNumber: ContactNumber })
    if (userExist.length !== 0) {
        req.flash('SignUpError', "Account Exist! Please login")
        res.redirect("/user/login")
        next()
    }

    //generating opt and storing in db
    const OTP = otpGenerator.generate(4, {
        digits: true, upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false
    })

    const otp = new OtpSchema({ number: ContactNumber, otp: OTP })
    //hashing otp
    const salt = await bcrypt.genSalt(10)
    otp.otp = await bcrypt.hash(otp.otp, salt)

    const result = await otp.save()
    console.log(OTP)

    const signUp = "signUp"
    res.render("user/otp.ejs", { ContactNumber, email, link: signUp })
})


//verify otp sended by user
module.exports.verfiySignUp = ExpiredOTP, wrapAsync(async (req, res, next) => {
    const { ContactNumber, email } = req.body.user
    const { otp } = req.body
    const NumberOtp = otp.join("")



    const rightOtpFind = otpHolder[otpHolder.length - 1]
    const validUser = await bcrypt.compare(NumberOtp, rightOtpFind.otp)

    //otp verification and saving users after verification
    if (rightOtpFind.number === ContactNumber && validUser) {
        const newUser = await new User({ email, ContactNumber })
        await newUser.save()
        console.log(newUser)
        const token = newUser.generateJWT()
        await token.then((tokenValue) => {
            //storing token in cookie storage
            res.cookie("jwt", `${tokenValue}`, {
                httpOnly: true,
                expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
                maxAge: 7 * 24 * 60 * 60 * 1000
            })
        })
        //deleting otp after user registor
        const OTPDelete = await OtpSchema.deleteMany({ number: rightOtpFind.number })

        res.redirect("/")
    } else {
        await req.flash('error', "Your OTP Was Wrong")
        res.render("user/otp.ejs", { ContactNumber, email })
    }
})

//login otp verification
module.exports.login = wrapAsync(async (req, res, next) => {
    const { Number } = req.body
    const userExistInDb = await User.find({ ContactNumber: Number })
    //checking user is signUp or in db or not
    if (userExistInDb.length === 0) {
        req.flash("LoginError", "User Not Found! SignUp First")
        res.redirect("/user/signUp")
        next()
    }
    const OTP = otpGenerator.generate(4, {
        digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false
    })
    const otp = new OtpSchema({ number: Number, otp: OTP })
    otp.save()
    console.log(OTP)
    const login = "login"
    res.render("user/otp.ejs", { ContactNumber: userExistInDb.ContactNumber, email: userExistInDb.email, link: login })
})

module.exports.LoginVerification = wrapAsync(async (req, res, next) => {
    const { ContactNumber } = req.body.user




})