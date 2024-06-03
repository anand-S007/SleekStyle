const mongoose = require('mongoose')

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        requried: true,
        trim: true,
        unique: true
    },
    discountPercantage: {
        type: Number,
        requried: true
    },
    maxDiscountAmount: {
        type: Number,
        requried: true
    },
    minPurchaseAmount: {
        type: Number,
        requried: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiryDate: {
        type: Date,
        required: true
    },
    usageLimit: {
        type: Number,
        default: 1
    },
    usedCount: {
        type: Number,
        default: 0
    },
    userRestriction: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'user'
    },
    redeemedUser: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'user'
    },
    applicableCategories: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'category'
    },
    isBlocked: {
        type: Boolean,
        default: false
    }
});

const coupon = new mongoose.model('coupon', couponSchema)

module.exports = coupon