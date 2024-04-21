const email = document.getElementById('emailId')
const password = document.getElementById('passwordId')
const emailError = document.getElementById('emailError')
const passwordError = document.getElementById('passwordError')
const loginForm = document.getElementById('loginForm')

function emailValidate(){
    emailValue = email.value
    emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    if(emailValue.trim()==''){
        emailError.style.display = 'block'
        emailError.innerHTML = '*Field must not be empty'
    }else if(!(emailPattern).test(emailValue)){
        emailError.style.display = 'block'
        emailError.innerHTML = '*Invalid email format'
    }else{
        emailError.style.display = 'none'
        emailError.innerHTML = '' 
    }
}

function passwordValidate(){
    const passwordValue = password.value

    if(passwordValue.trim()==''){
        passwordError.style.display = 'block'
        passwordError.innerHTML = '*Field must not be empty'
    }else{
        passwordError.style.display = 'none'
        passwordError.innerHTML = ''
    }
}

email.addEventListener('blur',emailValidate)
password.addEventListener('blur',passwordValidate)
loginForm.addEventListener('submit',(e)=>{
    emailValidate()
    passwordValidate()
    if(emailError.innerHTML=='' || passwordError.innerHTML==''){
        e.preventDefault()
    }
})

