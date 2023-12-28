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

dotenv.config()
const authToken = process.env.Twilio_authToken
const accountSid = process.env.Twilio_accoundSid



//sending otp to user
module.exports.signUp = wrapAsync(async (req, res) => {
    const { ContactNumber, email } = req.body.user
    //if user exist then login page redirect
    const userExist = await User.find({ ContactNumber: ContactNumber })
    if (userExist.length !== 0) {
        await req.flash('error', "Account Exist!, Please login")
        res.redirect("/user/login")
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
    const client = require('twilio')(accountSid, authToken)
    client.messages
        .create({
            body: `Your OTP is : ${OTP}`,
            from: '+18635765040',
            to: `+91${ContactNumber}`
        })
        .then(message => console.log(message.sid))
        .done();
    res.render("user/otp.ejs", { ContactNumber, email })
})


//verify otp sended by user
module.exports.verfiySignUp = wrapAsync(async (req, res, next) => {
    const { ContactNumber, email } = req.body.user
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
        const newUser = await new User({ email, ContactNumber })
        await newUser.save()
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

        res.redirect("/user/admin")
    } else {
        await req.flash('error', "Your OTP Was Wrong")
        res.render("user/otp.ejs", { ContactNumber, email })
    }
})