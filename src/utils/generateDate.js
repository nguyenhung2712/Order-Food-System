var enMonth = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];
/* var enShortMonth = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]; */

function generateLocaleDate(date, locale) {
    const curDate = new Date(date);
    const year = curDate.getFullYear();
    const month = curDate.getMonth();
    const day = curDate.getDate();
    switch (locale) {
        case "en": return enMonth[month] + " " + day + ", " + year;
        case "vi": return day + "-" + (month + 1) + "-" + year;
        default: return date;
    }
}

module.exports = { generateLocaleDate }