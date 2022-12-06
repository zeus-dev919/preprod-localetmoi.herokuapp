import { dateHelpers } from "./date.helper";
import {store} from '@/_store';

export const dropboxHelper = {
    getFolderPath,
    getElementsFolderName,
    getMostRecentFolderPath,
    getMultipleFoldersList,
    getMultipleFoldersMessage,
    getBasePath,
    getMostRecentFolder,
    sendDropboxNotification,
    retrieveMostRecentBasePath,
    sendEmailForMultipleFoldersFound,
    notifyUploadedFiles,
    getFolderNameForNotifyUploadedFiles
};

function getMostRecentFolder(customerCode, companyName) {
    return store.dispatch('globalStore/getMostRecentFolder', {
        customerCode: customerCode,
        companyName: companyName,
        subFolder: this.getElementsFolderName()
    });
}

function sendDropboxNotification(foldersList, source) {
    return store.dispatch('globalStore/sendDropboxNotification', {
        customerCode: store.state.account.currentPartner.customerCode,
        source: source,
        folders: foldersList
    });
}

function notifyUploadedFiles(source, files, folderName) {
    // We notify differently in the email with more informations such as files and folder name
    if (files.length) {
        return store.dispatch('globalStore/notifyUploadedFiles', {
            customerCode: store.state.account.currentPartner.customerCode,
            source: source,
            files: files,
            folderName: folderName
        });
    }
}

function getFolderPath() {
    if (store.state.globalStore.salesforce.account.Name && store.state.account.currentPartner.customerCode) {
        return Promise.resolve(`${store.state.account.currentPartner.customerCode} ${store.state.globalStore.salesforce.account.Name}`);
    }

    return new Promise(resolve => {
        let interval = setInterval(() => {
            if (null === store.state.globalStore.salesforce.account.Name) {
                return;
            }
            window.clearInterval(interval);
            resolve(`${store.state.account.currentPartner.customerCode} ${store.state.globalStore.salesforce.account.Name}`);
        }, 50);
    })
}

function getElementsFolderName() {
    return `ELEMENTS ${dateHelpers.formatDropboxDate()}`;
}

function getMostRecentFolderPath() {
    return store.state.globalStore.status.mostRecentFolder.path;
}

function getMultipleFoldersList() {
    return store.state.globalStore.status.mostRecentFolder.multipleFolders ? store.state.globalStore.status.mostRecentFolder.multipleFolders : [];
}

function getMultipleFoldersMessage() {
    return store.state.globalStore.status.mostRecentFolder.message ? store.state.globalStore.status.mostRecentFolder.message : '';
}

function getBasePath(folderPath) {
    return folderPath.split('/').slice(0, -1).join('/');
}

function retrieveMostRecentBasePath() {
    const folderPath = this.getMostRecentFolderPath();
    return (!folderPath || '' === folderPath) ? null : this.getBasePath(folderPath.path);
}

function sendEmailForMultipleFoldersFound(source) {
    // Send an email notification for multiple folders found
    const foldersList = this.getMultipleFoldersList();
    if (foldersList.folders && foldersList.folders.length > 1) {
        return this.sendDropboxNotification(foldersList.folders, source);
    }
}

function getFolderNameForNotifyUploadedFiles(folderPath) {
    // Retreive the right folder name already been through the workflow of finding the most recent folder name
    return folderPath.split('/').slice(-1)[0];
}
