const products = require('../../models/admin/productSchema')
const wishlist = require('../../models/user/wishlistModel')

const viewWishlist = async (req, res) => {
    try {
        const user = req.session.user
        const wishlistData = await wishlist.findOne({ userId: user._id })
        const productIds = wishlistData.products

        const proInWishlist = await products.find({ _id: { $in: productIds } }).sort({_id:-1})
        console.log('wishlist:', proInWishlist);
        res.render('user/page_wishlist', { user, proInWishlist: proInWishlist.length>0 ? proInWishlist : null })

    } catch (error) {
        console.log(error);
        res.render("user/404_page")
    }
}

const addToWishlist = async (req, res) => {
    try {
        console.log('entry');
        const productId = req.body.productId
        const user = req.session.user
        const proData = await products.findById(productId)
        // Check if the product exist 
        if (!proData) {
            return res.json({ success: false, message: 'product not found' })
        }

        // proInWishlist = await wishlist.findOne({ userId: user._id }, { products: { $in: [productId] } })
        const wishlistData = await wishlist.findOne({ userId: user._id })
        console.log(wishlistData, 'sdfasdf');
        if (!wishlistData) {
            // If user has no wishlist create new
            const newWishlist = new wishlist({
                userId: user._id,
                products: [productId],
            })
            await newWishlist.save()
            return res.json({ success: true, message: 'Product added to wishlist' })
        }

        const isProInWishlist = wishlistData.products.includes(productId)
        if (isProInWishlist) {
            return res.json({ success: false, message: 'Product already in wishlist' })
        }

        // adding product to existing wishlist
        wishlistData.products.push(productId)
        await wishlistData.save()
        return res.json({ success: true, message: 'Product added to wishlist' });

    } catch (error) {
        console.log(error);
    }
}

const deleteWishlist = async (req, res) => {
    try {
        const { proId } = req.body
        const user = req.session.user
        const checkProExists = await products.findById(proId)
        if (checkProExists) {
            const deleteProInWishlist = await wishlist.updateOne(
                { userId: user._id },
                { $pull: { products: proId } }
            )
            if (deleteProInWishlist) {
                res.json({ success: true, message: 'Product removed from wishlist' })
            } else {
                res.json({ success: false, message: '*Product not found in wishlist' })
            }
        } else {
            res.json({ success: false, message: '*Product not exists' })
        }

    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    viewWishlist,
    addToWishlist,
    deleteWishlist,
}