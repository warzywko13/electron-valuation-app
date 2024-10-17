const timestampToDate = (date) => {
    const newDate = new Date(date * 1000);

    const day = newDate.getDate().toString().padStart(2, '0');
    const month = (newDate.getMonth() + 1).toString().padStart(2, '0');
    const year = newDate.getFullYear();

    return `${day}.${month}.${year}`;
} 

module.exports = timestampToDate;