
const electronApp = require('electron').app;

function getVersion() {
    return electronApp.getVersion();
}

module.exports = getVersion;