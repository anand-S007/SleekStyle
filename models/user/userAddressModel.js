const mongoose = require('mongoose')

const userAddressSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    mobile:{
        type:Number,
        required:true
    },
    pincode:{
        type:Number,
        required:true
    },
    locality:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    district:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true,
    }
});

const userAddress = new mongoose.model('userAddress',userAddressSchema);
module.exports = userAddress