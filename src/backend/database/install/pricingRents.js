const knex = require('../knexConfig');

function rents() {
    const createRentsTable = () => {
        return knex.schema.createTable('pricingRents', function (t) {
            t.increments('id').primary();
            t.integer('pricing_id').unsigned();
            t.string('name');
            t.integer('unit_id');
            t.float('count');
            t.decimal('price_netto', 2);
            t.decimal('price_sum_netto', 2);
            t.integer('vat_id');
            t.decimal('price_vat', 2);
            t.decimal('price_brutto', 2);

            t.integer('deleted').defaultTo(0);
            t.bigInteger('created_at');
            t.bigInteger('updated_at');
            t.bigInteger('deleted_at');

            t.foreign('pricing_id').references('id').inTable('pricingRents');
            t.foreign('unit_id').references('id').inTable('units');
            t.foreign('vat_id').references('id').inTable('vats');
        });
    }

    knex.schema.hasTable("pricingRents").then(function (exists) {
        if(!exists) {
            return createRentsTable();
        }
    });
}

module.exports = rents;