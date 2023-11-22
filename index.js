const express = require("express")
const app = express()
const PORT = 5500
const path = require("path")
const ejsMate = require("ejs-mate")
const ExpressError = require("./utility/ExpressError")
const wrapAsync = require("./utility/wrapAsync")
const log = console.log

app.use(express.static(path.join(__dirname, "public")))
app.use(express.static(path.join(__dirname, "public/css")))
app.use(express.static(path.join(__dirname, "public/image")))
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.engine("ejs", ejsMate)

app.get('/', (req, res) => {
    res.render("index.ejs")
})

app.get('/hello', (req, res) => {
    res.send("hello")
})

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

