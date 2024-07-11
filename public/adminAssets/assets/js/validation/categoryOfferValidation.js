function nameValidate() {
    const offerName = document.getElementById('offerNameId').value
    const offerNameErr = document.getElementById('offerNameErr')
    const regexPattern = /^[A-Za-z\s]+$/

    if (offerName.trim() == '') {
        offerNameErr.style.display = 'block'
        offerNameErr.innerText = '*Field must not be empty'
    }
    else if (!regexPattern.test(offerName)) {
        offerNameErr.style.display = 'block'
        offerNameErr.innerText = '*Invalid format'
    } else if (offerName.length < 3) {
        offerNameErr.style.display = 'block'
        offerNameErr.innerText = '*Minimum 3 letters required'
    } else {
        offerNameErr.style.display = 'none',
            offerNameErr.innerText = ''
    }
}

function setDigitLimit() {
    const discountPercentInput = document.getElementById('discountPercentId');
    let discountPercent = parseFloat(discountPercentInput.value);
    if (discountPercent > 100) {
        discountPercent = 100;
        discountPercentInput.value = discountPercent;
    }
}

function discountValidate() {
    const discountPercentInput = document.getElementById('discountPercentId');
    const discountPercentErr = document.getElementById('discountPercentErr');
    const discountPercent = discountPercentInput.value.trim();

    if (discountPercent === '') {
        discountPercentErr.style.display = 'block';
        discountPercentErr.innerText = '*Field must not be empty';
    } else {
        discountPercentErr.style.display = 'none';
        discountPercentErr.innerText = '';
    }
}

function dateValidate(){
    const date = document.getElementById('expiryDateId').value
    const dateErr = document.getElementById('expiryDateErr')
    if(date.trim() == ''){
        dateErr.style.display = 'block'
        dateErr.innerText = '*Field must not be empty'
    }else{
        dateErr.style.display = 'none'
        dateErr.innerText = ''
    }
}