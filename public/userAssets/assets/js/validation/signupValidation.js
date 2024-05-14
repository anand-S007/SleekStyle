const singupForm = document.getElementById('signup_form')

const fname = document.getElementById('fname_id')
const lname = document.getElementById('lname_id')
const email = document.getElementById('email_id')
const mobile = document.getElementById('mobile_id')
const dob = document.getElementById('dob_id')
const password = document.getElementById('password_id')
const confirmPassword = document.getElementById('confirmPassword_id')

const fnameError = document.getElementById('fname_error')
const lnameError = document.getElementById('lname_error')
const emailError = document.getElementById('email_error')
const mobileError = document.getElementById('mobile_error')
const dobError = document.getElementById('dob_error')
const passwordError = document.getElementById('password_error')
const confirmPasswordError = document.getElementById('confirmPassword_error')

function fnameValidate(){
    fnameValue = fname.value
    const pattern = /^[a-zA-Z\s\-',.]+$/
    if(fnameValue.trim()=='' ){
        fnameError.style.display = 'block'
        fnameError.innerHTML = '*Field must not be empty'
    }else if(!pattern.test(fnameValue)){
        fnameError.style.display = 'block'
        fnameError.innerHTML = '*Type letters only'
    }else if(fnameValue.length<3 || fnameValue.length>9){
        fnameError.style.display = 'block'
        fnameError.innerHTML = '*Should contain min 3 or max 9 characters'
    }else{
        fnameError.style.display = 'none'
        fnameError.innerHTML = ''
    }
}

function lnameValidate(){
    lnameValue = lname.value
    const pattern = /^[a-zA-Z\s\-',.]+$/
    if(lnameValue.trim()=='' ){
        lnameError.style.display = 'block'
        lnameError.innerHTML = '*Field must not be empty'
    }else if(!pattern.test(lnameValue)){
        lnameError.style.display = 'block'
        lnameError.innerHTML = '*Type letters only'
    }else if(lnameValue.length>9){
        lnameError.style.display = 'block'
        lnameError.innerHTML = '*Should contain min 3 or max 9 characters'
    }else{
        lnameError.style.display = 'none'
        lnameError.innerHTML = ''
    }
}

function emailValidate(){
    emailValue = email.value
    emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    if(emailValue.trim()==''){
        emailError.style.display = 'block'
        emailError.innerHTML = '*Field must not be empty'
    }else if(!emailPattern.test(emailValue)){
        emailError.style.display = 'block'
        emailError.innerHTML = '*Please enter valid email address'
    }else{
        emailError.style.display = 'none'
        emailError.innerHTML = ''
    }
}

function mobileValidate(){
    mobileValue = mobile.value
    digit = /\d/
    
    if(mobileValue.trim()==''){
        mobileError.style.display = 'block'
        mobileError.innerHTML = '*Field must not be empty'
    }else if(mobileValue.length<10 || mobileValue.length >14){
        mobileError.style.display = 'block'
        mobileError.innerHTML = '*Should contain min 10 or max 14 numbers'
    }else if(!digit.test(mobileValue)){
        mobileError.style.display = 'block'
        mobileError.innerHTML = '*mobile number can only be digits'
    }
    else{
        mobileError.style.display = 'none'
        mobileError.innerHTML = ''
    }
}

function dobValidate(){
    const dobValue = dob.value
    const dobDate = new Date(dobValue)
    const dobPattern = /^\d{4}-\d{2}-\d{2}$/;
    
    const checkAgeLimit = new Date()
    checkAgeLimit.setFullYear(checkAgeLimit.getFullYear()-16)

    if(dobValue.trim()==''){
        dobError.style.display = 'block'
        dobError.innerHTML = '*Field must not be empty'
    }else if(!dobPattern.test(dobValue)){
        dobError.style.display = 'block'
        dobError.innerHTML = '*Please fill valid Date of Birth'
    }else if(dobDate > checkAgeLimit){
        dobError.style.display = 'block'
        dobError.innerHTML = '*You must be atleast 16 years old'    
    }else{
        dobError.style.display = 'none'
        dobError.innerHTML = ''
    }
}

function passwordValidate(){
    const passwordValue = password.value
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

    if(passwordValue.trim()==''){
        passwordError.style.display = 'block'
        passwordError.innerHTML = '*Field must not be empty'
    }else if(passwordValue.length < 8 || passwordValue  > 14){
        passwordError.style.display = 'block'
        passwordError.innerHTML = "*Password must be at least 8 or atmost 14 characters long."
    }else if(!passwordRegex.test(passwordValue)){
        passwordError.style.display = 'block'
        passwordError.innerHTML = "*Password must contain atleast<br> one special characters<br> one lowercase letter<br> one uppercase letter<br> and one digit"
    }else{
        passwordError.style.display = 'none'
        passwordError.innerHTML = ''
    }
}

function confirmPasswordValidate(){
    const confimrPasswordValue = confirmPassword.value
    if(confimrPasswordValue.trim()==''){
        confirmPasswordError.style.display = 'block'
        confirmPasswordError.innerHTML = '*Field must not be empty'
    }else if(confimrPasswordValue !== password.value){
        confirmPasswordError.style.display = 'block'
        confirmPasswordError.innerHTML = '*password not match'
    }
}

fname.addEventListener('blur',fnameValidate)
lname.addEventListener('blur',lnameValidate)
email.addEventListener('blur',emailValidate)
mobile.addEventListener('blur',mobileValidate)
dob.addEventListener('blur',dobValidate)
password.addEventListener('blur',passwordValidate)
confirmPassword.addEventListener('blur',confirmPasswordValidate)

// singupForm.addEventListener('submit',(e)=>{
//     console.log('singupForm')
//     fnameValidate()
//     lnameValidate()
//     emailValidate()
//     mobileValidate()
//     dobValidate()
//     passwordValidate()
//     confirmPasswordValidate()
//     if(fnameError.innerHTML=='' || 
//         lnameError.innerHTML=='' || 
//         emailError.innerHTML=='' || 
//         mobileError.innerHTML=='' ||
//         dobError.innerHTML=='' ||
//         passwordError.innerHTML=='' ||
//         confirmPasswordError.innerHTML==''){
//             console.log('hello')
//             e.preventDefault()
//             return
//         }

// })