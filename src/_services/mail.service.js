import { requestHelpers } from '@/_helpers';

export const mailService = {
    sendNewBillingInfoMail,
    sendResetPasswordMail,
    sendDropboxNotification,
    notifyUploadedFiles
};

function sendResetPasswordMail (data) {
    return requestHelpers.axiosInstance.post(
        process.env.LOCALETMOI_BASE_URL + '/localfr-api/send-reset-pwd-link',
        data,
        {
            headers: {
                'Content-type': 'application/json'
            }
        }
    );
}

function sendNewBillingInfoMail (data) {
    return requestHelpers.securedAxiosInstance.post(
        process.env.LOCALETMOI_BASE_URL + '/api/mandrill/billing-infos',
        data,
        {
            headers: {
                'Content-type': 'application/json'
            }
        }
    );
}

function sendDropboxNotification (customerCode, source, folders) {
    return requestHelpers.securedAxiosInstance.post(
        process.env.LOCALETMOI_BASE_URL + '/api/mandrill/notification/duplicate-folders',
        {
            customerCode,
            source,
            folders,
        },
        {
            headers: {
                'Content-type': 'application/json'
            }
        }
    );
}

function notifyUploadedFiles (customerCode, source, files, folderName) {
    return requestHelpers.securedAxiosInstance.post(
        process.env.LOCALETMOI_BASE_URL + '/api/mandrill/notification/upload-files',
        {
            customerCode,
            source,
            files,
            folderName
        },
        {
            headers: {
                'Content-type': 'application/json'
            }
        }
    );
}
