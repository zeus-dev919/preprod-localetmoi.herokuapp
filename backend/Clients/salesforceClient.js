'use strict';

const express = require('express');
const axios = require('axios');
const qs = require('querystring');
const config = require('../config');
const { JWT, JWK } = require('jose');
const url = require('url');

const tokenUrl = config.salesforce.audience + config.salesforce.tokenEndpoint;
const privateKey = config.salesforce.privateKey;
const listRecordTypeId = config.salesforce.api.recordTypeId;
const nddTaskRecordTypeId = config.salesforce.task.nddRecordTypeId;

function SalesforceOAuth2Client (params) {
    this.sub = null;

    if (params) {
        this.sub = params.sub || null;
    }

    return this;
}

SalesforceOAuth2Client.prototype.generateRefreshToken = function generateRefreshToken (sub) {
    var token = null;
    const key = JWK.asKey(Buffer.from(privateKey));
    token = JWT.sign(
        {},
        key,
        {
            algorithm: 'RS256',
            issuer: config.salesforce.clientId,
            subject: sub || this.sub || config.salesforce.username,
            audience: config.salesforce.audience,
            expiresIn: '5 minutes',
            header: {
                typ: 'JWT'
            }
        }
    );

    return token;
};

SalesforceOAuth2Client.prototype.getAccessToken = function getAccessToken () {
    const refreshToken = this.generateRefreshToken();
    if (refreshToken) {
        return axios.post(
            tokenUrl,
            qs.stringify({
                grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                assertion: refreshToken
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        ).then(
            (response) => {
                return response.data;
            },
            (error) => {
                return error.response.data;
            }
        );
    }

    return new Promise((resolve, reject) => {
        reject(new Error());
    });
};

function updateObjectService(endpoint, req, res) {
    const objectId = req.params.objectId;
    const data = req.body;
    if (!data) {
        res.status(400).json({
            status: 400,
            statusText: 'Bad Request',
            reason: '"body" cannot be empty'
        });
        return;
    }

    return soac.getAccessToken().then((token) => {
        const url = `${token.instance_url}${endpoint}/${objectId}`;

        return axios.patch(
            url,
            data,
            {
                headers: {
                    'Authorization': token.token_type + ' ' + token.access_token
                }
            }
        ).then(response => {
            res.json(response.data);
        }, error => {
            res.status(error.response.status).json({
                status: error.response.status,
                statusText: error.response.statusText,
                reason: error.response.data || null
            });
        });
    }, (error) => {
        res.status(500).json({
            status: 500,
            statusText: 'Internal Server Error',
            reason: `Something went wrong while updating ${endpoint}/${objectId}`
        });
    });
}

function getRequestedObject(entity, req, res) {
    const entityId = req.params[`${entity}Id`];

    return getEntity(entity, entityId, req, res);
}

function getEntity(entity, entityId, req, res) {
    return soac.getAccessToken().then((token) => {
        return axios.get(
            token.instance_url + endpoints[entity] + '/' + entityId,
            {
                headers: {
                    'Authorization': token.token_type + ' ' + token.access_token
                }
            }
        ).then(response => {
            res.json(response.data);
        }, error => {
            res.status(error.response.status).json({
                status: error.response.status,
                statusText: error.response.statusText,
                reason: error.response.data || null
            });
        });
    }, () => {
        res.status(500).json({
            status: 500,
            statusText: 'Internal Server Error',
            reason: `Something went wrong while getting Salesforce ${entity} ${entityId}`
        });
    });
}

const soac = new SalesforceOAuth2Client();
const sfBaseEndpoint = config.salesforce.api.baseEndpoint.replace(/\/$/, '') + '/' + config.salesforce.api.version;
const sfApiListEndpoint = config.salesforce.api.listEndpoint;
const objectsEndpoint = sfBaseEndpoint + '/sobjects';
const endpoints = {
    account: objectsEndpoint + '/Account',
    contact: objectsEndpoint + '/Contact',
    opportunity: objectsEndpoint + '/Opportunity',
    ticket: objectsEndpoint + '/Case',
    taskTracking: objectsEndpoint + '/Suivi_T_che__c',
    contentVersion: objectsEndpoint + '/ContentVersion',
    user:  objectsEndpoint + '/User',
};
const queryEndpoint = sfBaseEndpoint + '/query/?q=';

var salesforceClientRouter = express.Router();

/*
 * Account
 */
// Get account by id
salesforceClientRouter.get('/account/:accountId', (req, res) => getRequestedObject('account', req, res));

// Get account by id
salesforceClientRouter.get('/picklist/:apiObjectName/:fieldName', function (req, res) {
    const apiObjectName = req.params.apiObjectName;
    const fieldName = req.params.fieldName;
    const listUrl = `${sfApiListEndpoint}/${apiObjectName}/picklist-values/${listRecordTypeId}/${fieldName}`

    return soac.getAccessToken().then((token) => {
        const url = token.instance_url + sfBaseEndpoint + listUrl;

        return axios.get(
            url,
            {
                headers: {
                    'Authorization': token.token_type + ' ' + token.access_token
                }
            }
        ).then(response => {
            res.json(response.data);
        }, error => {
            res.status(error.response.status).json({
                status: error.response.status,
                statusText: error.response.statusText,
                reason: error.response.data || null
            });
        });
    }, () => {
        res.status(500).json({
            status: 500,
            statusText: 'Internal Server Error',
            reason: `Something went wrong while getting Salesforce data list from field ${fieldName}`
        });
    });
});

// Update account
salesforceClientRouter.patch('/account/:objectId', (req, res) => updateObjectService(endpoints.account, req, res));

// Update contact
salesforceClientRouter.patch('/contact/:objectId', (req, res) => updateObjectService(endpoints.contact, req, res));

// Update opportunity
salesforceClientRouter.patch('/opportunity/:objectId', (req, res) => updateObjectService(endpoints.opportunity, req, res));

// Task tracking
salesforceClientRouter.patch('/taskTracking/:objectId', (req, res) => updateObjectService(endpoints.taskTracking, req, res));

// Get contacts from account id
salesforceClientRouter.get('/account/:accountId/contacts', function (req, res) {
    const accountId = req.params.accountId;
    const offsets = [
        'id',
        'Email',
        'Birthdate',
        'Contact_Principal__c',
        'FirstName',
        'LastName',
        'Phone',
        'MobilePhone',
    ];
    const query = `SELECT ${offsets.join(',')} FROM Contact WHERE AccountId = '${accountId}'`;

    return soac.getAccessToken().then((token) => {
        const url = token.instance_url + queryEndpoint + query;

        return axios.get(
            url,
            {
                headers: {
                    'Authorization': token.token_type + ' ' + token.access_token
                }
            }
        ).then(response => {
            res.json(response.data);
        }, error => {
            res.status(error.response.status).json({
                status: error.response.status,
                statusText: error.response.statusText,
                reason: error.response.data || null
            });
        });
    }, () => {
        res.status(500).json({
            status: 500,
            statusText: 'Internal Server Error',
            reason: 'Something went wrong while getting Salesforce contacts for account ' + accountId
        });
    });
});

// Get opportunities from account id
salesforceClientRouter.get('/account/:accountId/opportunities', function (req, res) {
    const accountId = req.params.accountId;
    const offsets = [
        'Id',
        'Name',
        'StageName',
        'Actif__c',
        'CloseDate',
        'Cr_ation_logo__c',
        'CreatedDate',
        'Date_passage_DP_Valide__c',
        'Deviseur_Visio__c',
        'Deviseur_CRM__c',
        'Deviseur_Agenda_en_ligne__c',
        'Deviseur_Souhaite_un_RDV_Brief__c',
        'QR_Code__c',
        'Signalement__c',
        'Click_Collect__c',
        'Signalement_Commentaire__c',
        '(SELECT Id, CreatedDate, API_CMS__c, PricebookEntry.Product2.Id, PricebookEntry.Product2.ProductCode FROM OpportunityLineItems)',
    ];
    const query = `SELECT ${offsets.join(',')} FROM Opportunity WHERE AccountId = '${accountId}'`;

    return soac.getAccessToken().then((token) => {
        const url = token.instance_url + queryEndpoint + query;

        return axios.get(
            url,
            {
                headers: {
                    'Authorization': token.token_type + ' ' + token.access_token
                }
            }
        ).then(response => {
            res.json(response.data);
        }, error => {
            res.status(error.response.status).json({
                status: error.response.status,
                statusText: error.response.statusText,
                reason: error.response.data || null
            });
        });
    }, () => {
        res.status(500).json({
            status: 500,
            statusText: 'Internal Server Error',
            reason: 'Something went wrong while getting Salesforce opportunities for account ' + accountId
        });
    });
});

// Get Task Tracking from opportunity id
salesforceClientRouter.get('/opportunity/:opportunityId/taskTracking', function (req, res) {
    const opportunityId = req.params.opportunityId;
    const queryPartnerFolder = `SELECT Id FROM Dossier_Partenaire__c WHERE Contrat_Partenaire__c = '${opportunityId}'`;
    const queryTask = `SELECT Suivi_T_che__c FROM Task WHERE WhatId IN (${queryPartnerFolder}) AND RecordTypeId = '${nddTaskRecordTypeId}'`;

    return soac.getAccessToken().then((token) => {
        return axios.get(
            token.instance_url + queryEndpoint + queryTask,
            {
                headers: {
                    'Authorization': token.token_type + ' ' + token.access_token
                }
            }
        ).then(response => {
            if (!response || !response.data || !response.data.records || !response.data.records.length) {
                return res.json();
            }

            return getEntity('taskTracking', response.data.records[0].Suivi_T_che__c, req, res);
        }, (error) => {
            if (error && error.response) {
                res.status(error.response.status).json({
                    status: error.response.status,
                    statusText: error.response.statusText,
                    reason: error.response.data || null
                });
            } else {
                res.status(500).json({
                    status: 500,
                    statusText: 'Internal Server Error',
                    reason: 'Something went wrong while getting Salesforce opportunities for account ' + opportunityId,
                    error
                });
            }
        });
    }, (error) => {
        res.status(500).json({
            status: 500,
            statusText: 'Internal Server Error',
            reason: 'Something went wrong while getting Salesforce opportunities for account ' + opportunityId
        });
    });
});

// Get attachments from account id
salesforceClientRouter.get('/account/:accountId/attachments', function (req, res) {
    const accountId = req.params.accountId;
    const offsets = [
        'Id',
        'Commentaire__c',
        'Contrat_Partenaire__c',
        'Type_de_piece__c',
        'Url__c',
        'CreatedDate',
        'Statut__c',
    ];
    const query = `SELECT ${offsets.join(',')} FROM Pieces_Jointes__c WHERE Compte__c = '${accountId}'`;

    return soac.getAccessToken().then((token) => {
        const url = token.instance_url + queryEndpoint + query;

        return axios.get(
            url,
            {
                headers: {
                    'Authorization': token.token_type + ' ' + token.access_token
                }
            }
        ).then(response => {
            res.json(response.data);
        }, error => {
            res.status(error.response.status).json({
                status: error.response.status,
                statusText: error.response.statusText,
                reason: error.response.data || null
            });
        });
    }, () => {
        res.status(500).json({
            status: 500,
            statusText: 'Internal Server Error',
            reason: 'Something went wrong while getting Salesforce attachments for account ' + accountId
        });
    });
});

// Get rib from account id
salesforceClientRouter.get('/account/:accountId/rib', function (req, res) {
    const accountId = req.params.accountId;
    const query = 'SELECT+Banque__c+,+Code_BIC__c+,+IBAN__c+from+Account+WHERE+Id+=+\'' + accountId + '\'';
    return soac.getAccessToken().then((token) => {
        const url = token.instance_url + queryEndpoint + query;

        return axios.get(
            url,
            {
                headers: {
                    'Authorization': token.token_type + ' ' + token.access_token
                }
            }
        ).then(response => {
            res.json(response.data);
        }, error => {
            res.status(error.response.status).json({
                status: error.response.status,
                statusText: error.response.statusText,
                reason: error.response.data || null
            });
        });
    }, () => {
        res.status(500).json({
            status: 500,
            statusText: 'Internal Server Error',
            reason: 'Something went wrong while getting Salesforce attachments for account ' + accountId
        });
    });
});

// Get status from Task
salesforceClientRouter.get('/account/:accountId/task', function (req, res) {
    const accountId = req.params.accountId;
    // In Recette environmnent the task 'Mise en ligne du site' must exist and link to the account
    const query = `SELECT IsClosed FROM Task WHERE AccountId = '${accountId}' AND Subject = 'Mise en ligne du site' AND TaskSubtype = 'Task'`;
    return soac.getAccessToken().then((token) => {
        const url = token.instance_url + queryEndpoint + encodeURI(query);

        return axios.get(
            url,
            {
                headers: {
                    'Authorization': token.token_type + ' ' + token.access_token
                }
            }
        ).then(response => {
            res.json(response.data);
        }, error => {
            res.status(error.response.status).json({
                status: error.response.status,
                statusText: error.response.statusText,
                reason: error.response.data || null
            });
        });
    }, () => {
        res.status(500).json({
            status: 500,
            statusText: 'Internal Server Error',
            reason: 'Something went wrong while getting Salesforce attachments for account ' + accountId
        });
    });
});

/*
 * Tickets
 */
// Get ticket by id
salesforceClientRouter.get('/ticket/:ticketId', (req, res) => getRequestedObject('ticket', req, res));

// Update ticket
salesforceClientRouter.patch('/ticket/:ticketId', function (req, res) {
    const ticketId = req.params.ticketId;
    const data = req.body;

    if (!data) {
        res.status(400).json({
            status: 400,
            statusText: 'Bad Request',
            reason: '"body" cannot be empty'
        });
        return;
    }

    return soac.getAccessToken().then((token) => {
        const url = token.instance_url + endpoints.ticket + '/' + ticketId;

        return axios.patch(
            url,
            data,
            {
                headers: {
                    'Authorization': token.token_type + ' ' + token.access_token
                }
            }
        ).then(response => {
            res.json(response.data);
        }, error => {
            res.status(error.response.status).json({
                status: error.response.status,
                statusText: error.response.statusText,
                reason: error.response.data || null
            });
        });
    }, () => {
        res.status(500).json({
            status: 500,
            statusText: 'Internal Server Error',
            reason: 'Something went wrong while updating Salesforce ticket ' + ticketId
        });
    });
});

// Get tickets by account id
salesforceClientRouter.get('/account/:accountId/tickets', function (req, res) {
    const accountId = req.params.accountId;
    const query = `SELECT Id, Subject, Description, CreatedDate, ClosedDate, Status FROM Case WHERE AccountId = '${accountId}' AND RecordTypeId = '${config.salesforce.recordTypeId}'`;

    return soac.getAccessToken().then((token) => {
        const url = token.instance_url + queryEndpoint + query.replace(/ /g, '+');

        return axios.get(
            url,
            {
                headers: {
                    'Authorization': token.token_type + ' ' + token.access_token
                }
            }
        ).then(response => {
            res.json(response.data);
        }, error => {
            res.status(error.response.status).json({
                status: error.response.status,
                statusText: error.response.statusText,
                reason: error.response.data || null
            });
        });
    }, () => {
        res.status(500).json({
            status: 500,
            statusText: 'Internal Server Error',
            reason: 'Something went wrong while getting Salesforce tickets for account ' + accountId
        });
    });
});

salesforceClientRouter.post('/account/:accountId/tickets', function (req, res) {
    const data = req.body;

    if (!data) {
        res.status(400).json({
            status: 400,
            statusText: 'Bad Request',
            reason: '"body" cannot be empty'
        });
        return;
    }

    const accountId = req.params.accountId;
    let token, headers, createdCaseId;

    let onError = function (error) {
        res.status(500).json({
            status: 500,
            statusText: 'Internal Server Error',
            reason: 'Something went wrong while creating ticket for account ' + accountId,
            error: error.response.data || error.response,
        });
    };

    return soac.getAccessToken()
        .then(tokenResponse => {
            token = tokenResponse;
            headers = {
                headers: {
                    'Authorization': tokenResponse.token_type + ' ' + tokenResponse.access_token
                }
            }

            return axios.post(
                tokenResponse.instance_url + endpoints.ticket,
                {
                    ...data,
                    OwnerId: config.salesforce.ownerId,
                    RecordTypeId: config.salesforce.recordTypeId,
                    CreatedById: config.salesforce.ticketCreatorId || undefined,
                    LastModifiedById: config.salesforce.ticketCreatorId || undefined,
                },
                headers
            ).then(response => response.data, onError);
        }, onError)
        .then(response => {
            if (!response.success) {
                throw 'No Case created';
            }

            res.json(response.id);
        }, onError)
        .catch(error => {
            res.status(500).json({
                status: 500,
                statusText: 'Internal Server Error',
                reason: 'Something went wrong while creating ticket for account ' + accountId,
                error: error
            });
        });
});

/*
 * Event
 */

// Get the date of the latest rdv brief event
salesforceClientRouter.get('/accounts/:accountId/events', function (req, res) {
    const accountId = req.params.accountId;
    const queryParams = url.parse(req.url, true).query;
    let andClause = '';
    if (queryParams.recordTypeIds && '' !== queryParams.recordTypeIds) {
        andClause = "AND RecordTypeId IN ('" + queryParams.recordTypeIds.split(',').join("','") + "')";
    }
    const query = `SELECT ActivityDateTime, R_sultat_d_appel__c, Owner.Name FROM Event WHERE AccountId = '${accountId}' ${andClause} ORDER BY ActivityDateTime DESC`;

    return soac.getAccessToken().then((token) => {
        const url = token.instance_url + queryEndpoint + query;

        return axios.get(
            url,
            {
                headers: {
                    'Authorization': token.token_type + ' ' + token.access_token
                }
            }
        ).then(response => {
            res.json(response.data);
        }, error => {
            res.status(error.response.status).json({
                status: error.response.status,
                statusText: error.response.statusText,
                reason: error.response.data || null
            });
        });
    }, () => {
        res.status(500).json({
            status: 500,
            statusText: 'Internal Server Error',
            reason: 'Something went wrong while getting Salesforce event content for account ' + accountId
        });
    });
});


/*
 * Contact
 */
// Get contact by id
salesforceClientRouter.get('/contact/:contactId', (req, res) => getRequestedObject('contact', req, res));

/*
 * Document
 */
// Get document content from document Id
salesforceClientRouter.get('/document/:documentId/content', function (req, res) {
    const documentId = req.params.documentId;
    const query = 'SELECT ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId = \'' + documentId + '\'';

    return soac.getAccessToken().then((token) => {
        const url = token.instance_url + queryEndpoint + query;

        return axios.get(
            url,
            {
                headers: {
                    'Authorization': token.token_type + ' ' + token.access_token
                }
            }
        ).then(response => {
            res.json(response.data);
        }, error => {
            res.status(error.response.status).json({
                status: error.response.status,
                statusText: error.response.statusText,
                reason: error.response.data || null
            });
        });
    }, () => {
        res.status(500).json({
            status: 500,
            statusText: 'Internal Server Error',
            reason: 'Something went wrong while getting Salesforce document content for document ' + documentId
        });
    });
});

/*
 * ContentDocument
 */
// Get content from content document Id array
salesforceClientRouter.post('/content', function (req, res) {
    const data = req.body;

    if (!data) {
        res.status(400).json({
            status: 400,
            statusText: 'Bad Request',
            reason: '"body" cannot be empty'
        });
        return;
    }

    if (!data.hasOwnProperty('documentIds')) {
        res.status(400).json({
            status: 400,
            statusText: 'Bad Request',
            reason: '"documentIds" field is missing'
        });
        return;
    }

    const documentIdsList = '(\'' + data.documentIds.join('\', \'') + '\')';
    const query = 'SELECT Id, Title, FileExtension, CreatedDate FROM ContentDocument WHERE Id IN ' + documentIdsList;

    return soac.getAccessToken().then((token) => {
        const url = token.instance_url + queryEndpoint + query;

        return axios.get(
            url,
            {
                headers: {
                    'Authorization': token.token_type + ' ' + token.access_token
                }
            }
        ).then(response => {
            res.json(response.data);
        }, error => {
            res.status(error.response.status).json({
                status: error.response.status,
                statusText: error.response.statusText,
                reason: error.response.data || null
            });
        });
    }, () => {
        res.status(500).json({
            status: 500,
            statusText: 'Internal Server Error',
            reason: 'Something went wrong while getting Salesforce content for documents ' + documentIdsList
        });
    });
});

// Get specific version content of from content document Id
salesforceClientRouter.get('/content/version/:contentVersionId', function (req, res) {
    const contentVersionId = req.params.contentVersionId;

    return soac.getAccessToken().then((token) => {
        const url = token.instance_url + endpoints.contentVersion + '/' + contentVersionId + '/VersionData';

        return axios(
            {
                url: url,
                headers: {
                    'Authorization': token.token_type + ' ' + token.access_token
                },
                method: 'GET',
                responseType: 'stream'
            }
        ).then(response => {
            response.data.pipe(res);
        }, error => {
            res.status(error.response.status).send(error.response.statusText);
        });
    }, () => {
        res.status(500).send('Something went wrong while getting Salesforce document version for contentVersionId ' + contentVersionId);
    });
});

// Get content version from content document Id
salesforceClientRouter.get('/content/:contentDocumentId/version', function (req, res) {
    const contentDocumentId = req.params.contentDocumentId;
    const query = 'SELECT VersionData, PathOnClient FROM ContentVersion WHERE ContentDocumentId IN (\'' + contentDocumentId + '\')';

    return soac.getAccessToken().then((token) => {
        const url = token.instance_url + queryEndpoint + query;

        return axios.get(
            url,
            {
                headers: {
                    'Authorization': token.token_type + ' ' + token.access_token
                }
            }
        ).then(response => {
            res.json(response.data);
        }, error => {
            res.status(error.response.status).json({
                status: error.response.status,
                statusText: error.response.statusText,
                reason: error.response.data || null
            });
        });
    }, () => {
        res.status(500).json({
            status: 500,
            statusText: 'Internal Server Error',
            reason: 'Something went wrong while getting Salesforce document version for contentDocumentId ' + contentDocumentId
        });
    });
});

// Get User data
salesforceClientRouter.get('/user', function (req, res) {
    const data = req.query;
    if (!data || !data.username) {
        res.status(400).json({
            status: 400,
            statusText: 'Bad Request',
            reason: 'Missing username parameter.'
        });
        return;
    }

    const offsets = [
        'id',
        'Email',
        'Username',
        'FirstName',
        'LastName',
        'Fonction_hi_rarchique__c',
    ];
    const query = `SELECT ${offsets.join(',')} FROM User WHERE Username = '${data.username}'`;

    return soac.getAccessToken().then((token) => {
        const url = token.instance_url + queryEndpoint + query;

        return axios.get(
            url,
            {
                headers: {
                    'Authorization': token.token_type + ' ' + token.access_token
                }
            }
        ).then(response => {
            res.json(response.data);
        }, error => {
            res.status(error.response.status).json({
                status: error.response.status,
                statusText: error.response.statusText,
                reason: error.response.data || null
            });
        });
    }, () => {
        res.status(500).json({
            status: 500,
            statusText: 'Internal Server Error',
            reason: 'Something went wrong while getting Salesforce user for username ' + data.username
        });
    });
});

// Get user by id
salesforceClientRouter.get('/user/:userId', (req, res) => getRequestedObject('user', req, res));

module.exports = salesforceClientRouter;
