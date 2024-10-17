const version = require("./version");
const settings = require("./settings");

const pricing = require("./pricing");
const rents = require("./pricingRents");
const units = require("./units");
const vats = require("./vats");
const signatures = require("./signatures");

module.exports = {
    version, settings, pricing,
    rents, units, vats, signatures
}