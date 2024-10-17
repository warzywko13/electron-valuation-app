const knex = require('../knexConfig');

function pricing() {
    const createPricingTable = () => {
        return knex.schema.createTable('pricing', function (t) {
            t.increments('id').primary();
            t.string('signature');

            t.string('title');
            
            t.string('setting_name');
            t.string('setting_firstname');
            t.string('setting_lastname');
            t.string('setting_phone');
            t.string('setting_nip');
            t.string('setting_regon');
            t.string('setting_city');
            t.string('setting_street');
            t.integer('setting_street_number');
            t.integer('setting_apartment_number');
            t.string('setting_post_code');

            t.integer('deleted').defaultTo(0);
            t.bigInteger('created_at');
            t.bigInteger('updated_at');
            t.bigInteger('deleted_at');
        });
    }

    knex.schema.hasTable("pricing").then(function (exists) {
        if(!exists) {
            return createPricingTable();
        }
    });
}

module.exports = pricing;