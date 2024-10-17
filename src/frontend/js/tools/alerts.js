const getAlert = () => {
    const successAlertId = $('#success_alert');
    const errorAlertId = $('#error_alert');

    return {
        successAlertId,
        errorAlertId
    }
}

const getCloseButton = () => {
    return `<button 
        type="button" 
        class="btn-close d-flex align-items-center" 
        data-bs-dismiss="alert" 
        aria-label="Close"
    >
        <i class="fa-solid fa-x"></i>
    </button>`;
}

const successAlert = (message) => {
    const {successAlertId} = getAlert();

    successAlertId.html(message + getCloseButton());
    successAlertId.removeClass('d-none');
}

const errorAlert = (message) => {
    const {errorAlertId} = getAlert();

    errorAlertId.html(message + getCloseButton());
    errorAlertId.removeClass('d-none');
}

const clearAlert = () => {
    const {successAlertId, errorAlertId} = getAlert();

    successAlertId.html('');
    successAlertId.addClass('d-none');

    errorAlertId.html('');
    errorAlertId.addClass('d-none');
}

export {
    successAlert,
    errorAlert,
    clearAlert
};