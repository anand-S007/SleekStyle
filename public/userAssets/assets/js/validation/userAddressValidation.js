const Name = document.getElementById('nameId')
const mobile = document.getElementById('mobileId')
const pincode =document.getElementById('pincodeId')
const locality = document.getElementById('localityId')
const address = document.getElementById('addressId')
const district = document.getElementById('districtId')
const state = document.getElementById('stateId')

const form = document.getElementById('formData')
const editbtn = document.getElementById('editbtn')

const nameErr = document.getElementById('name_error')
const mobileErr = document.getElementById('phone_error')
const pincodeErr = document.getElementById('pincode_error')
const localityErr = document.getElementById('locality_error')
const addressErr = document.getElementById('address_error')
const districtErr = document.getElementById('district_error')
const stateErr = document.getElementById('state_error') 

function nameValidate(e){
    const nameVal = Name.value
    const pattern = /^[a-zA-Z\s\-',.]+$/
    if(nameVal.trim()=='' ){
        nameErr.style.display = 'block'
        nameErr.innerHTML = '*Field must not be empty'
    }else if(!pattern.test(nameVal)){
        nameErr.style.display = 'block'
        nameErr.innerHTML = '*Type letters only'
    }else if(nameVal.length<3 || nameVal.length>9){
        nameErr.style.display = 'block'
        nameErr.innerHTML = '*Should contain min 3 or max 9 characters'
    }else{
        nameErr.style.display = 'none'
        nameErr.innerHTML = ''
    }
}

function mobileValidate(e){
    const mobileVal = mobile.value
    digit = /\d/
    
    if(mobileVal.trim()==''){
        mobileErr.style.display = 'block'
        mobileErr.innerHTML = '*Field must not be empty'
    }else if(mobileVal.length<10 || mobileVal.length >14){
        mobileErr.style.display = 'block'
        mobileErr.innerHTML = '*Should contain min 10 or max 14 numbers'
    }else if(!digit.test(mobileVal)){
        mobileErr.style.display = 'block'
        mobileErr.innerHTML = '*mobile number can only be digits'
    }
    else{
        mobileErr.style.display = 'none'
        mobileErr.innerHTML = ''
    }
}

function pincodeValidate(e){
    const pincodeVal = pincode.value
    digit = /\d/
    
    if(pincodeVal.trim()==''){
        pincodeErr.style.display = 'block'
        pincodeErr.innerHTML = '*Field must not be empty'
    }else if(pincodeVal.length<6 || pincodeVal.length >10){
        pincodeErr.style.display = 'block'
        pincodeErr.innerHTML = '*Should contain min 6 or max 10 numbers'
    }else if(!digit.test(pincodeVal)){
        pincodeErr.style.display = 'block'
        pincodeErr.innerHTML = '*Pincode can only be digits'
    }
    else{
        pincodeErr.style.display = 'none'
        pincodeErr.innerHTML = ''
    }
}

function localityValidate(e){
    const localityVal = locality.value
    const pattern = /^[a-zA-Z\s\-',.]+$/
    if(localityVal.trim()=='' ){
        localityErr.style.display = 'block'
        localityErr.innerHTML = '*Field must not be empty'
    }else if(!pattern.test(localityVal)){
        localityErr.style.display = 'block'
        localityErr.innerHTML = '*Type letters only'
    }else if(localityVal.length>20){
        localityErr.style.display = 'block'
        localityErr.innerHTML = '*Max 20 characters only allowed'
    }else{
        localityErr.style.display = 'none'
        localityErr.innerHTML = ''
    }
}

function addressValidate(e){
    const addressVal = address.value
    const pattern = /^[a-zA-Z\s\-',.]+$/
    if(addressVal.trim()=='' ){
        addressErr.style.display = 'block'
        addressErr.innerHTML = '*Field must not be empty'
    }else if(!pattern.test(addressVal)){
        addressErr.style.display = 'block'
        addressErr.innerHTML = '*Type letters only'
    }else{
        addressErr.style.display = 'none'
        addressErr.innerHTML = ''
    }
}

function districtValidate(e){
    const districtVal = district.value
    const pattern = /^[a-zA-Z\s\-',.]+$/
    if(districtVal.trim()=='' ){
        districtErr.style.display = 'block'
        districtErr.innerHTML = '*Field must not be empty'
    }else if(!pattern.test(districtVal)){
        districtErr.style.display = 'block'
        districtErr.innerHTML = '*Type letters only'
    }else if(districtVal.length>20){
        districtErr.style.display = 'block'
        districtErr.innerHTML = '*Max 20 characters only allowed'
    }else{
        districtErr.style.display = 'none'
        districtErr.innerHTML = ''
    }
}

function stateValidate(e){
    const stateVal = state.value
    const pattern = /^[a-zA-Z\s\-',.]+$/
    if(stateVal.trim()=='' ){
        stateErr.style.display = 'block'
        stateErr.innerHTML = '*Field must not be empty'
    }else if(!pattern.test(stateVal)){
        stateErr.style.display = 'block'
        stateErr.innerHTML = '*Type letters only'
    }else if(stateVal.length>20){
        stateErr.style.display = 'block'
        stateErr.innerHTML = '*Max 20 characters only allowed'
    }else{
        stateErr.style.display = 'none'
        stateErr.innerHTML = ''
    }
}

Name.addEventListener('blur',nameValidate)
mobile.addEventListener('blur',mobileValidate)
pincode.addEventListener('blur',pincodeValidate)
locality.addEventListener('blur',localityValidate)
address.addEventListener('blur',addressValidate)
district.addEventListener('blur',districtValidate)
state.addEventListener('blur',stateValidate)
