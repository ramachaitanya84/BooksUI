function TextLength (inputText, elementId, allowedLength) {
    
    element(elementId).className = "cardValidText";

    element(elementId).innerText = "( " + inputText.length + " / " + allowedLength + " characters)";

    if(inputText.length > allowedLength) {
        element(elementId).className = "cardErrorText";

        return false;
    }
    
    return true;
}

function CheckCurrency (currencyValue, elemmentId) {
    if( currencyValue <= 0) {
        element(elemmentId).style.color = "Red";
        return false;
    }
    else{
        element(elemmentId).style.color = "Black";
        return true;
    }

}