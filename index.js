const express = require("express")
const app = express()
const PORT = 5500
const path = require("path")
const ejsMate = require("ejs-mate")
const ExpressError = require("./utility/ExpressError")
const wrapAsync = require("./utility/wrapAsync")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const postRoutes = require("./routes/post")
const AdminRoutes = require("./routes/Admin")
const data = require("./init/data")
const categoryData = require("./init/categoryData")
const post = require("./module/post")
const category = require("./module/category")
const flash = require("connect-flash")
const session = require("express-session")
const passpord = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./module/user")
const UserRoutes = require("./routes/user")
const log = console.log

const sessionOption = {
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000
    }

}

//required middlewares 
app.use(express.static(path.join(__dirname, "public")))
app.use(express.static(path.join(__dirname, "public/css")))
app.use(express.static(path.join(__dirname, "public/js")))
app.use(express.static(path.join(__dirname, "public/image")))
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.engine("ejs", ejsMate)
dotenv.config()
app.use(flash())
app.use(session(sessionOption))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(passpord.initialize())
app.use(passpord.session())
passpord.use(new LocalStrategy(User.authenticate()))
passpord.serializeUser(User.serializeUser())
passpord.deserializeUser(User.deserializeUser())

const db_url = process.env.DATABASE_URL

main()
    .then(res => console.log("Mongodb is connected"))
    .catch(err => console.log(err))

async function main() {
    await mongoose.connect(db_url)
}

//flash middle ware for message sending 
app.use((req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

//all routes
app.use('/', postRoutes)
app.use('/Admin', AdminRoutes)
app.use('/User', UserRoutes)

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

// category.deleteMany({}).then(res => log(res))
// category.insertMany(categoryData).then(res => log(res))