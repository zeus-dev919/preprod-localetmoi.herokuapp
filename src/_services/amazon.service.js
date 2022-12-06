import { requestHelpers } from '@/_helpers';

export const amazonService = {
    s3DownloadFile,
    s3UploadFile
};

async function s3UploadFile (sageCode, file) {
    const url = `${process.env.LOCALETMOI_BASE_URL}/api/s3/put-object`;
    const fileName = (Date.now() + '_' + file.name).replace(/ /g, '_');
    const filePath = sageCode + '/' + fileName;
    let formData = new FormData();
    formData.append('file', file, fileName);
    formData.append('sageCode', sageCode);
    return requestHelpers.securedAxiosInstance.post(
        url,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
    ).then(() => {
        return `${process.env.LOCALETMOI_BASE_URL}/#/demandes/attachments/${encodeURIComponent(filePath)}`;
    });
}

function s3DownloadFile (filePath) {
    const url = `${process.env.LOCALETMOI_BASE_URL}/api/s3/get-object/${encodeURIComponent(filePath)}`;
    return requestHelpers.securedAxiosInstance({
        url: url,
        method: 'GET',
        responseType: 'blob'
    });
}
