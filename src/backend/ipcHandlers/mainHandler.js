const { ipcMain } = require("electron");
const knex = require('../database/knexConfig');
const { event } = require("jquery");

// Helpers
const { dateToTimestamp, timestampToDate } = require('../tools/index');
// View
const { renderMainRow, renderEmptyMain } = require('../view/main/renderMain');
const { renderPagination } = require('../view/renderPagination');

const ROWS_PER_PAGE = 10;

function mainHandler(mainWindow) {
    ipcMain.on('getMainList', async (event, page, params) => {
        if(page < 1) page = 1;
        const row_per_page = ROWS_PER_PAGE;
  
        const offset = (page - 1) * row_per_page;

        let query_where = "deleted = 0 ";
        const query_params = [];

        if (params) {
            const { signature, create_from, create_to } = params;
          
            if (signature) {
                query_where += "AND id = ? ";
                query_params.push(signature);
            }
          
            if (create_from) {
                query_where += "AND strftime('%d-%m-%Y', datetime(created_at, 'unixepoch')) >= ? ";
                query_params.push(dateToTimestamp(create_from));
            }
          
            if (create_to) {
                query_where += "AND strftime('%d-%m-%Y', datetime(created_at, 'unixepoch')) <= ? ";
                query_params.push(dateToTimestamp(create_to))
            }
        }
        
        const total = await knex('pricing')
          .count('* as count')
          .whereRaw(query_where, query_params)
          .first();
        
        let render = '';
        if(Number(total.count)) {
            const data = await knex.select().from('pricing').whereRaw(query_where, query_params)
                .offset(offset)
                .limit(row_per_page)
                .orderBy('created_at', "desc");

            for (const [index, el] of data.entries()) {
                render += await renderMainRow(el, index);
            }
        } else {
            render = renderEmptyMain();
        }

        const pagination = renderPagination(page, total, Math.ceil(total.count / row_per_page));

        const result = {
            data: render,
            pagination: pagination
        };

        mainWindow.webContents.send("renderMainListResult", result);
    });

    ipcMain.on('getSignatureFilterData', async(event) => {
        const result = await knex.select({value: 'id', text: 'signature'}).from('pricing').where({deleted: 0});
        mainWindow.webContents.send("getSignatureFilterDataResult", result);
    });
}

module.exports = mainHandler;