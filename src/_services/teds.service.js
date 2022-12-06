import { requestHelpers } from '@/_helpers';
import { store } from '@/_store';

export const tedsService = {
    getAutologin,
    getRefreshToken,
    verifyToken
};

function setBoutiqueUrl(response) {
    if (response.error) {
        console.error(response.error.message, response);
        return null;
    }

    localStorage.setItem('userBoutique', JSON.stringify(response.token));
    store.dispatch('globalStore/setPartnerBoutiqueUrl', response.link);
    return response.link;
}

function getAutologin(customerCode, userEmail, websiteLink) {
    return requestHelpers.securedAxiosInstance.get(
        `${process.env.LOCALETMOI_BASE_URL}/teds/authorization`,
        {
            params: {
                customerCode: customerCode,
                email: userEmail,
                url: websiteLink
            }
        },
    ).then(response => {
        setBoutiqueUrl(response);
        verifyToken(customerCode, websiteLink);
    });
}

function getRefreshToken(customerCode, url) {
    const userBoutique = JSON.parse(localStorage.getItem('userBoutique'));
    return requestHelpers.axiosInstance.post(
        `${process.env.LOCALETMOI_BASE_URL}/teds/refresh-user-token`,
        {
            userBoutique,
            customerCode,
            url
        }
    ).then(response => {
        setBoutiqueUrl(response);
    });
}

function verifyToken(customerCode, url) {
    const userBoutique = JSON.parse(localStorage.getItem('userBoutique'));
    const tokenCheckInterval = 5;
    const now = new Date();
    const expiryDate = new Date(now.getTime() + userBoutique.expires_in * 1000);

    if (userBoutique && userBoutique.access_token) {
        try {
            setInterval(() => {
                const expires = expiryDate.getTime() - Date.now();
                if (expires > 600) {
                    return;
                }

                return getRefreshToken(customerCode, url);
            },  tokenCheckInterval * 60 * 1000);
        } catch (error) {
            console.error(error);
        }
    }

    return null;
}

