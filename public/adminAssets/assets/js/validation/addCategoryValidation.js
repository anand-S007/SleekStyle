const catName = document.getElementById('category_name')
const catDescription = document.getElementById('category_description')
const nameError = document.getElementById('catNameError')
const descriptionError = document.getElementById('catDescriptionError')

const catFormBtn = document.getElementById('catFormBtn')

async function nameValidate(){
    try {
        const catnameVal = catName.value 
        if(catnameVal.trim()==''){
            nameError.style.display = 'block'
            nameError.innerHTML = '*Field must not be empty'
        }else{
            nameError.style.display = 'none'
            nameError.innerHTML = ''
        }
    } catch (error) {
        console.log('error found while validating category name',error);
    }
}

async function descriptionValidate(){
    catDescriptionVal = catDescription.value
    if(catDescriptionVal.trim()==''){
        descriptionError.style.display = 'block'
        descriptionError.innerHTML = '*Field must not be empty'
    }else{
        descriptionError.style.display = 'none'
        descriptionError.innerHTML = ''
    }
}

catName.addEventListener('blur',nameValidate)
catDescription.addEventListener('blur',descriptionValidate)

catFormBtn.addEventListener('click',(e)=>{
    nameValidate()
    descriptionValidate()
    if(nameError.innerHTML=='' ||
    descriptionError.innerHTML==''){
        e.preventDefault()
    }
})
