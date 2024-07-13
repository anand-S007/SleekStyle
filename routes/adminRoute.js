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
const adminSalesController = require('../controllers/adminController/adminSalesController')


routes.get('/', sessionMiddlewares.isLogin, dashboardController.viewDashBoard)
routes.get('/dashboard/chartData', sessionMiddlewares.isLogin, dashboardController.chartData)

// Authentication route
routes.get('/login', sessionMiddlewares.isLogout, adminAuthController.viewLogin)
routes.post('/login', sessionMiddlewares.isLogout, adminAuthController.adminLogin)
routes.get('/logout', sessionMiddlewares.isLogin, adminAuthController.adminLogout)


// Users route
routes.get('/users_list', sessionMiddlewares.isLogin, adminUserController.viewUsersList)
routes.put('/user_block/:id', sessionMiddlewares.isLogin, adminUserController.blockUser)
routes.put('/user_unblock/:id', sessionMiddlewares.isLogin, adminUserController.unblockUser)


// Category route
routes.get('/categories', sessionMiddlewares.isLogin, adminCategoreyController.viewCategoryPage)
routes.post('/categories', sessionMiddlewares.isLogin, adminCategoreyController.addCategory)
routes.get('/categories/block/:id', sessionMiddlewares.isLogin, adminCategoreyController.isCategoryBlock)
routes.get('/categories/unblock/:id', sessionMiddlewares.isLogin, adminCategoreyController.isCategoryUnblock)
routes.get('/categories/edit_category/:id', sessionMiddlewares.isLogin, adminCategoreyController.viewEditCategory)
routes.post('/categories/edit_category/:id', sessionMiddlewares.isLogin, adminCategoreyController.editCategory)
// category offers
routes.get('/categoryOffers', sessionMiddlewares.isLogin, adminCategoreyController.viewCategoryOffer)
routes.post('/categoryOffers', sessionMiddlewares.isLogin, adminCategoreyController.createCategoryOffer)
routes.delete('/categoryOffers', sessionMiddlewares.isLogin, adminCategoreyController.deleteOffer)


// Product route
routes.get('/addProducts', sessionMiddlewares.isLogin, adminProductController.viewAddProduct)
routes.post('/addProducts', sessionMiddlewares.isLogin, uploads.array('image'), adminProductController.addProduct)
routes.get('/productsList', sessionMiddlewares.isLogin, adminProductController.viewProductList)
routes.get('/productsList/productStatus/:id', sessionMiddlewares.isLogin, adminProductController.updateProductStatus)
routes.post('/productsList/editProduct/deleteImage', sessionMiddlewares.isLogin, adminProductController.editProdDelImg)
routes.get('/productsList/editProduct/:id', sessionMiddlewares.isLogin, adminProductController.viewEditProduct)
routes.post('/productsList/editProduct/:id', sessionMiddlewares.isLogin, uploads.array('image'), adminProductController.editProduct)


// order routes
routes.get('/orderList', sessionMiddlewares.isLogin, adminOrderController.viewOrderList)
routes.get('/orderList/orderDetail', sessionMiddlewares.isLogin, adminOrderController.viewOrderDetail)
routes.put('/orderList/orderDetail', sessionMiddlewares.isLogin, adminOrderController.changeStatus)
routes.get('/salesReport', sessionMiddlewares.isLogin, adminSalesController.viewSalesReport)


// Coupons route
routes.get('/coupons', sessionMiddlewares.isLogin, adminCouponController.viewCoupons)
routes.delete('/coupons', sessionMiddlewares.isLogin, adminCouponController.deleteCoupon)
routes.get('/createCoupon', sessionMiddlewares.isLogin, adminCouponController.viewCreateCoupon)
routes.post('/createCoupon', sessionMiddlewares.isLogin, adminCouponController.createCoupon)
routes.put('/admin/coupons/changeCouponStatus', sessionMiddlewares.isLogin, adminCouponController.changeCouponStatus)




module.exports = routes