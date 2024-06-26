const express = require('express')
const routes = express.Router()

const { isLogout, isLogin, checkCartData } = require('../middlewares/users/userSession')
const isBlocked = require('../middlewares/users/isBlock')
const userAuthController = require('../controllers/userController/userAuthController')
const userController = require('../controllers/userController/userController')
const userAddressController = require('../controllers/userController/addressController')
const userAccDetailsController = require('../controllers/userController/accountDetailsController')
const cartController = require('../controllers/userController/cartController')
const productController = require('../controllers/userController/productController')
const orderController = require('../controllers/userController/userOrderController')


// Home page route
routes.get('/', userController.viewHomePage)

// Login Route
routes.get('/login', userAuthController.viewUserLogin)
routes.post('/login', isLogout, userAuthController.userLogin)

// Forgot password route
routes.get('/forgot_password', isLogout, userAuthController.viewForgotPass)
routes.post('/forgot_password', isLogout, userAuthController.forgotPass)
routes.get('/forgot_password/otpVerify', isLogout, userAuthController.viewForgPassOtpVerify)
routes.post('/forgot_password/otpVerify', isLogout , userAuthController.forgotPassOtpVerify)
routes.get('/forgot_password/passwordChange' )

// Signup route
routes.get('/signup', isLogout, userAuthController.viewUserSignup)
routes.post('/signup', isLogout, userAuthController.signup)

// otp verification route
routes.get('/otp-verify', isLogout, userAuthController.viewOtpVarify)
routes.post('/otp-verify', isLogout, userAuthController.otpVerification)

// resend otp route
routes.get('/otp-verify/resend', isLogout, userAuthController.resendOtp)

// logout route
routes.get('/logout', userAuthController.logout)

// view user account route
routes.get('/user_account/dashboard', isLogin, isBlocked, userController.viewUserAccount)

// view user address route
routes.get('/user_account/address', isLogin, isBlocked, userAddressController.viewAddress)
// user delete address route
routes.delete('/user_account/address', isLogin, isBlocked, userAddressController.deleteAddress)

// view and add user address route
routes.get('/user_account/add_address', isLogin, isBlocked, userAddressController.viewAddAddress)
routes.post('/user_account/add_address', isLogin, isBlocked, userAddressController.addAddress)

// view and edit user address
routes.get('/user_account/address/edit/:id', isLogin, isBlocked, userAddressController.viewEditAddress)
routes.put('/user_account/address/edit/:id', isLogin, isBlocked, userAddressController.editAddress)

// view user account details 
routes.get('/user_account/user_details', isLogin, isBlocked, userAccDetailsController.viewUserAccDetails)

// view and edit user account details
routes.get('/user_account/user_details/edit', isLogin, isBlocked, userAccDetailsController.viewEditUserAccDetails)
routes.put('/user_account/user_details/edit', isLogin, isBlocked, userAccDetailsController.editUserAccDetails)

// view order details in user account
routes.get('/user_account/orderList', isLogin, isBlocked, orderController.viewOrderList)
routes.get('/user_account/orderDetails', isLogin, isBlocked, orderController.viewOrderDetails)
// Order canel and return
routes.put('/user_account/orderDetails/cancelOrder', isLogin, isBlocked, orderController.cancelOrder)
routes.put('/user_account/orderDetails/returnOrder', isLogin, isBlocked , orderController.returnOrder)

// view shop page route
routes.get('/shop', userController.viewShopPage)
routes.get('/shop/category', userController.viewCategoryPage)

// view product details route
routes.get('/product/sizeSelect', productController.sizeSelect)
routes.get('/product/:id', productController.viewProductDetails)

// cart
routes.get('/viewcart', isLogin, isBlocked, productController.viewCart)
routes.get('/addToCart', productController.addtocart)
// cart qty Inc or Dec
routes.post('/viewcart/qtyInc', isLogin, isBlocked, cartController.cartQtyInc)
routes.post('/viewcart/qtyDec', isLogin, isBlocked, cartController.cartQtyDec)
// cart product delete
routes.delete('/viewcart/productDelete', isLogin, isBlocked, cartController.productDelete)
routes.get('/check_dataInCart', isLogin, isBlocked, cartController.checkDataInCart)

// view checkout page
routes.get('/checkout', isLogin, isBlocked, checkCartData, cartController.viewCheckout)
routes.post('/checkout', isLogin, isBlocked, checkCartData, orderController.placeOrder)
// Edit user address in checkout page
routes.get('/checkout/edit_address', isLogin, isBlocked, orderController.viewEditAddress)
routes.put('/checkout/edit_address', isLogin, isBlocked, orderController.editAddress)
// add user address in checkout page
routes.get('/checkout/add_address', isLogin, isBlocked, orderController.viewAddAddress)
routes.post('/checkout/add_address', isLogin, isBlocked, orderController.addAddress)
routes.get('/checkout/orderSuccess', isLogin, isBlocked, orderController.orderSuccess)
module.exports = routes