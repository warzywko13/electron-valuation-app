const knex = require('../../database/knexConfig');

const renderUnits = async (id) => {
    const datas = await knex
        .select()
        .from('units')
        .where({deleted: 0});
    
    let html = '';

    if(!datas) {
        return html;
    }

    html = `<select class="form-select" name="unit_id">`;

    datas.forEach((el, index) => {
        html += `<option 
            ${id == el['id'] ? 'selected' : ''} 
            value="${el['id']}"
        >${el['name']}</option>`;
    });

    html += `</select>`;

    return html;
}

const renderVats = async (id) => {
    const datas = await knex
        .select()
        .from('vats')
        .where({deleted: 0});

    let html = '';

    if(!datas) {
        return html;
    }

    html = `<select class="form-select" name="vat_id">`;

    datas.forEach((el, index) => {
        html += `<option 
            ${id == el['id'] ? 'selected' : ''} 
            value="${el['value']}" data-id="${el['id']}"
        >${el['name']}</option>`;
    });

    html += `</select>`;

    return html;
}

const renderPrice = async (el) => { 
    let id, pricing_id, name, unit_id, vat_id, count, 
    price_netto, price_sum_netto, price_vat, 
    price_brutto;      
    
    if(el) {
       ({id, pricing_id, name, unit_id, vat_id, count, 
        price_netto, price_sum_netto, price_vat,
        price_brutto} = el);
    }

    const units = await renderUnits(unit_id);
    const vats = await renderVats(vat_id)

    return `
        <tr class="pricing_row" data-rent_id="${id}">
            <td>
                <input 
                    class="form-control" 
                    type="text" 
                    name="name"
                    value="${name ?? ''}" 
                />
            </td>

            <td>
                <input 
                    class="form-control" 
                    type="number" 
                    name="count"
                    value="${count ?? 1}"
                />
            </td>
            
            <td>
                ${units}
            </td>
            
            <td>
                <input 
                    class="form-control" 
                    type="number" 
                    name="price_netto"
                    value="${price_netto ?? ''}" 
                />
            </td>

            <td>
                <input
                    class="form-control"
                    type="number"
                    name="price_sum_netto"
                    disabled
                    value="${price_sum_netto ?? ''}"
                />
            </td>

            <td>
                ${vats}
            </td>

            <td>
                <input
                    class="form-control"
                    type="number"
                    name="price_vat"
                    disabled
                    value="${price_vat ?? ''}"
                />
            </td>

            <td>
                <input
                    class="form-control"
                    type="number"
                    name="price_brutto"
                    disabled
                    value="${price_brutto ?? ''}"
                />
            </td>
            
            <td>
                <button class="price_remove btn btn-secondary">
                    <i class="fa-solid fa-minus"></i>
                </button>
            </td>
        </tr>
    `;
}

const renderEmptyPrice = () => {
    return `
        <tr>
            <td colspan="6">Brak wyników</td>
        </tr>
    `;
}

module.exports = {
    renderPrice, renderEmptyPrice
}