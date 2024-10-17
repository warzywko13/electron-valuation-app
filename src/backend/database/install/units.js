const knex = require('../knexConfig');
const { now } = require('../../tools/index');

function units() {
    const createUnitsTable = () => {
        return knex.schema.createTable('units', function (t) {
            t.increments('id').primary();
            t.string('name');

            t.integer('deleted').defaultTo(0);
            t.bigInteger('created_at');
            t.bigInteger('updated_at');
            t.bigInteger('deleted_at');
        }).then(function() {
            return knex.insert([
                {name: 'Usługa', created_at: now()}, 
                {name: 'm²', created_at: now()},
                {name: 'm³', created_at: now()}
            ]).into('units');
        });
    }

    knex.schema.hasTable("units").then(function (exists) {
        if(!exists) {
            return createUnitsTable();
        }
    });
}

module.exports = units;