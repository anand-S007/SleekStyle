const mongoose = require('mongoose')
const categoryOfferSchema = new mongoose.Schema({
        offerName: {
            type: String,
            required: true,
        },
        category: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'category',
            required:true
        },
        discountPercent: {
            type: Number,
            required: true,
        },
        expiryDate: {
            type: Date,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now()
        },
        isBlocked:{
            type:Boolean,
            default:false,
        }
})

const offerModel = new mongoose.model('categoryOffer', categoryOfferSchema)

module.exports = offerModel