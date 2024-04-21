const express = require('express')
const routes = express.Router()

const userController = require('../controllers/userController/userController')
const homeController = require('../controllers/userController/homeController')
const {isLogout,isLogin} = require('../middlewares/users/userSession')
const isBlocked = require('../middlewares/users/isBlock')

routes.get('/',isLogin,isBlocked,userController.viewHomePage)

routes.get('/login',isLogout,userController.viewUserLogin)
routes.post('/login',isLogout,userController.userLogin)

routes.get('/signup',isLogout,userController.viewUserSignup)
routes.post('/signup',isLogout,userController.signup)

routes.get('/otp-verify',isLogout,userController.viewOtpVarify)
routes.post('/otp-verify',isLogout,userController.otpVerification)

routes.get('/logout',homeController.logout)

routes.get('/user_account',isLogin,isBlocked,homeController.viewUserAccount)

module.exports = routes