function timestampToDate(date, separator = '-', format = 'YYYYMMDD') {
    const newDate = new Date(date * 1000);

    const day = newDate.getDate().toString().padStart(2, '0');
    const month = (newDate.getMonth() + 1).toString().padStart(2, '0');
    const year = newDate.getFullYear();

    switch(format.toUpperCase()) {
        case 'DDMMYYYY':
            return day + separator + month + separator + year;

        case 'MMDDYYYY':
            return month + separator + day + separator + year;

        case 'YYYYMMDD':
            return year + separator + month + separator + day;

        default:
            throw new Error(`Unhandle format ${format}`);
    }
} 

export default timestampToDate;