
import { errorAlert, clearAlert } from "./tools/alerts.js";

const fields = {
    'id': $('#id'),
    'firstname': $('#firstname'),
    'lastname': $('#lastname'),
    'phone': $('#phone'),
    'name': $('#name'),
    'nip': $('#nip'),
    'regon': $('#regon'),
    'city': $('#city'),
    'post_code': $('#post_code'),
    'street': $('#street'),
    'street_number': $('#street_number'),
    'apartment_number': $('#apartment_number'),
};
const save_owner = $('#save_owner');

// Komunikaty
const empty_field = 'Pole nie może być puste!';
const empty_regon_nip_field = 'Pole REGON lub NIP nie może być puste!';

function owner_validate() {
    let errors = 0;

    // Reset parametrów
    Object.keys(fields).forEach(function(key) {
        if(key == 'id') {
            return;
        }

        fields[key].removeClass('is-invalid');
        $(`#error_${key}`).text('');
    });

    // Wymagane parametry
    Object.keys(fields).forEach(function(key) {
        if(
            key === 'regon' || key === 'nip' 
            || key === 'apartment_number' || key === 'id'
        ) {
            return;
        }

        if(!fields[key].val()) {
            fields[key].addClass('is-invalid');
            $(`#error_${key}`).text(empty_field);
            errors++;
        }
    });

    // Walidacja NIP REGON
    if(!fields['nip'].val() && !fields['regon'].val()) {
        fields['nip'].addClass('is-invalid');
        fields['regon'].addClass('is-invalid');

        $(`#error_nip`).text(empty_regon_nip_field);
        $(`#error_regon`).text(empty_regon_nip_field);
        errors++;
    }

    return errors;
}

save_owner.on('click', function() {
    $(this).prop('disabled', true);

    if(owner_validate()) {
        $(this).prop('disabled', false);
        return false;
    }

    const prepare_data = {};
    Object.keys(fields).forEach(function(key) {
        prepare_data[key] = fields[key].val();
    });

    window.electronAPI.send("saveOwner", prepare_data);
});

window.electronAPI.on("saveOwnerResult", async function(status, message) {
    clearAlert();

    if(status === 'ok' && message) {
        window.location.replace(`main.html?status=ok&message=${message}`);
        return true;
    }

    $(this).prop('disabled', false);
    errorAlert(message);
});

window.electronAPI.on("getOwnerResult", async function(data) {
    if(!data) {
        return false;
    }

    Object.keys(data).forEach((key) => {
        if(fields[key]) {
            fields[key].val(data[key]);
        }
    });
});
window.electronAPI.send("getOwner");