const mongoose = require('mongoose')

const wishlistSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    products:{
        type:[mongoose.Schema.Types.ObjectId],
        required:true,
    }
})

const wishlistModel = new mongoose.model('wishlist',wishlistSchema)

module.exports = wishlistModel