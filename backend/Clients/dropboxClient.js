'use strict';

const express = require('express');
const config = require('../config');
const fileHelpers = require('../utils/file')
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const { Dropbox } = require('dropbox');

var dropboxClientRouter = express.Router();
let dbx = null;

function getMostRecent(collection) {
    return collection
        .sort((a, b) => new Date(b['client_modified']) - new Date(a['client_modified']))
        .shift();
}

function getDropbox() {
    if (null === dbx) {
        dbx = new Dropbox({ accessToken: config.dropbox.api.token });
    }

    return dbx;
}

/**
 * New configuration folder path with range subFolder
 * @param customerCode
 * @return {string}
 */
function getSubFolderRangePath(customerCode) {
    return `${config.dropbox.api.folder}/${getSubFolderRangeNumber(customerCode)}`;
}

/**
 * SubFolder range number to store in Dropbox
 * @param customerCode
 * @return {number}
 */
function getSubFolderRangeNumber(customerCode) {
    return Math.floor(customerCode / 25000) * 25000;
}

/**
 * Search for an existing folder in different subFolder
 * @param customerCode
 * @param path (config.dropbox.api.folder|config.dropbox.api.folder/<range>)
 * @return {Promise<DropboxResponse<SearchV2Result>|[]>}
 */
function findFolderIntoDropbox(customerCode, path) {
    const nbSubFolders = path.split('/').length;

    return getDropbox().filesSearchV2({
        options: {
            path: path,
            file_categories: [ 'folder' ],
            file_status: 'active'
        },
        query: `^${customerCode}`
    }).then(response => {
        if (response.result.matches && response.result.matches.length) {
            return Promise.resolve(response.result.matches.filter(matchResult => {
                let pathDisplay = matchResult.metadata.metadata.path_display;

                // Keep only first sub-folders level AND beginning with dropbox main path with sage code
                return nbSubFolders === (pathDisplay.split('/').length - 1)
                    && 0 === pathDisplay.indexOf(`${path}/${customerCode}`)
            }).map(matchResult => matchResult.metadata.metadata));
        }

        return Promise.resolve([]);
    })
}

/**
 * Return promise about the current folder
 * @param response
 * @param customerCode
 * @param source
 * @param message
 * @param folderName
 * @return {{multipleFolders: {}, promise: Promise<any>, message: string}}
 */
function afterFolderFoundIntoDropbox(response, customerCode, source, message, folderName) {
    const regexOlderFolder = (new RegExp(`^${customerCode}[^0-9]`));

    let multipleFolders = {};
    if (response.length > 1) {
        const folders = response.map(item => item.name);
        multipleFolders = { folders, customerCode, source };
    }

    let foldersFound = []
    let promise = null;
    const folderFound = response.find(currentPartnerFolder => currentPartnerFolder.name === folderName);

    if (folderFound) {
        foldersFound.push(folderFound);
    } else {
        // We look if we find matches among all the folders to the one we are looking for (`^${customerCode}[^0-9]`)
        foldersFound = response.filter(
            currentPartnerFolder => regexOlderFolder.test(currentPartnerFolder.name)
        );
    }

    switch (true) {
        case (1 === foldersFound.length):
            // We found only one match
            // Then we upload the file into this folder
            promise = Promise.resolve(foldersFound[0]['path_display']);
            message = `Folder already exist in Dropbox ${foldersFound[0]['path_display']}`
            break;
        case (foldersFound.length > 1):
            // We found multitple folders and return only the most recent used
            promise = markMostRecentFolder(foldersFound).then(() => {
                const folder = getMostRecent(foldersFound);
                return folder ? folder['path_display'] : null;
            })
            break;
        default:
            // We do not found an existing folder
            // Then we create a new one with the new wording (<customer_code> <company_name>)
            promise = Promise.resolve([
                getSubFolderRangePath(customerCode),
                folderName ? decodeURIComponent(folderName) : null,
            ].filter(item => !!item).join('/'));

            if (!folderName) {
                message = 'Folder got an undefined name';
            } else {
                message = 'Folder not found in Dropbox';
            }
    }

    return { promise, message, multipleFolders };
}

/**
 * Get current partner folder
 * @param customerCode
 * @param companyName
 * @param notify
 * @param source
 * @return {Promise<{multipleFolders: {}, promise: Promise<*>, message: string}>}
 */
function getFolderForPartner(customerCode, companyName, notify, source) {
    companyName = companyName.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '_');
    const folderName = `${customerCode} ${companyName}`;
    const folderBase = config.dropbox.api.folder;
    let message = '';
    let retrySearchingFolder = 0;

    return findFolderIntoDropbox(customerCode, `${folderBase}/${getSubFolderRangeNumber(customerCode)}`)
        .then(response => {
            if (!response) {
                return;
            }

            retrySearchingFolder++;
            if (!response.length && retrySearchingFolder <= 1) {
                return findFolderIntoDropbox(customerCode, folderBase)
                    .then(response => afterFolderFoundIntoDropbox(response, customerCode, source, message, folderName))
            }

            return afterFolderFoundIntoDropbox(response, customerCode, source, message, folderName);
        })
}

/**
 * Mark most recent folder
 * @param folders
 * @return {Promise<any>|Promise<any[]>}
 */
function markMostRecentFolder(folders) {
    if (!folders.length) {
        return Promise.resolve(folders);
    }

    return Promise.all(
        folders.map(mapMostRecentSubfolder)
    )
}

/**
 * Get most recent folder
 * @param folder
 * @return {Promise<(files.FileMetadataReference | files.FolderMetadataReference | files.DeletedMetadataReference)[]>}
 */
function mapMostRecentSubfolder(folder) {
    return getDropbox().filesListFolder({ path: folder.path_lower }).then(async data => {
        const subfolders = data.result.entries.filter(
            folder => folder['.tag'] === 'folder'
        );

        const mostRecentFile = getMostRecent(data.result.entries);
        folder.subFolders = subfolders;

        await markMostRecentFolder(subfolders).then(response => {
            if (!response || 0 === response.length)  {
                folder['client_modified'] = mostRecentFile ? new Date(mostRecentFile['client_modified']) : undefined;
            } else {
                let mostRecentSubfolder = getMostRecent(subfolders);
                switch (true) {
                    case !mostRecentFile && !mostRecentSubfolder:
                        folder['client_modified'] = undefined;
                        break;
                    case !mostRecentSubfolder:
                        folder['client_modified'] = new Date(mostRecentFile['client_modified']);
                        break;
                    case !mostRecentFile:
                        folder['client_modified'] = new Date(mostRecentSubfolder['client_modified']);
                        break;
                    default:
                        if (new Date(mostRecentFile['client_modified']) < new Date(mostRecentSubfolder['client_modified'])) {
                            folder['client_modified'] = new Date(mostRecentSubfolder['client_modified']);
                        } else {
                            folder['client_modified'] = new Date(mostRecentFile['client_modified']);
                        }
                }
            }

            return subfolders;
        })

        return subfolders;
    });
}

/**
 * Upload file into Dropbox
 * @param path
 * @param message
 * @param res
 * @param file
 */
function uploadFile(path, message, res, file) {
    getDropbox().filesUpload({
        path: path,
        contents: file.buffer,
        mode: {
            '.tag': 'overwrite'
        }
    }).then(response => {
        console.log(message);
        res.json(response.result || {});
    }).catch(error => {
        res.status(500).json({
            status: 500,
            statusText: 'Couldn\'t upload file into Dropbox',
            reason: error
        });
    });
}

/**
 * Download file from Dropbox
 * @param path
 * @param res
 */
function filesDownload(path, res) {
    getDropbox().filesDownload({ path: path })
        .then(data => {
            res.send(data.result.fileBinary);
        }).catch(error => {
            res.status(500).json({
                status: 500,
                statusText: 'Couldn\'t download file',
                reason: error
            });
        });
}

/**
 * Search files in folder
 * @param path
 * @param fileType
 * @param res
 * @param filterCallback
 */
function filesListFolder(path, fileType, res, filterCallback) {
    getDropbox().filesListFolder({ path: path })
        .then(data => {
            let foldersOrFiles = data.result.entries.filter(
                folder => folder['.tag'] === fileType
            );

            if (undefined !== filterCallback) {
                foldersOrFiles = foldersOrFiles.filter(filterCallback);
            }

            res.send(foldersOrFiles);
        }).catch(error => {
            // If a folder is not found at the beginning we trigger an 500 error.
            // But it display this error in the front and it is not that proper.
            // So we check it the error status match the path not found and then simply return an empty array.
            if (409 === error.status) {
                const errorParsed = JSON.parse(error.error);
                if ('not_found' === errorParsed.error.path['.tag']) {
                    res.status(200).send([]);
                    return;
                }
            }
            res.status(500).json({
                status: 500,
                statusText: 'Internal Server Error',
                reason: error
            });
        });
}

// Post (upload) files into specific folder/subfolder
dropboxClientRouter.post('/file', upload.single('file'), function (req, res) {
    let file = req.file;
    let body = req.body;
    const UPLOAD_FILE_SIZE_LIMIT = 15 * 1024 * 1024;

    if (file.size > UPLOAD_FILE_SIZE_LIMIT) { // File is bigger than 15 Mb
        res.status(500).json({
            status: 500,
            statusText: 'Invalid file size',
            reason: `The file size is too big for ${file.originalname}.`
        });
        return;
    }

    if (!fileHelpers.isFileAuthorized(file)) {
        res.status(403).send("Le fichier envoyé n'est pas autorisé.");
        return;
    }

    const path = [
        body.folderName,
        body.subFolder ? body.subFolder : null,
        file.originalname
    ].filter(item => !!item).join('/');

    uploadFile(path, body.message, res, file);
});

// Get the current (downloadFile) in fileBinary format into the current subfolder
dropboxClientRouter.get('/file/:filename', function (req, res) {
    const customerCode = decodeURIComponent(req.query.customerCode);
    const companyName = decodeURIComponent(req.query.companyName);
    const subFolder = decodeURIComponent(req.query.subFolder || '');
    const filename = decodeURIComponent(req.params.filename);

    getFolderForPartner(customerCode, companyName, false).then(response => {
        if (!response) {
            return;
        }

        response.promise.then(folderPath => {
            if (!folderPath) {
                return
            }

            if (!subFolder) {
                const filePath = [
                    folderPath,
                    filename
                ].filter(item => !!item).join('/');

                return filesDownload(filePath, res);
            }

            const filePath = [
                folderPath,
                subFolder,
                filename
            ].filter(item => !!item).join('/');

            filesDownload(filePath, res);
        })
    });
});

// Get the folders list into a parent folder
dropboxClientRouter.get('/folder', function (req, res) {
    const customerCode = decodeURIComponent(req.query.customerCode);
    const companyName = decodeURIComponent(req.query.companyName);
    const subFolder = decodeURIComponent(req.query.subFolder || '');
    const recent = JSON.parse(req.query.recent || false);

    getFolderForPartner(customerCode, companyName, false).then(response => {
        if (!response) {
            return;
        }

        response.promise.then(folderPath => {
            if (!folderPath) {
                return
            }

            if (recent) {
                const filePath = [
                    folderPath,
                    subFolder
                ].filter(item => !!item).join('/');

                res.json({
                    path: filePath,
                    multipleFolders: response.multipleFolders,
                    message: response.message
                });
            } else {
                if (subFolder) {
                    const filePath = [
                        folderPath,
                        subFolder
                    ].filter(item => !!item).join('/');

                    return filesListFolder(filePath, 'file', res);
                }

                filesListFolder(folderPath, 'folder', res, function(folder) {
                    return /(nouveaux\s)?[eé]l[eé]ments\s(du\s)?\d{2}/i.test(folder.name)
                });
            }
        },
        error => {
            res.status(500).json({
                status: 500,
                statusText: 'Internal Server Error',
                reason: error.error || error
            });
        })
    });
});

module.exports = dropboxClientRouter;
