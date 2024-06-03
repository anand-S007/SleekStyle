const categoryModel = require('../../models/admin/category')

const viewCoupons = async(req,res) =>{
    try {
        const admin = req.session.admin
        res.render('admin/couponManagement/admin_couponPage',{admin})
    } catch (error) {
        console.log(error);
    }
}

const viewCreateCoupon = async(req,res) =>{
    try {
        const admin = req.session.admin
        const categories = await categoryModel.find()
        res.render('admin/couponManagement/admin_createCoupon',{admin,categories})
    } catch (error) {
        console.log(error);
    }
}

const createCoupon = async(req,res)=>{
    try {
        console.log('req.body:',req.body);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    viewCoupons,
    viewCreateCoupon,
    createCoupon,
}