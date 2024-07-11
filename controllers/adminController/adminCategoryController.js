const Category = require('../../models/admin/category')
const products = require('../../models/admin/productSchema')
// admin view category page
const viewCategoryPage = async (req, res) => {
    try {
        const categoryList = await Category.find({})
        res.render('admin/categoreyManagement/categoryPage', { categoryList: categoryList })
    } catch (error) {
        console.log('error found while viewing admin category page', error);
    }
}

// Admin add category
const addCategory = async (req, res) => {
    try {
        const category_data = {
            name: req.body.categoryName,
            description: req.body.categoryDescription
        }

        const checkCatNameExist = await Category.find({ name: category_data.name }).collation({ locale: 'en', strength: 1 })
        if (checkCatNameExist.length > 0) {
            res.json({ nameExist: 'Category name already exists' })
        } else {
            const categoryData = new Category(category_data)
            const saveCategory = await categoryData.save()
            if (saveCategory) {
                res.status(200).json({ message: '*Category created successfully' });
            } else {
                res.status(404).json({ err: "error" })
            }
        }

    } catch (error) {
        console.log('error found while adding category by admin', error);
    }
}

// admin unblock categories
const isCategoryUnblock = async (req, res) => {
    const categoryId = req.params.id
    const updateIsList = await Category.findByIdAndUpdate({ _id: categoryId }, { isList: true })
    if (updateIsList) {
        res.status(200).json({ message: 'category unblocked' })
    } else {
        res.status(400).json({ error: 'Error found while unblocking category' })
    }
}

// admin block categories
const isCategoryBlock = async (req, res) => {
    const categoryId = req.params.id
    const updateIsList = await Category.findByIdAndUpdate({ _id: categoryId }, { isList: false })
    if (updateIsList) {
        res.status(200).json({ message: 'category blocked' })
    } else {
        res.status(400).json({ error: 'Error found while blocking category' })
    }
}

const viewEditCategory = async (req, res) => {
    try {
        const categoryId = req.params.id
        const categoryData = await Category.findOne({ _id: categoryId })
        res.render('admin/categoreyManagement/categoryEditPage', { categoryData: categoryData })
    } catch (error) {
        console.log('error found while rendering category page', error);
    }
}

const editCategory = async (req, res) => {
    const catName = req.body.catName
    const catDescription = req.body.catDescription
    console.log(catName);
    const updateCategory = await Category.findOneAndUpdate({ name: catName },
        { name: catName, description: catDescription },
        { new: true })
    console.log(updateCategory);
    if (updateCategory) {
        res.json({ message: 'category updated' })
    } else {
        res.json({ error: 'Error at edit category' })
    }
}

// view category offer
const viewCategoryOffer = async (req, res) => {
    try {
        const admin = req.session.admin
        const category = await Category.find()
        const offerCategory = await Category.find({ offer: { $exists: true } })
        res.render('admin/categoreyManagement/admin_categoryOfferPage', { admin, offerCategory: offerCategory ? offerCategory : null, category })
    } catch (error) {
        console.log(error);
    }
}

// create category offer
const createCategoryOffer = async (req, res) => {
    try {
        const { offerName, discountPercent, expiryDate, selectedCategory } = req.body
        const updatedCategory = await Category.updateOne(
            { _id: selectedCategory },
            {
                $set: {
                    'offer.offerName': offerName,
                    'offer.discountPercent': discountPercent,
                    'offer.expiryDate': expiryDate,
                    'offer.createdAt': Date.now()
                }
            },
            { new: true, upsert: true }
        );
        if (updatedCategory) {
            const productsInSelectedCat = await products.find({ category: selectedCategory })
            for (let item of productsInSelectedCat) {
                let discountAmount = Math.floor((item.price.regularPrice * discountPercent) / 100);

                if(item.price.regularPrice > discountAmount){
                    let offerPrice = item.price.regularPrice - discountAmount
                    if (offerPrice < item.price.offerPrice) {
                        item.price.offerPrice = offerPrice;
                        await item.save();
                    }
                }
            }
            res.json({ success: true })
        } else {
            res.error('Category offer is not created')
        }
    } catch (error) {
        console.log(error);
    }
}

// Delete category offer
const deleteOffer = async (req, res) => {
    try {
        const offerCatId = req.body.offerCatId
        await Category.findByIdAndUpdate({ _id: offerCatId }, { $unset: { offer: 1 } })
        const productsData = await products.find({ category: offerCatId })
        for (let item of productsData) {
            item.price.offerPrice = item.price.regularPrice
            await item.save();
        }
        res.json({ succes: true })
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    viewCategoryPage,
    viewEditCategory,
    addCategory,
    isCategoryUnblock,
    isCategoryBlock,
    editCategory,
    viewCategoryOffer,
    createCategoryOffer,
    deleteOffer,
}

