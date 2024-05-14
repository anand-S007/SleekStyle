const cartModel = require('../../models/user/cartSchema')
const productModel = require('../../models/admin/productSchema')

const cartQtyInc = async (req, res) => {
    try {
        const { qtyVal, size, totalPrice, productId, cartId } = req.body
        const proData = await productModel.findOne({ _id: productId })
        const sizeStock = proData.size[`${size}`].quantity
        const cartData = await cartModel.findOne({ _id: cartId })
        if (sizeStock > 0) {
            if (cartData.items[0].quantity < 5) {
                cartData.items[0].quantity += 1
                cartData.totalPrice += proData.price.offerPrice
                const updateCartData = await cartData.save()
                if (updateCartData) {
                    res.json({ success: 'quantity incremented', qty: updateCartData.items[0].quantity, totalPrice: updateCartData.totalPrice })
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

const cartQtyDec = async (req, res) => {
    try {
        const { qtyVal, size, totalPrice, productId, cartId } = req.body
        const proData = await productModel.findOne({ _id: productId })
        const sizeStock = proData.size[`${size}`].quantity
        const cartData = await cartModel.findOne({ _id: cartId })
        if (sizeStock > 0) {
            if (cartData.items[0].quantity > 1) {
                cartData.items[0].quantity -= 1
                cartData.totalPrice -= proData.price.offerPrice
                const updateCartData = await cartData.save()
                if (updateCartData) {
                    res.json({ success: 'quantity decremented', qty: updateCartData.items[0].quantity, totalPrice: updateCartData.totalPrice })
                } else {
                    res.json({ error: 'Error found while quantity decreasing' });
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

const productDelete = async (req, res) => {
    try {
        const cartId = req.body.cartId
        await cartModel.deleteOne({ _id: cartId })
        res.json({ success: true })

    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    cartQtyInc,
    cartQtyDec,
    productDelete
}