/* Return Y-m-d in timestamp */
function now() {
    const currentDate = new Date().toISOString().split('T')[0];
    const timestamp = Math.floor(new Date(`${currentDate}T00:00:00Z`).getTime() / 1000);

    return timestamp;
}

module.exports = now;