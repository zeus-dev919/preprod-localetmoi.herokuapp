import { requestHelpers } from '@/_helpers';

export const atInternetService = {
    connect,
    getVisits,
    getSourceVisits
};

function connect() {
    return requestHelpers.securedAxiosInstance.post(
        `${process.env.WEBTOOL_BASE_URL}/oauth/atinternet/connect`
    );
}

function getVisits(atInternetId, customerCode, dateRange = null) {
    return requestHelpers.securedAxiosInstance.post(`${process.env.LOCALETMOI_BASE_URL}/api/atinternet/visits`, {
        atInternetId,
        dateRange,
        customerCode,
    });
}


function getSourceVisits(atInternetId, customerCode, dateRange = null) {
    return requestHelpers.securedAxiosInstance.post(`${process.env.LOCALETMOI_BASE_URL}/api/atinternet/source`, {
        atInternetId,
        dateRange,
        customerCode,
    });
}
