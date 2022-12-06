import {
    requestHelpers
} from '@/_helpers';
import {store} from '@/_store';
export const microWebService = {
    getUberallAutologin,
    getListings,
};

function getUberallAutologin(email, page) {
    const url = `${process.env.LOCALETMOI_BASE_URL}/micro-services-api/uberall/autologin`;
    return requestHelpers.securedAxiosInstance.post(
        url,
        {
            accountEmail: email || store.state.account.identity.email,
            page: page || null
        }
    );
}

function getListings() {
    const url = `${process.env.LOCALETMOI_BASE_URL}/micro-services-api/uberall/autologin`;
    return requestHelpers.securedAxiosInstance.post(
        url,
        {
            accountEmail: store.state.account.identity.email
        }
    );
}
