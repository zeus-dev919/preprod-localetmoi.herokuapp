import { requestHelpers } from '@/_helpers';

export const toolboxService = {
    getAutologin,
};

function getAutologin(customerCode) {
    return requestHelpers.securedAxiosInstance.get(
        `${process.env.LOCALETMOI_BASE_URL}/api/toolbox/autologin?customerCode=${customerCode}`
    );
}
