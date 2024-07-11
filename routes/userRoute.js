const express = require('express')
const routes = express.Router()
const passport = require('passport')

const { isLogout, isLogin, checkCartData } = require('../middlewares/users/userSession')
const isBlocked = require('../middlewares/users/isBlock')
const userAuthController = require('../controllers/userController/userAuthController')
const userController = require('../controllers/userController/userController')
const userAddressController = require('../controllers/userController/addressController')
const userAccDetailsController = require('../controllers/userController/accountDetailsController')
const cartController = require('../controllers/userController/cartController')
const productController = require('../controllers/userController/productController')
const orderController = require('../controllers/userController/userOrderController')
const wishlistController = require('../controllers/userController/wishlistController')


// Home page route
routes.get('/', userController.viewHomePage)

// Authentication
routes.get('/login', isLogout, userAuthController.viewUserLogin)
routes.post('/login', isLogout, userAuthController.userLogin)
routes.get('/login/google', isLogout, passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'select_account' }));
routes.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        req.session.user = req.user
        res.redirect('/');
    });
routes.get('/logout', userAuthController.logout)
routes.get('/forgot_password', isLogout, userAuthController.viewForgotPass)
routes.post('/forgot_password', isLogout, userAuthController.forgotPass)
routes.get('/forgot_password/otpVerify', isLogout, userAuthController.viewForgPassOtpVerify)
routes.post('/forgot_password/otpVerify', isLogout, userAuthController.forgotPassOtpVerify)
routes.get('/forgot_password/passwordChange', isLogout, userAuthController.viewForgConfirmPass)
routes.put('/forgot_password/passwordChange', isLogout, userAuthController.changePassword)
routes.get('/signup', isLogout, userAuthController.viewUserSignup)
routes.post('/signup', isLogout, userAuthController.signup)
routes.get('/otp-verify', isLogout, userAuthController.viewOtpVarify)
routes.post('/otp-verify', isLogout, userAuthController.otpVerification)
routes.get('/otp-verify/resend', isLogout, userAuthController.resendOtp)

// Account details
routes.get('/user_account/dashboard', isLogin, isBlocked, userController.viewUserAccount)
routes.get('/user_account/address', isLogin, isBlocked, userAddressController.viewAddress)
routes.delete('/user_account/address', isLogin, isBlocked, userAddressController.deleteAddress)
routes.get('/user_account/add_address', isLogin, isBlocked, userAddressController.viewAddAddress)
routes.post('/user_account/add_address', isLogin, isBlocked, userAddressController.addAddress)
routes.get('/user_account/address/edit/:id', isLogin, isBlocked, userAddressController.viewEditAddress)
routes.put('/user_account/address/edit/:id', isLogin, isBlocked, userAddressController.editAddress)
routes.get('/user_account/user_details', isLogin, isBlocked, userAccDetailsController.viewUserAccDetails)
routes.get('/user_account/user_details/edit', isLogin, isBlocked, userAccDetailsController.viewEditUserAccDetails)
routes.put('/user_account/user_details/edit', isLogin, isBlocked, userAccDetailsController.editUserAccDetails)
routes.get('/user_account/orderList', isLogin, isBlocked, orderController.viewOrderList)
routes.get('/user_account/orderDetails', isLogin, isBlocked, orderController.viewOrderDetails)
routes.put('/user_account/orderDetails/cancelOrder', isLogin, isBlocked, orderController.cancelOrder)
routes.put('/user_account/orderDetails/returnOrder', isLogin, isBlocked, orderController.returnOrder)
routes.get('/user_account/orderDetails/invoice', isLogin, isBlocked, orderController.viewInvoice)
routes.get('/user_account/wallet', isLogin, isBlocked , userController.viewWallet)


// view shop page route
routes.get('/shop', userController.viewShopPage)
routes.get('/shop/category', userController.viewCategoryPage)

// view product details route
routes.get('/product/sizeSelect', productController.sizeSelect)
routes.get('/product/:id', productController.viewProductDetails)

// Wishlist
routes.get('/wishlist', isLogin, isBlocked, wishlistController.viewWishlist)
routes.post('/wishlist', isLogin, isBlocked, wishlistController.addToWishlist)
routes.delete('/wishlist', isLogin, isBlocked, wishlistController.deleteWishlist)

// Cart
routes.get('/viewcart', isLogin, isBlocked, productController.viewCart)
routes.get('/addToCart', productController.addtocart)
routes.post('/viewcart/qtyInc', isLogin, isBlocked, cartController.cartQtyInc)
routes.post('/viewcart/qtyDec', isLogin, isBlocked, cartController.cartQtyDec)
routes.delete('/viewcart/productDelete', isLogin, isBlocked, cartController.productDelete)
routes.get('/check_dataInCart', isLogin, isBlocked, cartController.checkDataInCart)

// Order 
routes.get('/checkout', isLogin, isBlocked, checkCartData, cartController.viewCheckout)
routes.post('/checkout', isLogin, isBlocked, checkCartData, orderController.placeOrder)
routes.post('/checkout/apply_coupon', isLogin, isBlocked, checkCartData, orderController.applyCoupon)
routes.get('/checkout/edit_address', isLogin, isBlocked, orderController.viewEditAddress)
routes.put('/checkout/edit_address', isLogin, isBlocked, orderController.editAddress)
routes.get('/checkout/add_address', isLogin, isBlocked, orderController.viewAddAddress)
routes.post('/checkout/add_address', isLogin, isBlocked, orderController.addAddress)
routes.get('/checkout/orderSuccess', isLogin, isBlocked, orderController.orderSuccess)
routes.post('/verify-payment', isLogin, isBlocked, orderController.verifyPayment)
routes.put('/checkout/paymentFailed', isLogin, isBlocked, orderController.paymentFailed)
routes.get('/user_account/orderDetails/retryPayment',isLogin,isBlocked,orderController.retryPayment)
routes.put('/user_account/orderDetails/retryPayment/success',isLogin,isBlocked , orderController.verifyRetryPayment)



module.exports = routes