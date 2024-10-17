const renderPagination = (page, total, last_page) => {
    let pagination = `
        <nav>
            <ul class="pagination">`;

    if(page == 1) {
        pagination += `
            <li class="page-item">
                <a class="page-link active" data-page="${page}">${page}</a>
            </li>
        `;
        
        if(last_page > 1) {
            pagination += `
                <li class="page-item">
                    <a class="page-link" data-page="${page+1}">${page+1}</a>
                </li>
            `;
        }

        if(last_page > 2) {
            pagination += `
                <li class="page-item">
                    <a class="page-link" data-page="${page+2}">${page+2}</a>
                </li>
            `;
        }

        if(last_page > 3) {
            pagination += `
                <li class="page-item">
                    <a class="page-link" data-page="${last_page}">Ostatnia</a>
                </li>
            `;
        }
    } else if(page == last_page) {
        if(page - 3 > 0) {
            pagination += `
                <li class="page-item">
                    <a class="page-link" data-page="1">Pierwsza</a>
                </li>
            `;
        }

        if(page - 2 > 0) {
            pagination += `
                <li class="page-item">
                    <a class="page-link" data-page="${page-2}">${page-2}</a>
                </li>
            `;
        }

        if(page - 1 > 0) {
            pagination += `
                <li class="page-item">
                    <a class="page-link" data-page="${page-1}">${page-1}</a>
                </li>
            `;
        }

        pagination += `
            <li class="page-item">
                <a class="page-link active" data-page="${page}">${page}</a>
            </li>
        `;
    } else {
        if(page - 2 > 0) {
            pagination += `
                <li class="page-item">
                    <a class="page-link" data-page="1">Pierwsza</a>
                </li>
            `;
        }

        if(page - 1 > 0) {
            pagination += `
                <li class="page-item">
                    <a class="page-link" data-page="${page-1}">${page-1}</a>
                </li>
            `;
        }

        pagination += `
            <li class="page-item">
                <a class="page-link active" data-page="${page}">${page}</a>
            </li>
        `;

        if(last_page > page) {
            pagination += `
                <li class="page-item">
                    <a class="page-link" data-page="${page+1}">${page+1}</a>
                </li>
            `;
        }

        if(last_page > page + 1) {
            pagination += `
                <li class="page-item">
                    <a class="page-link" data-page="${last_page}">Ostatnia</a>
                </li>
            `;
        }
    }

    pagination += `</ul>
            </nav>
        `;

    return pagination;
}


module.exports = { renderPagination };