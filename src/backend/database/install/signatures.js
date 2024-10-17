const knex = require('../knexConfig');
const { now } = require('../../tools/index');

function signatures() {
    const createSignaturesTable = () => {
        knex.schema.createTable('signatures', function (t) {
            t.increments('id').primary();
            t.string('name');
            t.bigInteger('number').defaultTo(1);
            t.integer('year');

            t.integer('deleted').defaultTo(0);
            t.bigInteger('created_at');
            t.bigInteger('updated_at');
            t.bigInteger('deleted_at');
        }).then(() => {
            const year = new Date().getFullYear();

            return knex.insert([
                {name: 'OF', number: 1, year: year, created_at: now()}
            ]).into('signatures');
        });
    }

    knex.schema.hasTable("signatures").then(function (exists) {
        if(!exists) {
            return createSignaturesTable();
        }
    });
}

module.exports = signatures;