const { ipcMain } = require("electron");
const knex = require('../database/knexConfig');
const { event } = require("jquery");
const now = require('../tools/now');

function settingsHandler(mainWindow) {
    const settings_updated = "Ustawienia zostały zaktualizowane";
    const settings_saved = "Ustawienia zostały zapisane";

    ipcMain.on('saveOwner', async (event, data) => {
        let status = 'error';
        let message = '';

        const record_id = data.id;
        delete data.id

        if(record_id) {
            data.updated_at = now();

            await knex('settings')
                .where('id', '=', record_id)
                .update(data)
                .then(() => {
                    status = 'ok';
                    message = settings_updated;
                })
                .catch((e) => {
                    status = 'error';
                    message = `Wystąpił błąd podczas aktualizacji: <br/>${e}`;
                });            
        } else {
            data.created_at = now();
            
            await knex('settings')
                .insert([data])
                .then(() => {
                    status = 'ok';
                    message = settings_saved;
                })
                .catch((e) => {
                    status = 'error';
                    message = `Wystąpił błąd podczas zapisu: <br/>${e}`;
                }) ;
        }

        mainWindow.webContents.send("saveOwnerResult", status, message);
    });

    ipcMain.on('getOwner', async (event) => {
        const data = await knex.select().table('settings')
            .where({deleted: 0})
            .limit(1)
            .first();

        mainWindow.webContents.send("getOwnerResult", data);
    });
}

module.exports = settingsHandler;