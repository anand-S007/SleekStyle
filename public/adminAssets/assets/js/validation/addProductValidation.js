const productName = document.getElementById('product_name')
const description = document.getElementById('product_des')
const categories = document.getElementById('category_id')
const regularPrice = document.getElementById('regular_price')
const offerPrice = document.getElementById('offer_price')
const small = document.getElementById('small_size')
const medium = document.getElementById('medium_size')
const large = document.getElementById('large_size')
const image = document.getElementById('image_id')

const nameErr = document.getElementById('nameError')
const desErr = document.getElementById('desError')
const catErr = document.getElementById('catError')
const regErr = document.getElementById('regPriceError')
const offErr = document.getElementById('offPriceError')
const smallErr = document.getElementById('smallError')
const mediumErr = document.getElementById('mediumError')
const largeErr = document.getElementById('largeError')
const imageErr = document.getElementById('imageError')

const productForm = document.getElementById('productForm')

function nameValidate() {
    const nameVal = productName.value
    const pattern = /^[A-Za-z\s]+$/
    if (nameVal.trim() == '') {
        nameErr.style.display = 'block'
        nameErr.innerHTML = 'Field must not be empty'
    } else if (!pattern.test(nameVal)) {
        nameErr.style.display = 'block'
        nameErr.innerHTML = '*Invalid format'
    } else {
        nameErr.style.display = 'none'
        nameErr.innerHTML = ''
    }
}

function desValidate() {
    const desVal = description.value
    const pattern = /^[A-Za-z\s.,'-]+$/
    if (desVal.trim() == '') {
        desErr.style.display = 'block'
        desErr.innerHTML = '*Field must not be empty'
    } else if (!pattern.test(desVal)) {
        desErr.style.display = 'block'
        desErr.innerHTML = '*Invalid format'
    } else {
        desErr.style.display = 'none'
        desErr.innerHTML = ''
    }
}

function catValidate() {
    const catVal = categories.value

    if (catVal === '') {
        catErr.style.display = 'block'
        catErr.innerHTML = '*Select any category'
    } else {
        catErr.style.display = 'none'
        catErr.innerHTML = ''
    }
}

function regPriceValidate() {
    const regPriceVal = regularPrice.value
    const pattern = /^\d+$/;
    if (regPriceVal.trim() == '') {
        regErr.style.display = 'block'
        regErr.innerHTML = '*Field must not be empty'
    } else if (!pattern.test(regPriceVal)) {
        regErr.style.display = 'block'
        regErr.innerHTML = '*Type digits only'
    } else {
        regErr.style.display = 'none'
        regErr.innerHTML = ''
    }
}

function offerPriceValidate() {
    const offPriceVal = offerPrice.value
    const pattern = /^\d+$/;
    if (offPriceVal.trim() == '') {
        offErr.style.display = 'block'
        offErr.innerHTML = '*Field must not be empty'
    } else if (!pattern.test(offPriceVal)) {
        offErr.style.display = 'block'
        offErr.innerHTML = '*Type digits only'
    } else {
        offErr.style.display = 'none'
        offErr.innerHTML = ''
    }
}

function sizeSvalidate() {
    const smallVal = small.value
    const pattern = /^\d+$/;
    if (smallVal.trim() == '') {
        smallErr.style.display = 'block'
        smallErr.innerHTML = '*Field must not be empty'
    } else if (!pattern.test(smallVal)) {
        smallErr.style.display = 'block'
        smallErr.innerHTML = '*Type digits only'
    } else {
        smallErr.style.display = 'none'
        smallErr.innerHTML = ''
    }
}

function sizeMvalidate() {
    const mediumVal = medium.value
    const pattern = /^\d+$/;
    if (mediumVal.trim() == '') {
        mediumErr.style.display = 'block'
        mediumErr.innerHTML = '*Field must not be empty'
    } else if (!pattern.test(mediumVal)) {
        mediumErr.style.display = 'block'
        mediumErr.innerHTML = '*Type digits only'
    } else {
        mediumErr.style.display = 'none'
        mediumErr.innerHTML = ''
    }
}

function sizeLvalidate() {
    const largeVal = large.value
    const pattern = /^\d+$/;
    if (largeVal.trim() == '') {
        largeErr.style.display = 'block'
        largeErr.innerHTML = '*Field must not be empty'
    } else if (!pattern.test(largeVal)) {
        largeErr.style.display = 'block'
        largeErr.innerHTML = '*Type digits only'
    } else {
        largeErr.style.display = 'none'
        largeErr.innerHTML = ''
    }
}

// function imageValidate(){
//     const images = image.files
//     console.log('imgae is validating');
//     if(images.length<5 || images.length>5){
//         imageErr.style.display= 'block'
//         imageErr.innerHTML = '*Minimum and maximum 5 images should add'
//     }else{
//         imageErr.style.display= 'none'
//         imageErr.innerHTML = ''
//     }
// }

productName.addEventListener('blur', nameValidate);
description.addEventListener('blur', desValidate)
categories.addEventListener('blur', catValidate)
regularPrice.addEventListener('blur', regPriceValidate)
offerPrice.addEventListener('blur', offerPriceValidate)
small.addEventListener('blur', sizeSvalidate)
medium.addEventListener('blur', sizeMvalidate)
large.addEventListener('blur', sizeLvalidate)
// image.addEventListener('blur',imageValidate)

productForm.addEventListener('submit', (e) => {
    nameValidate()
    desValidate()
    catValidate()
    regPriceValidate()
    offerPriceValidate()
    sizeSvalidate()
    sizeMvalidate()
    sizeLvalidate()

    if (nameErr.style.display == 'block' ||
        catErr.style.display == 'block' ||
        desErr.style.display == 'block' ||
        regErr.style.display == 'block' ||
        offErr.style.display == 'block' ||
        smallErr.style.display == 'block' ||
        mediumErr.style.display == 'block' ||
        largeErr.style.display == 'block') {
        e.preventDefault()
        return
    }
})