const products = require('../../models/admin/productSchema')
const categories = require('../../models/admin/category')
const wishlist = require('../../models/user/wishlistModel')

// view user Home page
const viewHomePage = async(req,res)=>{
    try {
        const user= req.session.user
        const productData = await products.find({isBlocked:false})
        const newArrival = await  products.find({isBlocked:false}).sort({_id:-1}).limit(8)
        const category = await categories.find({isList:true})
        res.render('user/home',{user,products:productData,categories:category,newArrivals:newArrival})
        console.log('enterded home ');
    } catch (error) {
        console.log(error,'error found while viewing home page');
    }
}

// View user Account Details
const viewUserAccount = (req,res)=>{
    res.render('user/accountPage/userDashboard',{user:req.session.user})
}

// Shopping page sort products
const viewShopPage = async(req,res)=>{
    const category = await categories.find({})
    const sort = req.query.sort
    const search = req.query.searchVal
    switch (sort) {
        case "lowToHigh":
            productData = await products.find({isBlocked:false}).sort({"price.offerPrice":1})
            break;
        case "highToLow":
            productData = await products.find({isBlocked:false}).sort({"price.offerPrice":-1})
            break;
        case 'aA-zZ':
            productData = await products.find({isBlocked:false}).sort({title:1})
            break;
        case 'zZ-aA':
            productData = await products.find({isBlocked:false}).sort({title:-1})
            break;
        default:
            productData = await products.find({isBlocked:false})
            break;
    }
    res.render('user/page_shop',{products:productData,user:req.session.user,category})
}

const viewCategoryPage = async(req,res)=>{
    const catFilter = req.query.filterCat
    const sort = req.query.sort
    const category = await categories.find({})
    
    switch (sort) {
        case "lowToHigh":
            filterProducts = await products.find({category:catFilter},{isBlocked:false}).sort({"price.offerPrice":1})
            break;
        case "highToLow":
            filterProducts = await products.find({category:catFilter},{isBlocked:false}).sort({"price.offerPrice":-1})
            break;
        case 'aA-zZ':
            filterProducts = await products.find({category:catFilter},{isBlocked:false}).sort({title:1})
            break;
        case 'zZ-aA':
            filterProducts = await products.find({category:catFilter},{isBlocked:false}).sort({title:-1})
            break;
        default:
            filterProducts = await products.find({category:catFilter},{isBlocked:false})
            console.log(filterProducts);
            break;
    }
    console.log('hello');
    res.render('user/page_category',{user:req.session.user,catFilter,filterProducts,category})
}

module.exports ={
    viewUserAccount,
    viewHomePage,
    viewShopPage,
    viewCategoryPage
}