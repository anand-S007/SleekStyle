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
    isList:{
        type:Boolean,
        default:true,
        required:true
    }
})

const Category = new mongoose.model('category',categorySchema)

module.exports = Category