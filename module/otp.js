const mongoose = require("mongoose")

const OtpSchema = new mongoose.Schema({
    number: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createAt: {
        type: Date,
        default: Date.now(),
        index: { expires: 300 }
    }
}, { timestamps: true })

const Otp = mongoose.model("otp", OtpSchema)
module.exports = Otp