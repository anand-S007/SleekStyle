const express = require('express')
const routes = express.Router()
const uploads = require('../multer/multer')
const sessionMiddlewares = require('../middlewares/admin/adminSession')
const dashboardController = require('../controllers/adminController/dashboardController')
const adminAuthController = require('../controllers/adminController/adminAuthController')
const adminUserController = require('../controllers/adminController/adminUserController')
const adminProductController = require('../controllers/adminController/adminProductController')
const adminCategoreyController = require('../controllers/adminController/adminCategoryController')
const adminOrderController = require('../controllers/adminController/adminOrderController')
const adminCouponController = require('../controllers/adminController/adminCouponController')

routes.get('/', sessionMiddlewares.isLogin, dashboardController.viewDashBoard)

routes.get('/login', sessionMiddlewares.isLogout, adminAuthController.viewLogin)
routes.post('/login', sessionMiddlewares.isLogout, adminAuthController.adminLogin)

routes.get('/logout', sessionMiddlewares.isLogin, adminAuthController.adminLogout)

routes.get('/users_list', sessionMiddlewares.isLogin, dashboardController.viewUsersList)

routes.put('/user_block/:id', sessionMiddlewares.isLogin, adminUserController.blockUser)
routes.put('/user_unblock/:id', sessionMiddlewares.isLogin, adminUserController.unblockUser)

routes.get('/categories', sessionMiddlewares.isLogin, adminCategoreyController.viewCategoryPage)
routes.post('/categories', sessionMiddlewares.isLogin, adminCategoreyController.addCategory)

routes.get('/categories/block/:id', sessionMiddlewares.isLogin, adminCategoreyController.isCategoryBlock)
routes.get('/categories/unblock/:id', sessionMiddlewares.isLogin, adminCategoreyController.isCategoryUnblock)

routes.get('/categories/edit_category/:id', sessionMiddlewares.isLogin, adminCategoreyController.viewEditCategory)
routes.post('/categories/edit_category/:id', sessionMiddlewares.isLogin, adminCategoreyController.editCategory)

routes.get('/addProducts', sessionMiddlewares.isLogin, adminProductController.viewAddProduct)
routes.post('/addProducts', sessionMiddlewares.isLogin, uploads.array('image'), adminProductController.addProduct)

routes.get('/productsList', sessionMiddlewares.isLogin, adminProductController.viewProductList)
routes.get('/productsList/productStatus/:id', sessionMiddlewares.isLogin, adminProductController.updateProductStatus)

routes.post('/productsList/editProduct/deleteImage', sessionMiddlewares.isLogin, adminProductController.editProdDelImg)
routes.get('/productsList/editProduct/:id', sessionMiddlewares.isLogin, adminProductController.viewEditProduct)
routes.post('/productsList/editProduct/:id', sessionMiddlewares.isLogin, uploads.array('image'), adminProductController.editProduct)

// view order List
routes.get('/orderList', sessionMiddlewares.isLogin, adminOrderController.viewOrderList)
//order detals page
routes.get('/orderList/orderDetail', sessionMiddlewares.isLogin, adminOrderController.viewOrderDetail)
routes.put('/orderList/orderDetail', sessionMiddlewares.isLogin, adminOrderController.changeStatus)

// Coupons
routes.get('/coupons', sessionMiddlewares.isLogin, adminCouponController.viewCoupons)
// create Coupon
routes.get('/createCoupon', sessionMiddlewares.isLogin, adminCouponController.viewCreateCoupon)
module.exports = routes