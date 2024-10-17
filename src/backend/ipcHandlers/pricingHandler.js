const { ipcMain } = require("electron");
const knex = require('../database/knexConfig');
const { event } = require("jquery");

// Helpers
const { now } = require('../tools/index');
// Views
const { renderPrice, renderEmptyPrice } = require('../view/price/renderPrice');

const SIGNATURE_NAME = 'OF';

function pricingHandler(mainWindow) {
    const createSignature = async () => {   
        const current_year = new Date().getFullYear();
        const signature = await knex.select()
            .from('signatures')
            .where({deleted: 0, name: SIGNATURE_NAME, year: current_year})
            .first()
            .catch(reason => {
                const result = {
                    status: 'error',
                    message: `Wystąpił błąd podczas pobierania sygnatury <br> ${reason}`
                };
    
                return mainWindow.webContents.send(
                    "savePricingResult", 
                    result
                );
            });
    
        // If signature for current yeardoesnt exists create
        if(!signature) {
            await knex.insert({
                name: SIGNATURE_NAME,
                number: 1,
                year: current_year,
                created_at: now()
            })
            .into('signatures')
            .catch(reason => {
                const result = {
                    status: 'error',
                    message: `Wystąpił błąd podczas dodawania nowej sygnatury <br> ${reason}`
                };
    
                return mainWindow.webContents.send(
                    "savePricingResult", 
                    result
                );
            });
    
            return createSignature();
        }
    
        const {id, name, number, year} = signature;
    
        signature.number++;
        // Update signature
        await knex('signatures')
            .where('id', '=', id)
            .update(signature)
            .catch(reason => {
                const result = {
                    status: 'error',
                    message: `Wystąpił błąd podczas aktualizacji sygnatury <br> ${reason}`
                };
    
                return mainWindow.webContents.send(
                    "savePricingResult", 
                    result
                );
            });
    
    
        return `${name}/${number}/${year}`;
    }

    ipcMain.on('renderPricing', async (event) => {
        const result = await renderPrice();
        mainWindow.webContents.send("renderPricingResult", result);
    });

    ipcMain.on('renderEmptyPricing', (event) => {
        const result = renderEmptyPrice();
        mainWindow.webContents.send("renderPricingResult", result);
    });

    /* Zapisanie wyceny */
    ipcMain.on('savePricing', async (event, price) => {
        const result = {
            status: 'error',
            message: `Wystąpił błąd podczas aktualizacji wyceny`
        };

        // Pobranie z settingsów
        const setting_price = await knex.select({
            setting_name: 'name', 
            setting_firstname: 'firstname',
            setting_lastname: 'lastname',
            setting_phone: 'phone',
            setting_nip: 'nip', 
            setting_regon: 'regon', 
            setting_city: 'city', 
            setting_street: 'street', 
            setting_street_number: 'street_number', 
            setting_apartment_number: 'apartment_number', 
            setting_post_code: 'post_code'
        }).from('settings')
        .where('deleted', '=', '0')
        .first();

        setting_price.title = price.title;

        //Jesli nie ma error
        if(!setting_price) {
            result.message = `Brak ustawionego kontrahenta w ustawieniach. Proszę o jego uprzednie uzupełnienie`;

            mainWindow.webContents.send(
                "savePricingResult",
                result
            );

            return false;
        }

        if(price.id) {
            setting_price.updated_at = now();

            await knex('pricing')
                .where('id', '=', price.id)
                .update(setting_price)
                .catch(reason => {
                    result.message = `Wystąpił błąd podczas aktualizacji wyceny <br> ${reason}`;

                    return mainWindow.webContents.send(
                        "savePricingResult", 
                        result
                    );
                });

            // Create the new price list
            const newPriceList = price.rents.map((el) => el.id);

            // Get the old price list from the database
            const oldPrice = await knex.select().from('pricingRents').where({'deleted': 0, 'pricing_id': price.id});
            const oldPriceList = oldPrice.map((el) => el.id);

            // Find prices that are in oldPriceList but not in newPriceList
            const pricesToDelete = oldPriceList.filter(oldPriceId => !newPriceList.includes(oldPriceId));
            if (pricesToDelete.length > 0) {
                await knex('pricingRents')
                    .whereIn('id', pricesToDelete)
                    .update({deleted: 1})
                    .catch(() => {
                        return mainWindow.webContents.send(
                            "savePricingResult", 
                            result
                        );
                    });
            }
        } else {
            setting_price.signature = await createSignature();
            setting_price.created_at = now();

            const result = await knex('pricing')
                .insert([setting_price])
                .returning('id')
                .catch(reason => {
                    result.message = `Wystąpił błąd podczas aktualizacji wyceny <br> ${reason}`;

                    return mainWindow.webContents.send(
                        "savePricingResult", 
                        result
                    );
                });

            price.id = result[0].id;
        }

        // Aktualizacja dodanie elementów
        for (const [index, el] of price.rents.entries()) {
            el.pricing_id = price.id;

            if(el.id !== undefined && el.id !== "undefined") {
                await knex('pricingRents')
                    .where('id', '=', el.id)
                    .update(el)
                    .then(() => {
                        result.status = 'ok';
                        result.message = 'Wycena zaktualizowana pomyślnie.';
                    })
                    .catch(reason => {
                        result.message = `Wystąpił błąd podczas aktualizacji wyceny <br> ${reason}`;

                        return mainWindow.webContents.send(
                            "savePricingResult", 
                            result
                        );
                    });
            } else {
                delete el.id;

                await knex('pricingRents')
                    .insert([el])
                    .then(() => {
                        result.status = 'ok';
                        result.message = 'Wycena dodana pomyślnie';
                    })
                    .catch(reason => {
                        result.message = `Wystąpił błąd podczas aktualizacji wyceny <br> ${reason}`;

                        mainWindow.webContents.send(
                            "savePricingResult", 
                            result
                        );
                    });
            }
        }

        mainWindow.webContents.send(
            "savePricingResult", 
            result
        );
    });

    /* Usuwanie wyceny */
    ipcMain.on('deletePricing', async(event, id) => {
        const result = {
            status: 'error',
            message: `Wystąpił błąd podczas usuwania wyceny <br>`
        };

        // Usuwanie listy
        await knex('pricingRents')
            .where({deleted: 0, pricing_id: id})
            .update({deleted: 1})
            .catch((error) => {
                result.message += error;

                return mainWindow.webContents.send(
                    "deletePricingResult", 
                    result
                ); 
            });

        // Usuwanie pricing
        await knex('pricing')
            .where({deleted: 0, id: id})
            .update({deleted: 1})
            .catch((error) => {
                result.message += error;

                return mainWindow.webContents.send(
                    "deletePricingResult", 
                    result
                );
            })
            .then(() => {
                result.status = 'ok';
                result.message = 'Wycena została pomyślnie usunięta';
            });

        return mainWindow.webContents.send(
            "deletePricingResult", 
            result
        );
    });

    /* Pobranie elementu */
    ipcMain.on('getPricing', async (event, id) => {
        const result = {
            status: 'error',
            message: 'Wystąpił błąd podczas pobrania danych',
            data: null
        };

        const where = {
            'deleted': 0,
            'id': id
        };

        const data = await knex
            .select()
            .from('pricing')
            .where(where)
            .first()
            .catch((reason) => {
                result.message += `<br>${reason}`;
                return mainWindow.webContents.send('getPricingResult', result);
            });

        result.status = 'ok';
        result.message = '';
        result.data = data;

        mainWindow.webContents.send('getPricingResult', result);
    });

    /* Pobranie Listy */
    ipcMain.on('getPricingList', async (event, id) => {
        const where = {
            'deleted': 0,
            'pricing_id': id
        };
        let result = '';

        const data = await knex
            .select()
            .from('pricingRents')
            .where(where);
        if(data.length !== 0) {
            for (const [index, el] of data.entries()) {
                result += await renderPrice(el);
            }
        } else {
            result = renderEmptyPrice();
        }
        
        mainWindow.webContents.send("getPricingListResult", result);
    });
}

module.exports = pricingHandler;