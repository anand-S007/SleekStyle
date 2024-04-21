const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({

    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,
    },
    image:{
        type:Array,
        required:true
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required:true
    },
    price:{
        regularPrice:{
            type:Number,
            required:true,
        },
        offerPrice:{
            type:Number,
            required:true
        }
    },
    size:{
        small:{
            quantity:{
                type:Number,
                required:true,
            }
        },
        medium:{
            quantity:{
                type:Number,
                required:true,
            }
        },
        large:{
            quantity:{
                type:Number,
                required:true
            }
        }
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    isBlocked:{
        type:Boolean,
        default:false,
        required:true
    }
})

const productData = new mongoose.model('product',productSchema)

module.exports = productData