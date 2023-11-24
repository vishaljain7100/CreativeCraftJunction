const express = require("express")
const router = express.Router()
const post = require("../module/post")
const wrapAsync = require("../utility/wrapAsync")

// Main page
router.get('/', wrapAsync(async (req, res, next) => {
    const posts = await post.find()
    res.render("index.ejs",  {posts} )
}))

module.exports = router