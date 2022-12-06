module.exports = {
    formatDate(date) {
        let dd = date.getDate();
        let mm = date.getMonth() + 1;
        if (1 === mm.toString().length) {
            mm = '0' + mm;
        }
        if (1 === dd.toString().length) {
            dd = '0' + dd;
        }
        let yyyy = date.getFullYear();

        return yyyy + '-' + mm + '-' + dd;
    },
    usToFrDate(date) {
        return date.substr(8, 2) + '/' + date.substr(5, 2) + '/' + date.substr(0, 4);
    },
    formatApiUrl(url, agency) {
        if (!agency || '' === agency) {
            return `${url}&timestamp=${new Date().getTime()}`;
        }

        let key = (agency || '').normalize("NFD")
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .replace(/^agence /i, '')
            .replace(/ /g, '-');
        if ('' !== key && url) {
            url = url.replace(/localfr/, `localfr-${key}`);
        }

        return `${url}&timestamp=${new Date().getTime()}`;
    },
    jsonToXml(json) {
        if (!json) {
            return '';
        }

        return Object.keys(json).map(key => `<${key}>${json[key]}</${key}>`).join('');
    },
}
