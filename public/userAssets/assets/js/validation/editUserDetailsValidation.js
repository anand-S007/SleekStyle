const fname = document.getElementById('fnameId')
const lname = document.getElementById('lnameId')
const email = document.getElementById('emailId')
const mobile = document.getElementById('mobileId')
const dob = document.getElementById('dobId')
const cpassword = document.getElementById('cpasswordId')

const fnameErr = document.getElementById('fnameErr')
const lnameErr = document.getElementById('lnameErr')
const emailErr = document.getElementById('emailErr')
const mobileErr = document.getElementById('mobileErr')
const dobErr = document.getElementById('dobErr')
const cpasswordErr = document.getElementById('passwordErr')

function fnameValidate(){
    const fnameVal = fname.value
    const pattern = /^[a-zA-Z\s\-',.]+$/
    if(fnameVal.trim()=='' ){
        fnameErr.style.display = 'block'
        fnameErr.innerHTML = '*Field must not be empty'
    }else if(!pattern.test(fnameVal)){
        fnameErr.style.display = 'block'
        fnameErr.innerHTML = '*Type letters only'
    }else if(fnameVal.length<3 || fnameVal.length>9){
        fnameErr.style.display = 'block'
        fnameErr.innerHTML = '*Should contain min 3 or max 9 characters'
    }else{
        fnameErr.style.display = 'none'
        fnameErr.innerHTML = ''
    }
}

function lnameValidate(){
    const lnameVal = lname.value
    const pattern = /^[a-zA-Z\s\-',.]+$/
    if(lnameVal.trim()=='' ){
        lnameErr.style.display = 'block'
        lnameErr.innerHTML = '*Field must not be empty'
    }else if(!pattern.test(lnameVal)){
        lnameErr.style.display = 'block'
        lnameErr.innerHTML = '*Type letters only'
    }else{
        lnameErr.style.display = 'none'
        lnameErr.innerHTML = ''
    }
}

function emailValidate(){
    emailValue = email.value
    emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    if(emailValue.trim()==''){
        emailErr.style.display = 'block'
        emailErr.innerHTML = '*Field must not be empty'
    }else if(!emailPattern.test(emailValue)){
        emailErr.style.display = 'block'
        emailErr.innerHTML = '*Please enter valid email address'
    }else{
        emailErr.style.display = 'none'
        emailErr.innerHTML = ''
    }
}

function mobileValidate(){
    mobileValue = mobile.value
    digit = /\d/
    
    if(mobileValue.trim()==''){
        mobileErr.style.display = 'block'
        mobileErr.innerHTML = '*Field must not be empty'
    }else if(mobileValue.length<10 || mobileValue.length >14){
        mobileErr.style.display = 'block'
        mobileErr.innerHTML = '*Should contain min 10 or max 14 numbers'
    }else if(!digit.test(mobileValue)){
        mobileErr.style.display = 'block'
        mobileErr.innerHTML = '*mobile number can only be digits'
    }
    else{
        mobileErr.style.display = 'none'
        mobileErr.innerHTML = ''
    }
}

function dobValidate(){
    const dobValue = dob.value
    const dobDate = new Date(dobValue)
    
    const checkAgeLimit = new Date()
    checkAgeLimit.setFullYear(checkAgeLimit.getFullYear()-16)

    if(dobValue.trim()==''){
        dobErr.style.display = 'block'
        dobErr.innerHTML = '*Field must not be empty'
    }else if(dobDate > checkAgeLimit){
        dobErr.style.display = 'block'
        dobErr.innerHTML = '*You must be atleast 16 years old'    
    }else{
        dobErr.style.display = 'none'
        dobErr.innerHTML = ''
    }
}

function cPasswordValidate(){
    const cpasswordVal = cpassword.value
    if(cpasswordVal.trim()==''){
        cpasswordErr.style.display = 'block'
        cpasswordErr.innerHTML = '*Field must not be empty'
    }else{
        cpasswordErr.style.display = 'none'
        cpasswordErr.innerHTML = ''
    }
}

fname.addEventListener('blur',fnameValidate)
lname.addEventListener('blur',lnameValidate)
email.addEventListener('blur',emailValidate)
mobile.addEventListener('blur',mobileValidate)
dob.addEventListener('blur',dobValidate)
cpassword.addEventListener('blur',cPasswordValidate)