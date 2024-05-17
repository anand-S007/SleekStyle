const cartModel = require('../../models/user/cartSchema')
const productModel = require('../../models/admin/productSchema')
const userAddress = require('../../models/user/userAddressModel')

// cart product qty increase
const cartQtyInc = async (req, res) => {
    try {
        const { size, productId, cartId } = req.body
        const proData = await productModel.findOne({ _id: productId })
        const sizeStock = proData.size[`${size}`].quantity
        const cartData = await cartModel.findOne({ _id: cartId })

        if (sizeStock > 0) {
            const cartProData = cartData.items.find((item) => {
                return item.productId == productId && item.size == size
            })

            if (cartProData.quantity < 5) {

                cartProData.quantity += 1
                cartProData.subTotalPrice += proData.price.offerPrice

                cartData.totalPrice = cartData.items.reduce((acc, item) => { return acc + item.subTotalPrice }, 0)
                const updateCartData = await cartData.save()
                if (updateCartData) {
                    res.json({ success: 'quantity incremented', qty: cartProData.quantity, totalPrice: updateCartData.totalPrice, subTotalPrice: cartProData.subTotalPrice })
                } else {
                    res.json({ error: 'Error found while quantity increasing' });
                }
            } else {
                res.json({ limit: 'We are sorry!Only 5 units allowed in each order' })
            }
        } else {
            res.json({ error2: 'Product is out of stock' })
        }
    } catch (error) {
        console.log(error);
    }
}

// cart product qty decrease
const cartQtyDec = async (req, res) => {
    try {
        const { qtyVal, size, totalPrice, productId, cartId } = req.body
        const proData = await productModel.findOne({ _id: productId })
        const sizeStock = proData.size[`${size}`].quantity
        const cartData = await cartModel.findOne({ _id: cartId })

        if (sizeStock > 0) {
            const cartProData = cartData.items.find((item) => {
                return item.productId == productId && item.size == size
            })

            if (cartProData.quantity > 1) {

                cartProData.quantity -= 1
                cartProData.subTotalPrice -= proData.price.offerPrice

                cartData.totalPrice -= proData.price.offerPrice
                const updateCartData = await cartData.save()
                if (updateCartData) {
                    res.json({ success: 'quantity decremented', qty: cartProData.quantity, totalPrice: updateCartData.totalPrice, subTotalPrice: cartProData.subTotalPrice })
                } else {
                    res.json({ error: 'Error found while quantity decreasing' });
                }
            } else {
                res.json({ limit: 'We are sorry! Minimum 1 unit should be added' })
            }
        } else {
            res.json({ error2: 'Product is out of stock' })
        }

    } catch (error) {
        console.log(error);
    }

}

// cart Product delete 
const productDelete = async (req, res) => {
    try {
        const { cartId, cartProId } = req.body
        const cartData = await cartModel.findById({ _id: cartId })
        const itemToRemove = cartData.items.id(cartProId)
        const itemSubtotalPrice = itemToRemove.subTotalPrice
        cartData.totalPrice -= itemSubtotalPrice
        cartData.items.pull({_id:cartProId})
        await cartData.save()

        console.log(cartData);
        res.json({ success: true })

    } catch (error) {
        console.log(error);
    }
}

// view checkout page
const viewCheckout = async(req,res)=>{
    const user = req.session.user
    const cartData = await cartModel.findOne({userId:req.session.user._id}).populate('items.productId')
    console.log(cartData.items[0].productId.image);
    const user_address = await userAddress.findOne({userId:user._id})
    res.render('user/page_checkout',{user,cartData,user_address})
}

module.exports = {
    cartQtyInc,
    cartQtyDec,
    productDelete,
    viewCheckout
}