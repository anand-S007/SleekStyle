const products = require('../../models/admin/productSchema')
const categories = require('../../models/admin/category')
const walletModel = require('../../models/user/walletModel')
const { ObjectId } = require('mongodb')


// view user Home page
const viewHomePage = async (req, res) => {
    try {
        const user = req.session.user
        const productData = await products.find({ isBlocked: false })
        const newArrival = await products.find({ isBlocked: false }).sort({ _id: -1 }).limit(8)
        const category = await categories.find({ isList: true })
        res.render('user/home', { user, products: productData, categories: category, newArrivals: newArrival })
        console.log('enterded home ');
    } catch (error) {
        console.log(error, 'error found while viewing home page');
    }
}

// View user Account Details
const viewUserAccount = (req, res) => {
    res.render('user/accountPage/userDashboard', { user: req.session.user })
}


const viewShopPage = async (req, res) => {
    try {
        const category = await categories.find({});
        const sort = req.query.sort;
        const search = req.query.search;
        console.log('search:', search);

        const page = req.query.page || 1
        const limit = 8
        const skip = (page-1)*limit

        let query = { isBlocked: false };

        if (search) {
            query.$text = { $search: search };
        }
        const allProducts = await products.find(query)
        const totalProducts = allProducts.length
        const totalPages = Math.ceil(totalProducts/limit)

        let sortCriteria = {};

        switch (sort) {
            case "lowToHigh":
                sortCriteria = { "price.offerPrice": 1 };
                break;
            case "highToLow":
                sortCriteria = { "price.offerPrice": -1 };
                break;
            case 'aA-zZ':
                sortCriteria = { title: 1 };
                break;
            case 'zZ-aA':
                sortCriteria = { title: -1 };
                break;
            default:
                break;
        }

        const productData = await products.find(query).sort(sortCriteria).skip(skip).limit(limit)

        res.render('user/page_shop', { 
            products: productData, 
            user: req.session.user, 
            category,
            currentPage:page,
            totalPages,
            sort,
            search,
            totalProducts
        });
    } catch (error) {
        console.error('Error fetching shop page data:', error);
        res.status(500).send('Internal server error');
    }
};


const viewCategoryPage = async (req, res) => {
    const catFilter = req.query.filterCat 
    const sort = req.query.sort
    const category = await categories.find({})
    const page = req.query.page ? parseInt(req.query.page) : 1
    const limit = 8
    const skip = (page - 1) * limit

    const allProducts = await products.find({ category: catFilter })
    const totalProducts = allProducts.length
    const totalPages = Math.ceil(totalProducts / limit)


    switch (sort) {
        case "lowToHigh":
            filterProducts = await products.find({ category: catFilter }, { isBlocked: false }).sort({ "price.offerPrice": 1 }).skip(skip).limit(limit)
            break;
        case "highToLow":
            filterProducts = await products.find({ category: catFilter }, { isBlocked: false }).sort({ "price.offerPrice": -1 }).skip(skip).limit(limit)
            break;
        case 'aA-zZ':
            filterProducts = await products.find({ category: catFilter }, { isBlocked: false }).sort({ title: 1 }).skip(skip).limit(limit)
            break;
        case 'zZ-aA':
            filterProducts = await products.find({ category: catFilter }, { isBlocked: false }).sort({ title: -1 }).skip(skip).limit(limit)
            break;
        default:
            filterProducts = await products.find({ category: catFilter }, { isBlocked: false }).skip(skip).limit(limit)
            break;
    }

    res.render('user/page_category', { 
        user: req.session.user, 
        catFilter, 
        filterProducts, 
        category, 
        currentPage: page, 
        totalPages,
        totalProducts,
    })
}

const viewWallet = async (req, res) => {
    try {
        const user = req.session.user
        const userId = new ObjectId(user._id)
        const limit = 5
        const page = req.query.page || 1
        const skip = (page - 1) * limit
        const walletTransactions = await walletModel.findOne({ userId: userId })
        if(!walletTransactions){
            return res.render('user/accountPage/wallet',{
                walletData: null,
                user,
                totalPages:1,
                currentPage: page
            })
        }
        const totalOrders = walletTransactions.transactions.length
        const totalPages = Math.ceil(totalOrders / limit)
        const walletData = await walletModel.aggregate([
            { $match: { userId: userId } },
            { $unwind: '$transactions' },
            { $sort: { 'transactions._id': -1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $group: {
                    _id: '$_id',
                    userId: { $first: '$userId' },
                    balance:{$first:'$balance'},
                    transactions: { $push: '$transactions' }
                }
            }
        ]);
        console.log('walletData',walletData);
        if (walletData) {
            res.render('user/accountPage/wallet', {
                walletData: walletData[0],
                user,
                totalPages,
                currentPage: page
            })
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    viewUserAccount,
    viewHomePage,
    viewShopPage,
    viewCategoryPage,
    viewWallet
}