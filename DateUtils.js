const DateUtils = {
    MONTH_NAMES: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octobre', 'Noviembre', 'Diciembre'
    ],
    DAYS_OF_WEEK: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    CURRENT_YEAR: new Date().getFullYear(),
    CURRENT_MONTH: new Date().getMonth() + 1,
    CURRENT_DAY: new Date().getDay(),
    CURRENT_DAY_OF_WEEK: new Date().getDate(),        
    getDayOfWeek: (year, month, day)=>{
        let date = new Date()
        date.setFullYear(year)
        date.setMonth(month)
        date.setDate(day)
        return DateUtils.DAYS_OF_WEEK[date.getDay()]
    } 
}
export default DateUtils