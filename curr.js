let dropdowns = document.querySelectorAll('.dropdown select')

let btn = document.querySelector('form button')
let fromCurr = document.querySelector('.from select')
let toCurr  = document.querySelector('.to select')
let amount = document.querySelector('.amount input')
let result = document.querySelector('.msg')

let toFlag = document.querySelector(".toFlag img")
let fromFlag = document.querySelector(".fromFlag img")
let switchCurr = document.querySelector(".switchBtn i")

/* create option with currencycode */
for(select of dropdowns){
    for (currCode in countryList){
        let newOption = document.createElement('option')
        newOption.innerText = currCode
        newOption.value = currCode

        if(select.name === 'from' && currCode === 'USD'){
            newOption.selected = 'selected'
        }else if(select.name==='to' && currCode === 'INR'){
            newOption.selected = 'selected'
        }
        select.append(newOption)
    }

    select.addEventListener('change',(e)=>{
        updateFlag(e.target)
    })
}

/* update flag according to currCode */
let updateFlag = (el) => {
    let currCode = el.value //INR USD
    let countryCode = countryList[currCode] //IN US
    let newImgsrc = `https://flagsapi.com/${countryCode}/flat/64.png`; 
    let img  =  el.parentElement.querySelector('img')
    img.src= newImgsrc
}

/* convert currency */
let convertCurrency = async() =>{
    let fromValue = fromCurr.value
    let toValue = toCurr.value
    let amt =  amount.value

    if(!amt || amt<1){
        amount.value = 1
    }

    let url = `https://v6.exchangerate-api.com/v6/202e3d7b44fffc985a25f214/latest/${fromValue}`;

    try{
        let response = await fetch(url)
        let data = await response.json()
        let exchangeRate = data.conversion_rates[toValue] //1USD = 85INR
        let convertedAmount = (amt * exchangeRate).toFixed(2)
        result.innerText = `${amt} ${fromValue} = ${convertedAmount} ${toValue}`;
    }
    catch(err){
        result.innerText('Fetching Error')
    }

}

btn.addEventListener('click',(e)=>{
    e.preventDefault();
    convertCurrency();
})

window.addEventListener('load',()=>{
    convertCurrency()
})

/* switch button */
switchCurr.addEventListener('click', () => {
    // Use temporary variables to store the values during the swap
    let tempCurr = fromCurr.value;
    let tempFlag = fromFlag.src
    // Swap currency codes
    fromCurr.value = toCurr.value;
    toCurr.value = tempCurr
    // Swap flags
    fromFlag.src = toFlag.src;
    toFlag.src = tempFlag;

    convertCurrency();
});