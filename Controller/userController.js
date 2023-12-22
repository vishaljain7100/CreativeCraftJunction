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

//sending otp to user
module.exports.signUp = wrapAsync(async (req, res) => {
    const { ContactNumber, username, email } = req.body.user
    //if user exist then login page redirect
    const userExist = await User.find({ ContactNumber: ContactNumber })
    console.log(userExist)
    if (userExist.length !== 0) {
        await req.flash('error', "Account Exist!, Please login")
        res.redirect("/user/login")
    }

    //generating opt and storing in db
    const OTP = otpGenerator.generate(4, {
        digits: true, upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false
    })

    console.log(OTP)

    const otp = new OtpSchema({ number: ContactNumber, otp: OTP })
    //hashing otp
    const salt = await bcrypt.genSalt(10)
    otp.otp = await bcrypt.hash(otp.otp, salt)

    const result = await otp.save()
    res.render("user/otp.ejs", { ContactNumber, username, email })
})


//verify otp sended by user
module.exports.verfiySignUp = wrapAsync(async (req, res) => {
    const { ContactNumber, username, email } = req.body.user
    const { otp } = req.body
    const NumberOtp = otp.join("")

    const otpHolder = await OtpSchema.find({ number: ContactNumber })
    if (otpHolder.length === 0) {
        await req.flash('error', "You use an Expired OTP!")
        res.redirect("/user/signUp")
    }

    const rightOtpFind = otpHolder[otpHolder.length - 1]
    const validUser = await bcrypt.compare(NumberOtp, rightOtpFind.otp)

    //otp verification and saving users after verification
    if (rightOtpFind.number === ContactNumber && validUser) {
        console.log("you enterd the correct otp user founded")

        const newUser = new User({ username, email, ContactNumber })
        // const token = newUser.generateJWT()
        const result = await newUser.save().then(res => console.log(res));
        console.log(req.user)
        const OTPDelete = await OtpSchema.deleteMany({
            number: rightOtpFind.number
        })
        return req.status(200).send({
            message: "user Registration SuccessFull!",
            token: token,
            data: result
        })
    } else {
        await req.flash('error', "Your OTP Was Wrong")
        res.render("user/otp.ejs", { ContactNumber, username, email })
    }
})