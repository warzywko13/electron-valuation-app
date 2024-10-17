import getParams from "./tools/getParams.js";
import { successAlert, errorAlert, clearAlert } from "./tools/alerts.js";
import pricing_pdf from "./pricing_pdf.js";

window.electronAPI.on("renderMainListResult", async function(result) {
    const {data, pagination} = result;

    $('#main_container').html(data);
    $('#main_pagination').html(pagination);
});

// Zmiana strony
$('#main_pagination').on('click', 'a.page-link', function(e) {
    e.preventDefault();

    const page = $(this).data('page');
    if(!page) {
        return false;
    }

    window.electronAPI.send("getMainList", page);
});

// Usuwanie
$('#main_container').on('click', 'a.remove-price', function() {
    clearAlert();

    if(confirm('Czy na pewno chcesz usunąć tę ocenę?')) {
        const id = $(this).data('id');
        if(!id) {
            errorAlert('Wystąpił błąd podczas usuwania wyceny');
            return false;
        }

        window.electronAPI.send('deletePricing', id);
    }
});

window.electronAPI.on('deletePricingResult', function(result) {
    const {status, message} = result;

    (status === 'ok')
        ? successAlert(message)
        : errorAlert(message);

    const page = $('#main_pagination a.page-link.active').data('page');
    window.electronAPI.send("getMainList", page);
});

// Generowanie PDF
$('#main_container').on('click', 'a.download-price', function() {
    const id = $(this).data('id');

    window.electronAPI.send('getDataForPDF', id);
});

window.electronAPI.on('getDataForPDFResult', function(result) {
    const {status, message, data} = result;
    
    clearAlert();
    if(status !== 'ok') {
        errorAlert(message);
        return false;
    }

    pricing_pdf(data);
});

// Filtry
const select = new SlimSelect({
    select: '#signature',
    settings: {
        allowDeselect: true,
        placeholderText: 'Wybierz',
    }
});

$('#filter_reset_btn').on('click', function() {
    select.setSelected();
    $('#create_from').val('');
    $('#create_to').val('');

    window.electronAPI.send("getMainList", 1);
});

$('#filter_btn').on('click', function() {
    const create_from = $('#create_from');
    const create_to = $('#create_to');

    clearAlert();

    create_from.removeClass('is-invalid');
    create_to.removeClass('is-invalid');

    if(new Date(create_from.val()) > new Date(create_to.val())) {
        errorAlert('Data od jest większa niż do!');

        create_from.addClass('is-invalid');
        create_to.addClass('is-invalid');

        return false;
    }

    const params = {
        signature: select.getSelected()[0],
        create_from: create_from.val(),
        create_to: create_to.val()
    }

    window.electronAPI.send("getMainList", 1, params);
});

window.electronAPI.on("getSignatureFilterDataResult", function(result) {
    // Clear data
    select.setData([]);

    // Load data
    select.setData(result);

    // Set empty
    select.setSelected();
});

// Na wejściu
document.addEventListener("DOMContentLoaded", function() {
    window.electronAPI.send("getMainList", 1);

    const status = getParams('status');
    const message = getParams('message');
    
    if(status === 'ok') {
        successAlert(message);
    } else if(status === 'error') {
        errorAlert(message);
    }

    window.electronAPI.send("getSignatureFilterData");
});