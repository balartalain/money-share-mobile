const currency=[{value: 'USD'}, {value: 'CUP'}]
const equalsIntegers = (a, b)=>{
    return parseInt(a) === parseInt(b)
}  
const color = {
    //primaryGreen: '#3EB489',
    primaryGreen: '#009988'
}

const formatNumber = amount => {
    return Number(amount)
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$&,')
}
export {
    color,
    currency,
    equalsIntegers,
    formatNumber
}