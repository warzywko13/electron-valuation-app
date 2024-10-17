const knex = require('../knexConfig');

function settings() {
    const createSettingsTable = () => {
        return knex.schema.createTable('settings', function (t) {
            t.increments('id').primary();
            t.string('name');
            t.string('firstname');
            t.string('lastname');
            t.string('phone');
            t.string('nip');
            t.string('regon');
            t.string('city');
            t.string('street');
            t.integer('street_number');
            t.integer('apartment_number');
            t.integer('post_code');
            
            t.integer('deleted').defaultTo(0);
            t.bigInteger('created_at');
            t.bigInteger('updated_at');
            t.bigInteger('deleted_at');
        });
    }

    knex.schema.hasTable("settings").then(function (exists) {
        if(!exists) {
            return createSettingsTable();
        }
    });
}

module.exports = settings;