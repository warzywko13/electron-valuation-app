const { timestampToDate } = require('../../tools/index');

const renderMainRow = (el, index) => {
    const {id, signature, title, issue_date} = el;
    const formatData = timestampToDate(issue_date);

    index++;

    return `
        <tr class="main_row">
          <td>${signature ?? '-'}</td>
          <td>${formatData ?? '-'}</td>
          <td>${title ?? '-'}</td>
          <td>
            <div class="d-flex flex-wrap gap-1 justify-content-center">
                <a data-id="${id}" class="download-price btn btn-secondary"><i class="fa-solid fa-eye"></i></a>
                <a href="pricing.html?id=${id}" class="btn btn-secondary"><i class="fa-solid fa-gear"></i></a>
            </div>
          </td>
        </tr>
    `;
}

const renderEmptyMain = () => {
    return `
        <tr>
            <td colspan="4">Nie dodałeś/aś jeszcze żadnej wyceny.</td>
        </tr>
    `;
}

module.exports = {
    renderMainRow, renderEmptyMain
}