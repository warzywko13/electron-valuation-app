function dateToTimestamp(dateString) {
    return Math.floor(new Date(dateString).getTime() / 1000);
}

module.exports = dateToTimestamp;