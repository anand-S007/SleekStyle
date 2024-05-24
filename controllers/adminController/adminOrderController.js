const orderModel = require('../../models/user/orderModel')

const viewOrderList = async (req, res) => {
    try {
        const admin = req.session.admin
        const orderData = await orderModel.find().populate('userId')
        if (orderData) {
            res.render('admin/orderManagement/adminPage-ordersList', { admin, orderData })
        }
    } catch (error) {
        console.log(error);
    }
}

const viewOrderDetail = async (req, res) => {
    const admin = req.session.admin
    const { userId, orderId } = req.query
    const orders = await orderModel.findOne({ userId: userId }).populate('userId')
    const orderDetails = orders.orders.find(data => data._id == orderId)
    if (orderDetails) {
        res.render('admin/orderManagement/adminPage-orderDetail', { admin, orderDetails, userData: orders.userId, orderId })
    }
}

const changeStatus = async(req,res)=>{
    try {
        console.log('entry');
        const {status,orderId,userId} = req.body
        console.log(req.body);
        // const userOrders = await orderModel.findOne(({userId:userId}))
        const userOrders = await orderModel.findOne({ userId: userId }).populate({
            path: 'orders.products.productId',
            model: 'product'
        });
        const orders = userOrders.orders.find(data=>data._id == orderId)
        if(status == 'cancelled' && orders){
            for (const product of orders.products) {
                const productId = product.productId._id;
                const productQuantity = product.quantity;

                // Find the product by ID and update its quantity
                await productData.findByIdAndUpdate(productId, {
                    $inc: { 'size.small.quantity': product.size === 'small' ? productQuantity : 0,
                            'size.medium.quantity': product.size === 'medium' ? productQuantity : 0,
                            'size.large.quantity': product.size === 'large' ? productQuantity : 0 }
                });
            }
        }
        if(orders){
            orders.status = status
            await userOrders.save()
            res.json({success:true,status})
        }

    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    viewOrderList,
    viewOrderDetail,
    changeStatus,
}