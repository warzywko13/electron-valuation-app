const getParams = (searchName) => {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);

    const result = params.get(searchName);
    return result;
}

export default getParams;