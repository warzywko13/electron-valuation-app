const knex = require('../knexConfig');
const { now } = require('../../tools/index');
const getVersion = require('../../tools/getVersion');

function version() {
    const createVersionTable = () => {
        return knex.schema.createTable('version', function (t) {
            t.increments('id').primary();
            t.string('name');
            t.bigInteger('created_at');
            t.bigInteger('updated_at');
        }).then(function() {
            return knex.insert([
                {name: getVersion(), created_at: now()}
            ]).into('version');
        });
    }

    knex.schema.hasTable("version").then(function (exists) {
        if(!exists) {
            return createVersionTable();
        }
    });
}

module.exports = version;