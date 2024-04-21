const products = require('../../models/admin/productSchema')
const Category = require('../../models/admin/category')


const viewAddProduct = async(req,res)=>{
    const categories = await Category.find({})
    res.render('admin/productManagement/addProductPage',{categories:categories})
}

const addProduct = async(req,res)=>{
    try {
        const images = req.files 
        const imageFile = images.map(image=>image.filename)
    const productInput = {
        title:req.body.productName,
        description:req.body.productDes,
        image:req.files ? imageFile : ['no images added'],
        category:req.body.productCat,
        price:{
            regularPrice:req.body.regularPrice,
            offerPrice:req.body.offerPrice,
        },
        size:{
            small:{
                quantity:req.body.sizeS,
            },
            medium:{
                quantity:req.body.sizeM,
            },
            large:{
                quantity:req.body.sizeL
            }
        },
    }
    console.log(productInput);
        const productData = new products(productInput)
        console.log(productData);
        const processAddProduct = await productData.save()
        console.log(processAddProduct);
        if(processAddProduct){
            // res.json({success:true},{message:'Product added successfully'})
            res.redirect('/admin/addProducts')
        }else{
            console.log('error found while product adding');
        }

    } catch (error) {
        console.log(error);
    }
}

const viewProductList = async(req,res)=>{
    try {
        let product = await products.find({})
        // const productDate = await products.find({},{createdAt:1,_id:0})
        let productData = product.map(item => {
            
            const formattedDate = new Date(item.createdAt).toLocaleDateString('en-GB');  // Format the date
            console.log(formattedDate);
            console.log(item.createdAt);
            item.createdAt = formattedDate

            return item 
        });
        console.log(productData,'lllllllllllll');
        res.render('admin/productManagement/adminProductList',{productData:productData})
    } catch (error) {
        console.log('error found while admin product list',error);
    }
}

const isBlocked = async()=>{
    try {
        
    } catch (error) {
        console.log('error found while blocking products',error);
    }
}

module.exports = {
    viewAddProduct,
    addProduct,
    viewProductList,
}