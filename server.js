const express = require('express')
const app = express()
const path = require('path')
const PORT = 3000
const userRoute = require('./routes/userRoute')
const adminRoute = require('./routes/adminRoute')
const session = require('express-session')
const { v4: uuidv4 } = require('uuid')
const uuid = uuidv4()
const mongodbconfig = require('./config/mongodbConfig')
const nocache = require('nocache');


app.set("view engine", "ejs")

app.use('/public', express.static(path.join(__dirname, '/public')))
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(session({
    secret: uuid,
    resave: false,
    saveUninitialized: true,
}))

app.use(nocache())


app.use('/admin', adminRoute)
app.use('/', userRoute)


app.listen(PORT, () => {
    mongodbconfig.connectMoongoose()
    console.log(`http://localhost:${PORT}`);
})