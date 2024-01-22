const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");

const ejs = require('ejs')
const mongoose = require('mongoose')
const expressSession = require('express-session')
const flash = require('connect-flash')


// MongoDB Connection
mongoose.connect('mongodb+srv://admin:1234@cluster0.qewofxc.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true
})

global.loggedIn = null

const filesPayloadExists = require('./middleware/filesPayloadExists')
const fileExtLimiter = require('./middleware/fileExtLimiter')
const fileSizeLimiter = require('./middleware/fileSizeLimiter')

const PORT = process.env.PORT || 3500;

const app = express();

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded())
app.use(flash())
app.use(expressSession({
    secret: "node secret"
}))
app.use("*", (req, res, next) => {
    loggedIn = req.session.userId
    next()
})
app.set('view engine', 'ejs')

const indexController  = require('./controllers/indexController')
const loginController  = require('./controllers/loginController')
const registerController  = require('./controllers/registerController')
const uploadfileController  = require('./controllers/uploadFileController')
const storeUserController  = require('./controllers/storeUserController')
const loginUserController  = require('./controllers/loginUserController')
const logoutController  = require('./controllers/logoutController')

// midleware
const redirectifAuth = require('./middleware/redirectifAuth')

app.get("/", indexController)
app.get("/login", redirectifAuth,loginController)
app.get("/register", redirectifAuth, registerController)
app.get("/test", uploadfileController)
app.post("/user/register", redirectifAuth, storeUserController)
app.post("/user/login", redirectifAuth, loginUserController)
app.get("/logout", logoutController)

app.post('/upload',
    fileUpload({ createParentPath: true }),
    filesPayloadExists,
    fileExtLimiter(['.pdf']),
    fileSizeLimiter,
    (req, res) => {
        const files = req.files
        console.log(files)

        Object.keys(files).forEach(key => {
            const filepath = path.join(__dirname, 'files', files[key].name)
            files[key].mv(filepath, (err) => {
                if (err) return res.status(500).json({ status: "error", message: err})
            })
        })

        return res.json({ status: 'success', message: Object.keys(files).toString() })
    }
)


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


