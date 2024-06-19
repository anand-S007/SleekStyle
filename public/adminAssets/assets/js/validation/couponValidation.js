const couponName = document.getElementById('nameId')
const code = document.getElementById('codeId')
const discountPercent = document.getElementById('discountPercentId')
const maxDiscount = document.getElementById('maxDiscountId')
const minPurchase = document.getElementById('minPurchaseId')
const expiryDate = document.getElementById('expiryDateId')

const nameErr = document.getElementById('nameErr')
const codeErr = document.getElementById('codeErr')
const discountPercentErr = document.getElementById('discountPercentErr')
const maxDiscountErr = document.getElementById('maxDiscountErr')
const minPurchaseErr = document.getElementById('minPurchaseErr')
const expiryDateErr = document.getElementById('expiryDateErr')

const couponBtn = document.getElementById('couponBtnId')

function nameValidate(){
    const nameVal = couponName.value
    const pattern = /^[a-zA-Z0-9\s\-&,.'()!@#\$%^*]+$/i
    if(nameVal.trim()==''){
        nameErr.style.display = 'block'
        nameErr.innerHTML = 'Field must not be empty'
    }else if(!pattern.test(nameVal)){
        nameErr.style.display = 'block'
        nameErr.innerHTML = '*Formt is invalid'
    }else{
        nameErr.style.display = 'none'
        nameErr.innerHTML = ''
    }
}

function codeValidate(){
    const codeVal = code.value
    const pattern = /^[A-Z]+$/
    if(codeVal.trim()==''){
        codeErr.style.display = 'block'
        codeErr.innerHTML = 'Field must not be empty'
    }else if(!pattern.test(codeVal)){
        codeErr.style.display = 'block'
        codeErr.innerHTML = '*Only uppercase allowed'
    }else if(codeVal.length > 15){
        codeErr.style.display = 'block'
        codeErr.innerHTML = '*Max 15 letters allowed'
    }else{
        codeErr.style.display = 'none'
        codeErr.innerHTML = ''
    }
}

function expiryDateValidate(){
    const expiryDateVal = expiryDate.value
    if(expiryDateVal.trim()==''){
        expiryDateErr.style.display = 'block'
        expiryDateErr.innerHTML = '*Field must not be empty'
    }else{
        expiryDateErr.style.display = 'none'
        expiryDateErr.innerHTML = ''
    }
}

function discountPercentValidate(){
    const discountPercentVal = discountPercent.value
    if(discountPercentVal.trim()==''){
        discountPercentErr.style.display = 'block'
        discountPercentErr.innerHTML = '*Field must not be empty'
    }else{
        discountPercentErr.style.display = 'none'
        discountPercentErr.innerHTML = ''
    }
}

function maxDiscountValidate(){
    const maxDiscountVal = maxDiscount.value
    if(maxDiscountVal.trim()==''){
        maxDiscountErr.style.display = 'block'
        maxDiscountErr.innerHTML = '*Field must not be empty'
    }else{
        maxDiscountErr.style.display = 'none'
        maxDiscountErr.innerHTML = ''
    }
}

function minPurchaseValidate(){
    const minPurchaseVal = minPurchase.value
    if(minPurchaseVal.trim()==''){
        minPurchaseErr.style.display = 'block'
        minPurchaseErr.innerHTML = '*Field must not be empty'
    }else{
        minPurchaseErr.style.display = 'none'
        minPurchaseErr.innerHTML = ''
    }
}

couponName.addEventListener('blur',nameValidate)
code.addEventListener('blur',codeValidate)
discountPercent.addEventListener('blur',discountPercentValidate)
expiryDate.addEventListener('blur',expiryDateValidate)
maxDiscount.addEventListener('blur',maxDiscountValidate)
minPurchase.addEventListener('blur',minPurchaseValidate)

// couponBtn.addEventListener('click',(e)=>{
//     e.preventDefault()
//     nameValidate()
//     codeValidate()
//     discountPercentValidate()
//     expiryDateValidate()
//     maxDiscountValidate()
//     minPurchaseValidate()
//     if(nameErr.style.display == 'block'||
//         codeErr.style.display == 'block'||
//         discountPercentErr.style.display == 'block'||
//         expiryDateErr.style.display == 'block'||
//         maxDiscountErr.style.display == 'block'||
//         minPurchaseErr.style.display == 'block'){
//         return
//     }
// })