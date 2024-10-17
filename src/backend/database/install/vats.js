const knex = require('../knexConfig');
const { now } = require('../../tools/index');

function vats() {
    const createVatsTable = () => {
        return knex.schema.createTable('vats', function(t) {
            t.increments('id').primary();
            t.string('name');
            t.decimal('value', 2);

            t.integer('deleted').defaultTo(0);
            t.bigInteger('created_at');
            t.bigInteger('updated_at');
            t.bigInteger('deleted_at');
        }).then(function() {
            return knex.insert([
                {name: "23%", value: 0.23, created_at: now()},
                {name: "8%", value: 0.08, created_at: now()},
                {name: "5%", value: 0.05, created_at: now()},
                {name: "0%", value: 1, created_at: now()}
            ]).into('vats');
        });
    }

    knex.schema.hasTable('vats').then(function (exists) {
        if(!exists) {
            return createVatsTable();
        }
    });
}

module.exports = vats;