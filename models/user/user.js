const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    mobile:{
        type:Number,
        required:true,
    },
    dob:{
        type:Date,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Boolean,
        default:false,
        required:true
    },
    isVerified:{
        type:Boolean,
        default:false,
        required:true
    },
    cartId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'cart'
    },
    wishlist:{
        type:[mongoose.Schema.Types.ObjectId],
    }
})

const User = new mongoose.model('user',userSchema);

module.exports = User