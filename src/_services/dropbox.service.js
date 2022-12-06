import {requestHelpers, fileHelpers} from '@/_helpers';

export const dropboxService = {
    uploadFile,
    downloadFile,
    getFolder
};

function getFolder(customerCode, companyName, subFolder, recent) {
    return requestHelpers.securedAxiosInstance.get(`${process.env.LOCALETMOI_BASE_URL}/api/dropbox/folder`,
        {
            params: {
                customerCode: customerCode,
                companyName: companyName,
                subFolder: subFolder,
                recent: recent || false
            }
        }
    );
}

function uploadFile(folderName, subFolder, file, message) {
    if (!fileHelpers.isFileAuthorized(file)) {
        return Promise.reject("Le fichier envoyé n'est pas autorisé.");
    }

    const url = `${process.env.LOCALETMOI_BASE_URL}/api/dropbox/file`;
    const fileName = file.name.replace(/[^a-zA-Z0-9_\.-]/g, '_').replace(/_+/g, '_');
    let formData = new FormData();
    formData.append('file', file, fileName);
    formData.append('folderName', folderName);
    formData.append('subFolder', subFolder);
    formData.append('message', message);
    return requestHelpers.securedAxiosInstance.post(
        url,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
    );
}

function downloadFile(customerCode, companyName, subFolder, filename) {
    filename = filename.replace(/[^a-zA-Z0-9_\.-]/g, '_').replace(/_+/g, '_');
    return requestHelpers.securedAxiosInstance.get(`${process.env.LOCALETMOI_BASE_URL}/api/dropbox/file/${filename}`,
        {
            params: {
                customerCode: customerCode,
                companyName: companyName,
                subFolder: subFolder
            },
            responseType: 'blob'
        }
    );
}
