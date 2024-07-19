const products = require('../../models/admin/productSchema')
const cartModel = require('../../models/user/cartSchema');

// Product details page
const viewProductDetails = async (req, res) => {
    try {
        const user = req.session.user
        const productId = req.params.id
        const data = await products.findOne({ _id: productId })
        console.log(data);
        if (data) {
            return res.render('user/productDetails', { data, user })
        } 
    } catch (error) {
        console.log('Erro at viewing product details page', error);
        return res.render('user/404_page')
    }
}

// Product page size select
const sizeSelect = async (req, res) => {
    const size = req.query.size
    const productId = req.query.productId
    console.log(size);
    if (size == 'small') {
        stock = await products.findOne({ _id: productId }, { "size.small.quantity": 1 });
        if (stock.size.small.quantity == 0) {
            res.json({ emptyStock: true })
        } else {
            res.json({ emptyStock: false, stock: stock.size.small.quantity })
        }
    }
    else if (size == 'medium') {
        stock = await products.findOne({ _id: productId }, { "size.medium.quantity": 1 });
        if (stock.size.medium.quantity == 0) {
            res.json({ emptyStock: true })
        } else {
            res.json({ emptyStock: false, stock: stock.size.medium.quantity })
        }
    } else if (size == 'large') {
        stock = await products.findOne({ _id: productId }, { "size.large.quantity": 1 });
        if (stock.size.large.quantity == 0) {
            res.json({ emptyStock: true })
        } else {
            res.json({ emptyStock: false, stock: stock.size.large.quantity })
        }
    } else {
        console.log('size is not selecte from server side');
    }
}

// Product add to cart
const addtocart = async (req, res) => {
    try {
        const { size, price, userId, productId } = req.query
        const productData = await products.findOne({ _id: productId })
        let items = {
            productId: productId,
            size: size,
            stock: productData.size[size].quantity,
            proPrice: productData.price.offerPrice,
            subTotalPrice: productData.price.offerPrice,
        }

        const checkCartExist = await cartModel.findOne({ userId: userId })

        if (checkCartExist) {
            const checkProInCart = checkCartExist.items.find((item) => {
                return item.productId.toString() == productId && item.size == size
            })
            if (checkProInCart) {
                res.json({ proInCart: true })
            }
            else {
                checkCartExist.items.push(items)
                checkCartExist.totalPrice += items.subTotalPrice
                await checkCartExist.save()
                res.json({ success: true })
            }
        } else {
            const data = {
                userId: userId,
                items: [items],
                totalPrice: parseFloat(price)
            }
            const cartData = new cartModel(data)
            const saveToCart = await cartData.save()
            if (saveToCart) {
                res.json({ success: true })
            }
        }
    } catch (error) {
        console.log('error found at product saving to cart in addtocart', error);
    }
}

// view cart page
const viewCart = async (req, res) => {
    try {
        const user = req.session.user
        const cartData = await cartModel.findOne({ userId: user._id }).populate('items.productId')
        res.render('user/page_cart', { user, cartData})
    } catch (error) {
        console.log(error);
        res.render('user/page_cart', {user, cartData: null });
    }
}

module.exports = {
    viewProductDetails,
    sizeSelect,
    addtocart,
    viewCart
}