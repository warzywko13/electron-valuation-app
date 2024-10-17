const path = require('path');
const { app } = require("electron");
const knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: path.join(app.getPath('userData'), 'database.sqlite')
  },
  useNullAsDefault: true
});

module.exports = knex;