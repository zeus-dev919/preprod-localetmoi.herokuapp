import { store } from '@/_store';
import router from '@/router';
import {
    encryptorHelpers,
    requestHelpers,
    authDpHelper
} from '@/_helpers';
import { salesforceService, socketService } from '@/_services';

export const userService = {
    changePassword,
    checkToken,
    impersonateLogin,
    impersonateLogout,
    login,
    logout,
    me,
    refreshToken,
    disconnectUserFromSocket
};

function disconnectUserFromSocket (customerCode, identityId) {
    socketService.disconnect(customerCode, identityId);
}

function changePassword (userId, data, token) {
    return requestHelpers.axiosInstance.patch(
        `${process.env.LOCALFR_API_BASE_URL}/api/users/${userId}`,
        data,
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/merge-patch+json',
                'Authorization': 'Bearer ' + token
            }
        }
    );
}

function checkToken () {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.access_token) {
        try {
            return encryptorHelpers.verifyToken(user.access_token);
        } catch (error) {
            if ('TokenExpiredException' === error.name) {
                return refreshToken();
            } else {
                console.error(error);
            }
        }
    }

    return null;
}

function impersonateLogin (userId, email) {
    return requestHelpers.securedAxiosInstance.post(
        `${process.env.LOCALFR_API_BASE_URL}/api/users/${userId}/impersonate`,
        { email }
    ).then(impersonatedUser => {
        if (impersonatedUser.access_token) {
            localStorage.setItem('impersonatedUser', JSON.stringify(impersonatedUser));
        }

        return impersonatedUser;
    });
}

function impersonateLogout () {
    localStorage.removeItem('impersonatedUser');
}

function me () {
    localStorage.removeItem('partnerHistoryContext');
    return requestHelpers.securedAxiosInstance.get(
        process.env.LOCALFR_API_BASE_URL + '/api/users/about/me'
    ).then(pfUser => {
        pfUser.allowedToEdit = authDpHelper.hasRoleToEditPartnerFolder(pfUser);
        localStorage.setItem('identity', JSON.stringify(pfUser));
        if (!authDpHelper.isUser(pfUser)) {
            let salesforceUser = JSON.parse(localStorage.getItem('salesforceUser'));
            if (salesforceUser && salesforceUser.Username === pfUser.email) {
                pfUser.salesforceUser = salesforceUser;
                return pfUser;
            }
            return salesforceService.getUserByUsername(pfUser.email).then(sfUser => {
                if (sfUser && sfUser.totalSize > 0) {
                    pfUser.salesforceUser = sfUser.records[0];
                    localStorage.setItem('salesforceUser', JSON.stringify(pfUser.salesforceUser));
                }

                return pfUser;
            });
        }

        return pfUser;
    });
}

function login (username, password) {
    return requestHelpers.axiosInstance.post(
        process.env.LOCALETMOI_BASE_URL + '/localfr-api/generate-user-token',
        {
            username,
            password
        }
    ).then(user => {
        // login succesful if there is a token
        if (user.access_token) {
            localStorage.setItem('user', JSON.stringify(user));
        }

        return user;
    });
}

function refreshToken() {
    const user = JSON.parse(localStorage.getItem('user'));
    return requestHelpers.axiosInstance.post(
        process.env.LOCALETMOI_BASE_URL + '/localfr-api/refresh-user-token',
        {
            user
        }
    ).then(user => {
        // refresh successfull if there is a token
        if (user.data.access_token) {
            localStorage.setItem('user', JSON.stringify(user.data));
            store.dispatch('account/setRefreshTokenTtl', user.expires);
            store.commit('account/updateUser', user.data);
        }
        return user;
    });
}

function logout () {
    // remove user from local storage to log user out
    localStorage.clear();
    router.push('/authentification');
}
