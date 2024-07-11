const catName = document.getElementById('category_name')
const catDescription = document.getElementById('category_description')
const nameError = document.getElementById('catNameError')
const descriptionError = document.getElementById('catDescriptionError')

const catFormBtn = document.getElementById('catFormBtn')

async function nameValidate(){
    try {
        const catnameVal = catName.value 
        const catNamePattern = /^[a-zA-Z]+$/
        if(catnameVal.trim()==''){
            nameError.style.display = 'block'
            nameError.innerHTML = '*Field must not be empty'
        }else if(!catNamePattern.test(catnameVal)){
            nameError.style.display = 'block'
            nameError.innerHTML = '*Only alphabets allowed'
        }
        else{
            nameError.style.display = 'none'
            nameError.innerHTML = ''
        }
    } catch (error) {
        console.log('error found while validating category name',error);
    }
}

async function descriptionValidate(){
    catDescriptionVal = catDescription.value
    catDescriptionPattern = /^[a-zA-Z]+$/
    if(catDescriptionVal.trim()==''){
        descriptionError.style.display = 'block'
        descriptionError.innerHTML = '*Field must not be empty'
    }else if(!catDescriptionPattern.test(catDescriptionVal)){
        descriptionError.style.display = 'block'
        descriptionError.innerHTML = '*Only alphabets allowed'
    }else{
        descriptionError.style.display = 'none'
        descriptionError.innerHTML = ''
    }
}

catName.addEventListener('blur',nameValidate)
catDescription.addEventListener('blur',descriptionValidate)


