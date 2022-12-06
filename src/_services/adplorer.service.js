import { requestHelpers } from '@/_helpers';

export const adplorerService = {
    getAdwordsData,
    getCustomerInformation
};

function getAdwordsData(customerCode, agency, startDate, endDate) {
    return requestHelpers.securedAxiosInstance.post(
        `${process.env.LOCALETMOI_BASE_URL}/api/adplorer/adwords`,
        { customerCode, agency, startDate, endDate }
    );
}

function getCustomerInformation(customerCode, agency) {
    return requestHelpers.securedAxiosInstance.get(
        `${process.env.LOCALETMOI_BASE_URL}/api/adplorer/customer/information`,
        {
            params: {
                customerCode,
                agency
            }
        }
    );
}
