const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({

    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    offer:{
        offerName:{
            type:String,
        },
        discountPercent:{
            type:Number,
        },
        expiryDate:{
            type:Date,
        },
        createdAt:{
            type: Date,
            default: Date.now()
        }
    },
    isList:{
        type:Boolean,
        default:true,
        required:true
    }
})

const Category = new mongoose.model('category',categorySchema)

module.exports = Category