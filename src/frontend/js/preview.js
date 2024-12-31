import getParams from "./tools/getParams.js";
import { errorAlert, clearAlert } from "./tools/alerts.js";
import generatePDF from "./tools/generatePDF.js";

// Na wejściu
document.addEventListener("DOMContentLoaded", function() {
    const id = getParams('id');
    if(!id) {
       return; 
    }

    window.electronAPI.send('getDataForPDF', id);
});

window.electronAPI.on('getDataForPDFResult', function(result) {
    const {status, message, data} = result;
    
    clearAlert();
    if(status !== 'ok') {
        errorAlert(message);
        return false;
    }

    document.getElementById('preview_pdf').src = generatePDF(data);
});

