const {version, settings, units, vats, pricing, rents, signatures} = require("./update/index");

function updateTable() {
    settings();
    
    units();
    vats();
    signatures();
    
    pricing();
    rents();
    
    version();
}   

module.exports = updateTable;