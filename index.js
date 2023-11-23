const express = require("express")
const app = express()
const PORT = 5500
const path = require("path")
const ejsMate = require("ejs-mate")
const ExpressError = require("./utility/ExpressError")
const wrapAsync = require("./utility/wrapAsync")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const log = console.log
const data = require("./init/data")
const postRoutes = require("./routes/post")

app.use(express.static(path.join(__dirname, "public")))
app.use(express.static(path.join(__dirname, "public/css")))
app.use(express.static(path.join(__dirname, "public/image")))
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.engine("ejs", ejsMate)
dotenv.config()

const db_url = process.env.DATABASE_URL

main()
    .then(res => console.log("Mongodb is connected"))
    .catch(err => console.log(err))

async function main() {
    await mongoose.connect(db_url)
}

app.use('/', postRoutes)

app.all("*", wrapAsync(async (req, res, next) => {
    throw new ExpressError(404, "Page not found!")
}))

app.use((err, req, res, next) => {
    let { status = 500 } = err
    res.status(status).render("Error.ejs", { err })
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})


// post.insertMany(data).then(res => console.log(res)).catch(err => console.log(err))
// post.deleteMany({}).then(res => log(res)).catch(err => log(err))