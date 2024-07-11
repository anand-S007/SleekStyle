const User = require('../../models/user/user')
const productModel = require('../../models/admin/productSchema')
const categoryModel = require('../../models/admin/category')
const orderModel = require('../../models/user/orderModel')

const viewDashBoard = async (req, res) => {
    const [newUsers, products, category, orders] = await Promise.all([
        User.find().sort({ _id: -1 }).limit(3),
        productModel.find(),
        categoryModel.find(),
        orderModel.aggregate([
            { $unwind: '$orders' },
            { $match: { 'orders.status': 'Delivered' } }
        ])
    ])

    const totalOrders = orders.length
    const totalRevenue = orders.reduce((acc, curr) => {
        return acc + curr.orders.totalPrice
    }, 0)
    const totalProducts = products.length

    const topProducts = await orderModel.aggregate([
        { $unwind: '$orders' },
        { $unwind: '$orders.products' },
        { $match: { 'orders.status': 'Delivered' } },
        {
            $group: {
                _id: '$orders.products.productId',
                count: { $sum: 1 }
            }
        },
        { $sort: { count: -1 } },
        { $limit: 5 },
        {
            $lookup: {
                from: 'products',
                localField: '_id',
                foreignField: '_id',
                as: 'productDetails'
            }
        }
    ])

    const latestOrders = await orderModel.aggregate([
        { $unwind: '$orders' },
        { $sort: { 'orders.createdAt': -1 } },
        { $limit: 5 },
    ])

    res.render('admin/dashboard', {
        admin: req.session.admin,
        totalOrders,
        totalRevenue,
        topProducts,
        totalProducts,
        newUsers,
        latestOrders
    })
}

const chartData = async (req, res) => {
    try {

        const orders = await orderModel.aggregate([
            { $unwind: '$orders' },
            { $match: { 'orders.status': 'Delivered' } }
        ])

        // Monthly Sales
        const monthlySales = Array.from({ length: 12 }, () => 0)
        for (const user of orders) {
            const month = user.orders.createdAt.getMonth()
            monthlySales[month] += user.orders.totalPrice
        }

        // yearly Sales
        const saleStartYear = 2022
        const currentYear = new Date().getFullYear()
        const yearlySales = Array.from({ length: currentYear - saleStartYear + 2 }, () => 0);
        for (const user of orders) {
            const year = user.orders.createdAt.getFullYear()
            yearlySales[year - saleStartYear] += user.orders.totalPrice
        }

        const countsOfCatInOrders = await orderModel.aggregate([
            { $unwind: '$orders' },
            { $unwind: '$orders.products' },
            {$match:{'orders.status':'Delivered'}},
            {
                $group: {
                    _id: '$orders.products.category', 
                    count: { $sum: '$orders.products.quantity' } 
                }
            }
        ]);
        const categories = await categoryModel.find()
        const categoryNames = []
        const categoriesCounts = {}
        categories.forEach((each) => {
            categoryNames.push(each.name)
        })
        categoryNames.forEach((each) => {
            categoriesCounts[each] = 0
        })

        countsOfCatInOrders.forEach((each) => {
            const categoryName = each._id
            categoriesCounts[categoryName] = each.count
        })

        const categoryData = categoryNames.map((catName) => {
            return categoriesCounts[catName]
        })

        console.log('categoryData', categoryData, 'categoryNames= ', categoryNames);
        return res.json({ monthlySales, yearlySales, categoryNames, categoryData })
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    viewDashBoard,
    chartData,
}