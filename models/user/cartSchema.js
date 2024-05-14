const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    items: [{
        productId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'product',
            required:true
        },
        size:{
            type:String,
            required:true
        },
        quantity:{
            type:Number,
            default:1,
        },
        stock:{
            type:Number
        },
        price:{
            type:Number,
            required:true
        },
    }],
    totalPrice:{
        type:Number,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    }
})

const cartModel = new mongoose.model('cart',cartSchema)
module.exports = cartModel