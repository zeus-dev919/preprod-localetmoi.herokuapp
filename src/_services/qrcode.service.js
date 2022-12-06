import { requestHelpers } from '@/_helpers';

export const qrcodeService = {
    createQrcode: function(text, format) {
        return requestHelpers.securedAxiosInstance.post(
            `${process.env.LOCALETMOI_BASE_URL}/api/qrcode/create`,
            {
                text,
                format: format || 'png'
            }, {
                responseType: 'blob'
            }
        );
    }
};
