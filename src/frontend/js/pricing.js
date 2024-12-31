import getParams from "./tools/getParams.js";
import { errorAlert, clearAlert } from "./tools/alerts.js";
import now from "./tools/now.js";
import timestampToDate from "./tools/timestampToDate.js";

const save_pricing = $('#save_pricing');

const pricing_container = $('#pricing_container');
const pricing_footer_netto_sum = $('#pricing_footer_netto_sum');
const pricing_footer_vat_sum = $('#pricing_footer_vat_sum');
const pricing_footer_brutto_sum = $('#pricing_footer_brutto_sum');
const price_add = $('#price_add');

// Dodawanie nowego rekordu
price_add.on('click', async function() {
    window.electronAPI.send("renderPricing");
});
window.electronAPI.on("renderPricingResult", async function(pricing_row) {
    const pricing_count = $('.pricing_row').length;

    pricing_count
        ? pricing_container.append(pricing_row)
        : pricing_container.html(pricing_row);
});

// Usuwanie rekordów
pricing_container.on('click', '.price_remove', async function() {
    $(this).closest('tr').remove();
    
    const pricing_count = $('.pricing_row').length;
    if(!pricing_count) {
        window.electronAPI.send("renderEmptyPricing");
    }

    countRents();
});

// Pobranie danych z formularza
const getFormData = () => {
    const price = {
        id: $('#price').data('price_id'),
        title: $('#title').val(),
        issue_date: $('#issue_date').val(),
        rents: []
    };

    pricing_container.find('.pricing_row').each(function() {
        const rent = {
            id: $(this).data('rent_id'),
            name: $(this).find('input[name="name"]').val(),
            unit_id: $(this).find('select[name="unit_id"]').val(),
            vat_id: $(this).find('select[name="vat_id"] option:selected').data('id'),
            count: $(this).find('input[name="count"]').val(),
            price_netto: $(this).find('input[name="price_netto"]').val(),
            price_sum_netto: $(this).find('input[name="price_sum_netto"]').val(),
            price_vat: $(this).find('input[name="price_vat"]').val(),
            price_brutto: $(this).find('input[name="price_brutto"]').val()
        };

        price.rents.push(rent);
    });

    return price;
}

// Walidacja danych z formularza
const formValidate = (price) => {
    let errors = 0;

    const pricing_rows = $('#pricing_container .pricing_row');

    // Reset głównego komunikatu o errorze
    clearAlert();

    // Reset parametrów formularz
    Object.keys(price).forEach(function(key) {
        if(key == 'rents' || key == 'id') {
            return;
        }

        $(`#${key}`).removeClass('is-invalid');
        $(`#error_${key}`).text('');
    });

    // Reset parametrów tabela
    price['rents'].forEach((el, index) => {
        Object.keys(el).forEach(key => {
            if(key == 'id') {
                return;
            }

            $(pricing_rows[index])
                .find(`[name='${key}']`)
                .removeClass('is-invalid');
        });
    });

    // Walidacja czy uzupełnione
    Object.keys(price).forEach(key => {
        if(key == 'rents' || key == 'id' || key == 'title') {
            return;
        }

        if(!price[key]) {
            $(`#${key}`).addClass('is-invalid');
            $(`#error_${key}`).text('Pole nie może być puste!');
            errors++;
        }
    });

    // Walidacja tabeli
    if(price['rents'].length == 0) {
        errorAlert('Tabela wyceny musi zawierać przynajmniej 1 wiersz!');
        errors++;
    } else {
        price['rents'].forEach((el, index) => {
            Object.keys(el).forEach(key => {
                if(key == 'id') {
                    return;
                }

                if(!el[key]) {
                    $(pricing_rows[index])
                        .find(`[name='${key}']`)
                        .addClass('is-invalid');
                    errors++;
                }
            });
        });
    }

    return errors ? false : true;
}

// Wyliczanie sumy dla wszystkich rekordów
const countTotalRents = () => {
    let total_netto_sum = 0;
    let total_vat_sum = 0;
    let total_brutto_sum = 0;

    $('#pricing_container .pricing_row').each((index, el) => {
        const row = $(el);

        // Wartość netto
        let netto_sum = row.find(`[name="price_sum_netto"]`).val();
        netto_sum = isNaN(netto_sum) ? 0 : parseFloat(netto_sum);
        total_netto_sum += netto_sum;

        // Kwota VAT
        let vat_sum = row.find(`[name="price_vat"]`).val();
        vat_sum = isNaN(vat_sum) ? 0 : parseFloat(vat_sum);
        total_vat_sum += vat_sum;

        // Wartość brutto
        let brutto_sum = row.find(`[name="price_brutto"]`).val();
        brutto_sum = isNaN(brutto_sum) ? 0 : parseFloat(brutto_sum);
        total_brutto_sum += brutto_sum;
    });

    // Zaokrąglenie wyników do 2 miejsc po przecinku
    total_netto_sum = total_netto_sum.toFixed(2);
    total_vat_sum = total_vat_sum.toFixed(2);
    total_brutto_sum = total_brutto_sum.toFixed(2);

    pricing_footer_netto_sum.text(total_netto_sum);
    pricing_footer_vat_sum.text(total_vat_sum);
    pricing_footer_brutto_sum.text(total_brutto_sum);
}


// Wyliczanie sumy
const countRents = (row) => {

    // Wyliczanie sumy dla pojedyńczego rekordus
    const countForRow = (row) => {
        // Wartość netto
        const count = row.find(`[name="count"]`).val();
        const price_netto = row.find(`[name="price_netto"]`).val();
        const price_sum_netto = row.find(`[name="price_sum_netto"]`);

        let result_sum_netto = count * price_netto;
        if(isNaN(result_sum_netto)) {
            result_sum_netto = 0;
        }
        price_sum_netto.val(result_sum_netto.toFixed(2));

        // Kwota VAT
        const vat = row.find(`[name="vat_id"]`).val();
        const price_vat = row.find(`[name="price_vat"]`);

        let result_vat = price_sum_netto.val() * vat;
        if(isNaN(result_vat)) {
            result_vat = 0;
        }
        price_vat.val(result_vat.toFixed(2));

        // Wartość brutto
        const price_brutto = row.find(`[name="price_brutto"]`);

        let result_brutto = parseFloat(price_sum_netto.val()) + parseFloat(price_vat.val());
        if(isNaN(result_brutto)) {
            result_brutto = 0;
        }
        price_brutto.val(result_brutto.toFixed(2));
    }

    if (row) {
        countForRow(row)
    } else {
        $('#pricing_container .pricing_row').each((index, el) => {
            const row = $(el);
            countForRow(row);
        });
    }

    countTotalRents();
}

// Automatyczne wyliczanie sumy
$('#pricing_container').on('change', '[name="count"], [name="price_netto"], [name="vat_id"]', function() {
    const row = $(this).closest('.pricing_row');
    countRents(row);
});

// Zapisz
save_pricing.on('click', function() {
    $(this).prop('disabled', true);
        
    const price = getFormData();

    if(!formValidate(price)) {
        $(this).prop('disabled', false);
        return false;
    }

    window.electronAPI.send("savePricing", price);
});

window.electronAPI.on('savePricingResult', function(result) {
    const {status, message} = result;

    if(status === 'ok') {
        window.location.replace(`main.html?status=ok&message=${message}`);
        return true;
    }

    save_pricing.prop('disabled', false);
    errorAlert(message);
});

// Na wejściu
document.addEventListener("DOMContentLoaded", function() {
    const id = getParams('id')
    if(!id) {
        // Ustaw datę wydania na dzisiejszą
        $('#issue_date').val(timestampToDate(now()));
        return;
    }

    window.electronAPI.send("getPricing", id);
    window.electronAPI.send("getPricingList", id);
});

window.electronAPI.on('getPricingResult', function({status, message, data}) {
    if(status === 'error' || data.length === 0) {
        window.location.replace(`main.html?status=error&message=${message}`);
        return false;
    }

    const {
        id,
        signature,
        title,
        issue_date
    } = data;

    $('#signature_container label').removeClass('d-none');
    $('#signature_container #signature').removeClass('d-none');

    $('#price').data('price_id', id);
    $('#title').val(title);
    $('#signature').val(signature);
    $('#issue_date').val(issue_date ? timestampToDate(issue_date): "");
});

window.electronAPI.on("getPricingListResult", function(result) {
    pricing_container.html(result);
    countRents();
});