import {
    requestHelpers
} from '@/_helpers';

export const webtoolService = {
    getSubscriptions,
    getSubscription,
    updateSubscription,
    deleteSubscription,
    createSubscription,
    exportCsv,
    getNewsletterNbr,
    getContactMessages,
    getCountContactMessages,
    isWebsiteOnline,
    getWebsitePublicationDate,
};

function getContactMessages () {
    return requestHelpers.securedAxiosInstance.get(
        `${process.env.WEBTOOL_BASE_URL}/oauth/messages`
    );
}

function getCountContactMessages () {
    return requestHelpers.securedAxiosInstance.get(
        `${process.env.WEBTOOL_BASE_URL}/oauth/messages/count`
    );
}

function getSubscriptions() {
    const url = `${process.env.WEBTOOL_BASE_URL}/oauth/subscriptions`;
    return requestHelpers.securedAxiosInstance.get(url);
}

function getSubscription(id) {
    const url = `${process.env.WEBTOOL_BASE_URL}/oauth/subscription/${id}`;
    return requestHelpers.securedAxiosInstance.get(url);
}

function updateSubscription(subscription) {
    const url = `${process.env.WEBTOOL_BASE_URL}/oauth/subscription/${subscription.id}`;
    return requestHelpers.securedAxiosInstance.post(url, subscription);
}

function createSubscription(subscription) {
    const url = `${process.env.WEBTOOL_BASE_URL}/oauth/subscription`;
    return requestHelpers.securedAxiosInstance.post(url, subscription);
}

function deleteSubscription(id) {
    const url = `${process.env.WEBTOOL_BASE_URL}/oauth/subscription/${id}`;
    return requestHelpers.securedAxiosInstance.delete(url);
}

function exportCsv(domainName) {
    const url = `${process.env.WEBTOOL_BASE_URL}/oauth/subscriptions/csv`;
    return requestHelpers.securedAxiosInstance.get(url, {
        params: {
            domainName: domainName
        }
    });
}

function getNewsletterNbr() {
    const url = `${process.env.WEBTOOL_BASE_URL}/oauth/subscriptions/count`;
    return requestHelpers.securedAxiosInstance.get(url);
}

function isWebsiteOnline(domainName) {
    const url = `${process.env.WEBTOOL_BASE_URL}/oauth/domainName/isOnline`;
    return requestHelpers.securedAxiosInstance.get(url, {
        params: {
            domainName: domainName
        }
    });
}

function getWebsitePublicationDate(domainName) {
    const url = `${process.env.WEBTOOL_BASE_URL}/oauth/domainName/publicationDate`;
    return requestHelpers.securedAxiosInstance.get(url, {
        params: {
            domainName: domainName
        }
    }).then(response => response ? response.date : null);
}
