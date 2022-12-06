import { requestHelpers } from '@/_helpers';

export const ovhService = {
    checkDomainAvailability
};

function checkDomainAvailability(domain) {
    return requestHelpers.securedAxiosInstance.get(`${process.env.LOCALETMOI_BASE_URL}/api/ovh/check/${domain}`);
}
