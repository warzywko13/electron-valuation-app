const knex = require('../knexConfig');
const now = require('../../tools/now');

async function pricing() {
    const columnExists = await knex.schema.hasColumn('pricing', 'issue_date');
    if(!columnExists) {
        await knex.schema.alterTable('pricing', (t) => {
            t.bigInteger('issue_date');
        })
        .then(() => {
            console.log('Column issue_date added successfully');
        })
        .catch((error) => {
            console.error(`Error adding column: ${error.message}`);
        });

        await knex('pricing').whereNull('issue_date')
        .update({
            issue_date: knex.ref('created_at'),
            updated_at: now()
        })
        .then(() => {
            console.log('Copy created_at to issue_date')
        })
        .catch((error) => {
            console.error(`Error adding column: ${error.message}`);
        });
    }
}

module.exports = pricing;