const express = require("express")
const wrapAsync = require("../utility/wrapAsync")
const bcrypt = require("bcrypt")
const _ = require("lodash")
const axios = require("axios")
const otpGenerator = require("otp-generator")
const OtpSchema = require("../module/otp")
const dotenv = require("dotenv")
const fast2sms = require("fast2sms")
const Admin = require("../module/Admin")

//verification for otp
module.exports.AdminLogin = wrapAsync(async (req, res, next) => {
    const AdminDetails = req.signedCookies
    if (AdminDetails["Admin"].length === 0) {
        req.flash("error", "Please Admin login again")
        res.redirect('/')
    }
    const Number = AdminDetails["Admin"]
    const admin = await Admin.find({ ContactNumber: Number })

    const OTP = otpGenerator.generate(4, {
        digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false
    })
    const otp = new OtpSchema({ number: Number, otp: OTP })
    await otp.save()
    console.log(OTP)

    const ContactNumber = admin[0].ContactNumber
    const email = admin[0].email
    res.render("Admin/Adotp.ejs", { ContactNumber, email })
})


//verification for otp
module.exports.AdminLoginVerficaiton = wrapAsync(async (req, res, next) => {
    const { ContactNumber } = req.body.Admin
    const { otp } = req.body
    const NumberOtp = otp.join("")
    //checking otp is expired or not
    const otpHolder = await OtpSchema.find({ number: ContactNumber })
    if (otpHolder.length === 0) {
        req.flash('SignUpError', "You use an Expired OTP!")
        res.redirect("/User/login")
    }

    const rightOtpFind = otpHolder[otpHolder.length - 1]
    if (rightOtpFind.number === ContactNumber && NumberOtp === rightOtpFind.otp) {
        const admin = await Admin.find({ ContactNumber: ContactNumber })
        const token = admin[0].generateJWT()
        await token.then((tokenValue) => {
            //storing token in cookie storage
            res.cookie("jwtAdmin", `${tokenValue}`, {
                httpOnly: true,
                expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
                maxAge: 7 * 24 * 60 * 60 * 1000
            })
        })
        //deleting otp after user registor
        const OTPDelete = await OtpSchema.deleteMany({ number: rightOtpFind.number })
        const ClearAdminCookie = await res.clearCookie("Admin")
        req.flash("success" , "Welcome Admin")
        res.redirect("/Admin")
    } else {
        req.flash("error", "You Entered Wrong OTP")
        res.redirect("/")
    }
})

