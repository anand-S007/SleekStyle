const categoryModel = require('../../models/admin/category')
const couponModel = require('../../models/admin/couponModel')

const viewCoupons = async (req, res) => {
    try {
        const admin = req.session.admin
        const coupons = await couponModel.find()
        res.render('admin/couponManagement/admin_couponPage', { admin, coupons })
    } catch (error) {
        console.log(error);
    }
}

const viewCreateCoupon = async (req, res) => {
    try {
        const admin = req.session.admin
        const categories = await categoryModel.find()
        res.render('admin/couponManagement/admin_createCoupon', { admin, categories })
    } catch (error) {
        console.log(error);
    }
}

const createCoupon = async (req, res) => {
    try {
        let { name, code, expiryDate, discountPercentage, minPurchase, maxDiscount } = req.body
        const randomnum = Math.floor(1000 + Math.random() * 9000);
        code = `${code}${randomnum}`
        const couponData = new couponModel({
            name,
            code,
            discountPercentage,
            maxDiscountAmount: maxDiscount,
            minPurchaseAmount: minPurchase,
            expiryDate,
        })
        await couponData.save()
        res.json({ success: true, message: 'Coupon created successfully' })
    } catch (error) {
        console.log(error);
    }
}

// change coupon status block/unblock
const changeCouponStatus = async (req, res) => {
    try {
        const { id } = req.body
        const coupon = await couponModel.findById(id)
        console.log('couponData:', coupon);
        if (coupon.isBlocked) {
            coupon.isBlocked = false
            await coupon.save()
            res.json({ unblocked: 'unblocked', id, code: coupon.code })
        } else {
            coupon.isBlocked = true
            await coupon.save()
            res.json({ blocked: 'blocked', id, code: coupon.code })
        }
    } catch (error) {
        console.log(error);
    }
}

// Delete coupon
const deleteCoupon = async (req, res) => {
    try {
        const couponId = req.body.id
        await couponModel.findByIdAndDelete(couponId)
        res.json({ success: true })
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    viewCoupons,
    viewCreateCoupon,
    createCoupon,
    changeCouponStatus,
    deleteCoupon
}