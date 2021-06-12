const currency=[{value: 'USD'}, {value: 'CUP'}];
const equalsIntegers = (a, b)=>{
    return parseInt(a) === parseInt(b);
  }  
const color = {
    //primaryGreen: '#3EB489',
    primaryGreen: '#009988'
}
const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octobre", "Noviembre", "Diciembre"
];
const dayOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const currentYear = new Date().getFullYear(),
currentMonth = new Date().getMonth(),
currenteDay = new Date().getDay(),
currenteDayOfWeek = new Date().getDate();
export {
    currentYear,
    currentMonth,
    currenteDay,
    currenteDayOfWeek,
    color,
    monthNames,
    dayOfWeek,
    currency,
    equalsIntegers
}