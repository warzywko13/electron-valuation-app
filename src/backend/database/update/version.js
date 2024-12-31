const knex = require('../knexConfig');
const getVersion = require("../../tools/getVersion");
const now = require("../../tools/now");

async function version() {
    await knex('version')
            .where({ id: 1 })
            .update({ name: getVersion(), updated_at: now() });
}

module.exports = version;