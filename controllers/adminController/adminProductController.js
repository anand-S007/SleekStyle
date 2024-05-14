const products = require('../../models/admin/productSchema')
const Category = require('../../models/admin/category')
const path = require('path')
const sharp = require('sharp')
const fs = require('fs')

const viewAddProduct = async(req,res)=>{
    const categories = await Category.find({})
    res.render('admin/productManagement/addProductPage',{categories:categories})
}

const addProduct = async(req,res)=>{
    try {
        const images = req.files 
        // const imageFile = images.map(image=>image.filename)
        const imgPromises = images.map(async (img) => {
            console.log("hello");
            const imgPath = img.path;
            const outputpath = path.join(
              __dirname,
              "../../uploads",
              "crop" + img.filename
            );
            await sharp(imgPath)
              .resize({ width: 650, height: 500, fit: "outside" })
              .toFile(outputpath);
      
            return outputpath;
          });

        const croppedImgPaths = await Promise.all(imgPromises);
        const croppedImgfilename = croppedImgPaths.map((img) => {
            return path.basename(img);
        });
    const productInput = {
        title:req.body.productName,
        description:req.body.productDes,
        image: croppedImgfilename,
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
            res.redirect('/admin/productsList')
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
            item.createdAt = formattedDate
            return item 
        });
        res.render('admin/productManagement/adminProductList',{productData:productData})
    } catch (error) {
        console.log('error found while admin product list',error);
    }
}

const updateProductStatus = async(req,res)=>{
    try {
        const productId = req.params.id
        const product = await products.findOne({_id:productId})
        console.log(product);
        if(product.isBlocked){
            const data = await products.findByIdAndUpdate({_id:productId},{isBlocked:false})

            res.json({unblocked:'product unblocked',title:data.title,id:data._id})
        }else{
            const data = await products.findByIdAndUpdate({_id:productId},{isBlocked:true})

            res.json({blocked:'product blocked',title:data.title,id:data._id})
        }
    } catch (error) {
        console.log('error found while blocking products',error);
    }
}

const viewEditProduct = async(req,res)=>{
    try {
        const productId = req.params.id
        const productData = await products.findOne({_id:productId}).populate('category')
        // const productCategory = await Category.findOne({_id:data.category})
        const categories = await Category.find({_id:{$ne:productData.category._id}})
        // const categories = await Category.find({})
        res.render('admin/productManagement/editProducts',{categories:categories,productData})
    } catch (error) {
        console.log(error);
    }
}

const editProduct = async(req,res)=>{
    try {
        const productId = req.params.id
        const images = req.files
        const imageFile = images.map(image=>image.filename)
    const productInput = {
        title:req.body.productName,
        description:req.body.productDes,
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
    if(imageFile.length>0){
        // productInput.$push = { image: { $each: imageFile } };
        await products.findByIdAndUpdate({_id:productId},{$push:{image:{$each:imageFile}}})
        // if(processAddProduct){
        //     res.redirect('/admin/productsList')
        // }else{
        //     console.log('error found while product adding');
        // }
    }
        console.log('no image');
        const processAddProduct = await products.findByIdAndUpdate(productId,productInput)
        console.log(processAddProduct);
        if(processAddProduct){
            res.redirect('/admin/productsList')
        }
    } catch (error) {
        console.log(error);
    }
}

const editProdDelImg = async(req,res)=>{
    try {
        console.log('entry');
        const index = req.body.index
        const pdtId = req.body.id
        const product = await products.findById({_id:pdtId},)
        
        const deletePDTimage = product.image[index]
        fs.unlink(deletePDTimage,(err)=>{
            if (err) {
                console.error(err.message)
            } else {
                console.log('set');
            }
        })
         product.image.splice(index,1)
         await product.save()
        res.status(200).json({success:true})
    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    viewAddProduct,
    addProduct,
    viewProductList,
    updateProductStatus,
    viewEditProduct,
    editProdDelImg,
    editProduct
}