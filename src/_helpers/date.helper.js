import moment from 'moment';

export const dateHelpers = {
    format,
    strDateToObject,
    formatDropboxDate,
    dateToStringForInput,
    getNextDayDate,
    formatSFBriefDate,
    usToFrDate,
    fromMonthNumberToLabel,
    toISODate,
    months,
};

const months = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre'
];

function format(dateStr) {
    const date = new Date(Date.parse(dateStr));

    return date.toLocaleDateString();
}

function toISODate(date) {
    return moment(date).format('YYYY-MM-DD');
}

function strDateToObject(stringDate) {
    if (!stringDate) {
        return null;
    }

    return new Date(stringDate);
}

function formatDropboxDate() {
    let date = new Date().toLocaleDateString();

    return date.split('/').join('.')
}

function dateToStringForInput(date) {
    let formatDate = new Date(date);
    formatDate = formatDate.toISOString().substr(0, 10);

    return formatDate;
}

/**
 * @param {Date} date
 * @returns {Date}
 */
function getNextDayDate(date) {
    date = new Date(date);
    return new Date(date.setDate(date.getDate() + 1));
}

function formatSFBriefDate(date) {
    return date ? moment(date).format('DD/MM/YYYY à HH[h]mm') : null; 
}

function usToFrDate(date) {
    return date.substr(8, 2) + '/' + date.substr(5, 2) + '/' + date.substr(0, 4);
}

function fromMonthNumberToLabel(monthNumber) {
    return months[monthNumber];
}
