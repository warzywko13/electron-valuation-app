const { ipcMain, dialog } = require("electron");
const fs = require('fs');
const knex = require('../database/knexConfig');


function pricingPDFHandler(mainWindow) {
    ipcMain.on('getDataForPDF', async function(event, id) {
        const result = {
            status: 'error',
            message: 'Wystąpił błąd podczas pobrania danych <br>',
            data: null
        };

        // Pobranie danych
        const data = await knex
            .select()
            .from('pricing')
            .where({
                deleted: 0,
                id
            })
            .first()
            .catch((reason) => {
                result.message += `${reason}`;
                return mainWindow.webContents.send('getDataForPDFResult', result);
            });
        
        // Pobranie tabelki
        const rents = await knex
            .select(
                'pricingRents.id',
                'pricingRents.name',
                'units.name as unit',
                'vats.name as vat',
                'pricingRents.count',
                'pricingRents.price_netto',
                'pricingRents.price_sum_netto',
                'pricingRents.price_vat',
                'pricingRents.price_brutto'
            )
            .from('pricingRents')
            .leftJoin('units', 'pricingRents.unit_id', 'units.id')
            .leftJoin('vats', 'pricingRents.vat_id', 'vats.id')
            .where({
                'pricingRents.deleted': 0,
                'units.deleted': 0,
                'vats.deleted': 0,
                'pricingRents.pricing_id': id,
            })
            .catch(async (reason) => {
                result.message += `${reason}`;
                return mainWindow.webContents.send('getDataForPDFResult', result);
            });

        data.rents = rents;

        // Przygotowanie danych
        result.data = data;
        result.status = 'ok';
        result.message = '';

        mainWindow.webContents.send('getDataForPDFResult', result);
    });
}

module.exports = pricingPDFHandler;