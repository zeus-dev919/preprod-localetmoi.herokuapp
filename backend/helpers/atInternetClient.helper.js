module.exports = {
    formatQueryParamsV2(params) {
        return Object.keys(params).map(offset => `${offset}=${params[offset]}`).join('&');
    },
    formatQueryParamsV3(params) {
        return JSON.stringify(params);
    },
}
