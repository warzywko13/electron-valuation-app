const {version, settings, units, vats, pricing, rents, signatures} = require("./install/index");

function installTable() {
    version();
    settings();

    units();
    vats();
    signatures();

    pricing();
    rents();
}

module.exports = installTable;