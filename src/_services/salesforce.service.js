import { store } from '@/_store';
import { dateHelpers, requestHelpers } from '@/_helpers';
import { websiteService, adplorerService } from '@/_services';
import momentBusinessDays from "moment-business-days";

export const salesforceService = {
    downloadFile,
    getAccount: (id) => getObject('account', id),
    getAttachments,
    getContact,
    getOpportunities,
    getRib,
    parseAttachment,
    parseFiles,
    getTicket: (id) => getObject('ticket', id),
    updateTicket,
    createTicket,
    getTickets,
    getTask,
    getTaskTracking,
    getBriefAppointmentInfo,
    getUser: (id) => getObject('user', id),
    getUserByUsername,
    updateAccount: (id, data) => updateObject('account', id, data),
    updateContact: (id, data) => updateObject('contact', id, data),
    updateOpportunity: (id, data) => updateObject('opportunity', id, data),
    updateTaskTracking: (id, data) => updateObject('taskTracking', id, data),
    getSignalementTypes: () => getPickList('Opportunity', 'Signalement__c'),
    findCurrentOffer,
    findCurrentOpportunity,
};

const offersTab = {
    'LocalStart': ['ABSIT31'],
    'LocalWeb': ['ABSIT3', 'ABSIT11', 'ABSIT16', 'ABSIT52', 'ABSIT53', 'ABSIT54', 'ABSIT4', 'ABSIT8'],
    'LocalAgenda': ['ABSIT17', 'ABSIT18', 'ABSIT19'],
    'E-commerce Platinum': ['ABSIT21', 'ABSIT23', 'ABSIT25', 'ABSIT46', 'ABSIT48', 'ABSIT50'],
    'E-commerce Premium': ['ABSIT22', 'ABSIT24', 'ABSIT26', 'ABSIT47', 'ABSIT49', 'ABSIT51'],
    'LocalVisibilité': ['ABSIT106', 'ABSIT40', 'ABSIT41', 'ABSIT42'],
    'LocalAudience': ['ABSIT43-PK', 'ABSIT44-PK', 'ABSIT45-PK'],
    'LocalBoost': ['ABADW4', 'ABADW6', 'ABADW8', 'ABADW10', 'ABADW14'],
    'LocalBoost+': ['ABADW5', 'ABADW7', 'ABADW9', 'ABADW11', 'ABADW13'],
    'Campagne sur mesure': ['ABADW12', 'ABADW15', 'ABADW16', 'ABADW17'],
    'LocalPrésence': ['ABLP01', 'ABLP02', 'ABLP03', 'ABLP04'],
    'LocalResto': ['ABSIT73', 'ABSIT74', 'ABSIT75'],
    'LocalResto Webtool': ['ABSIT99', 'ABSIT100', 'ABSIT101'],
    'LocalResto Boutique': ['ABSIT102', 'ABSIT103', 'ABSIT104'],
    'LocalHôtel': ['ABSIT70', 'ABSIT71', 'ABSIT72'],
    'LocalAuto': ['ABSIT64', 'ABSIT65', 'ABSIT66'],
    'LocalImmo': ['ABSIT67', 'ABSIT68', 'ABSIT69'],
    'LocalAutoPlus': ['ABSIT76', 'ABSIT77', 'ABSIT78'],
    'LocalImmoPlus': ['ABSIT79', 'ABSIT80', 'ABSIT81'],
    'LocalShop': ['ABSIT58', 'ABSIT59', 'ABSIT60'],
    'LocalShop avec migration': ['ABSIT61', 'ABSIT62', 'ABSIT63'],
    'LocalBoutique': ['ABSIT84', 'ABSIT85', 'ABSIT86'],
    'LocalBoutique Webtool': ['ABSIT93', 'ABSIT94', 'ABSIT95'],
    'LocalBoutique Agenda': ['ABSIT96', 'ABSIT97', 'ABSIT98'],
};

const TYPE_OFFER = 'offer';
const TYPE_OPTION = 'option';

function getObject(entity, objectId) {
    return requestHelpers.securedAxiosInstance.get(
        `${process.env.LOCALETMOI_BASE_URL}/api/salesforce/${entity}/${objectId}`
    );
}

function getAttachments(accountId) {
    const url = `${process.env.LOCALETMOI_BASE_URL}/api/salesforce/account/${accountId}/attachments`;
    return requestHelpers.securedAxiosInstance.get(
        url
    ).then(data => data.records);
}

async function parseAttachment(attachmentId, type, date) {
    const document = await getContentDocumentId(attachmentId);
    if (document.length > 0) {
        const result = document[0];
        if (result) {
            let documentName = await getVersionData(result.ContentDocumentId);
            const versionData = documentName[0].VersionData;
            documentName = documentName[0].PathOnClient;
            return { documentName, type, versionData, date: dateHelpers.format(date) };
        }
    }
}

async function getContentDocumentId(documentId) {
    const url = `${process.env.LOCALETMOI_BASE_URL}/api/salesforce/document/${documentId}/content`;
    return requestHelpers.securedAxiosInstance.get(
        url
    ).then(data => {
        return data.records;
    });
}

async function getVersionData(contentDocumentId) {
    const url = `${process.env.LOCALETMOI_BASE_URL}/api/salesforce/content/${contentDocumentId}/version`;
    return requestHelpers.securedAxiosInstance.get(
        url
    ).then(data => {
        return data.records;
    });
}

async function getFilesInfo(documentIds) {
    const url = `${process.env.LOCALETMOI_BASE_URL}/api/salesforce/content`;
    if (!documentIds) {
        return Promise.resolve([]);
    }
    return requestHelpers.securedAxiosInstance.post(
        url,
        {
            documentIds: documentIds
        }
    ).then(data => {
        return data.records;
    });
}

async function parseFiles(fileIds) {
    const filesInfo = await getFilesInfo(fileIds);
    const files = [];

    await Promise.all(filesInfo.map(async file => {
        const date = dateHelpers.format(file.CreatedDate);
        let documentName = file.Title;
        if (documentName.includes('Facture') || documentName.includes('Avoir')) {
            const result = await getVersionData(file.Id);
            documentName = result[0].PathOnClient;
            const versionData = result[0].VersionData;
            files.push({ documentName, type: 'Facture / Avoir', versionData, date });
        }
    }));

    return files;
}

function getRib(accountId) {
    const url = `${process.env.LOCALETMOI_BASE_URL}/api/salesforce/account/${accountId}/rib`;
    return requestHelpers.securedAxiosInstance.get(
        url
    ).then(data => {
        if (data.totalSize > 0) {
            return data.records[0];
        }
        return null;
    });
}

function getContact(accountId) {
    const url = `${process.env.LOCALETMOI_BASE_URL}/api/salesforce/account/${accountId}/contacts`;
    return requestHelpers.securedAxiosInstance.get(
        url
    ).then(data => {
        if (data.totalSize > 0) {
            return data.records.find(contact => contact.Contact_Principal__c) || data.records[0];
        }
        return null;
    });
}

function getTask(accountId) {
    const url = `${process.env.LOCALETMOI_BASE_URL}/api/salesforce/account/${accountId}/task`;
    return requestHelpers.securedAxiosInstance.get(url)
        .then(data => data.totalSize > 0 ? data.records[0] : null);
}

function getTaskTracking(opportunityId) {
    return requestHelpers.securedAxiosInstance.get(
        `${process.env.LOCALETMOI_BASE_URL}/api/salesforce/opportunity/${opportunityId}/taskTracking`
    )
}

function getOpportunities(accountId) {
    const url = `${process.env.LOCALETMOI_BASE_URL}/api/salesforce/account/${accountId}/opportunities`;
    return requestHelpers.securedAxiosInstance.get(url)
        .then(response => {
            let opportunities = response.records;
            if (!opportunities || !opportunities.length) {
                return [];
            }
            opportunities = opportunities.filter(availableOpportunityFilter);
            // Sort from oldest to newest
            opportunities.sort((a, b) => a.CloseDate > b.CloseDate ? 1 : -1);

            opportunities.forEach(opportunity => {
                const hasSeveralOpportunities = opportunities.length > 1;
                loadProductsFromOpportunity(
                    opportunity,
                    isAdsOpportunity(opportunity) && hasSeveralOpportunities ? TYPE_OPTION : TYPE_OFFER
                );
            });

            // Load offers
            getOfferOpportunities(opportunities).forEach(opportunity => {
                if (!opportunity.OpportunityLineItems || !opportunity.OpportunityLineItems.records) {
                    return;
                }

                opportunity.OpportunityLineItems.records.forEach(opportunityLineItem => {
                    const productCode = opportunityLineItem.PricebookEntry.Product2.ProductCode;
                    const offerName = getOfferName(productCode);
                    if (offerName) {
                        addOffer({
                            id: opportunityLineItem.Id,
                            name: offerName,
                            contractNumber: opportunity.Name,
                            date: opportunityLineItem.CreatedDate,
                            cms: opportunityLineItem.API_CMS__c,
                            productCode: productCode,
                            signatureDate: opportunity.CloseDate,
                        });
                    }
                });
            });

            return opportunities;
        });
}

/**
 * @param {{StageName, Actif__c}} opportunity
 * @returns {boolean}
 */
function availableOpportunityFilter(opportunity) {
    return ['Annulé', 'Perdu', 'Annulation'].indexOf(opportunity.StageName) < 0
        && true === opportunity.Actif__c;
}

async function loadProductsFromOpportunity(opportunity, opportunityType) {
    if (!opportunity) {
        return;
    }

    // visibilityOffer = dispatch infos over 30 differents plateformes
    let isLocalRestoBoutique = ['LocalResto Boutique'];
    let isLocalRestoWebtool = ['LocalResto Webtool', ...isLocalRestoBoutique];
    let isLocalResto = ['LocalResto', ...isLocalRestoWebtool];
    let localBoostOffers = ['LocalBoost', 'LocalBoost+', 'Campagne sur mesure'];
    let webtoolOffersWithNoVisibility = ['LocalWeb', 'LocalStart', ...localBoostOffers];
    let isToolboxOffers = ['LocalHôtel', 'LocalAuto', 'LocalImmo', 'LocalAutoPlus', 'LocalImmoPlus', 'LocalBoutique', ...isLocalResto];
    let isLocalHotel = ['LocalHôtel'];
    let isLocalShop = ['LocalShop', 'LocalShop avec migration'];
    let isLocalShopWithMigration = ['LocalShop avec migration'];
    let isUbiflowOffers = ['LocalAuto', 'LocalImmo', 'LocalAutoPlus', 'LocalImmoPlus'];
    let isLocalAuto = ['LocalAuto'];
    let isLocalAutoPlus = ['LocalAutoPlus'];
    let isLocalImmo = ['LocalImmo'];
    let isLocalImmoPlus = ['LocalImmoPlus'];
    let isOldLocalBoutique = ['LocalBoutique'];
    let isNewLocalBoutique = ['LocalBoutique Webtool', 'LocalBoutique Agenda'];
    let isLocalBoutique = ['LocalBoutique', ...isNewLocalBoutique, 'LocalResto Boutique'];
    let isWebtoolOffers = ['LocalVisibilité', 'LocalAgenda', 'LocalAudience', 'LocalWeb', 'LocalStart', ...isNewLocalBoutique, ...isLocalRestoWebtool];
    let visibilityOffers = ['LocalVisibilité', 'LocalAgenda', 'LocalAudience', 'LocalPrésence', 'E-commerce Platinum', 'E-commerce Premium', ...isToolboxOffers, ...isLocalShop, ...isLocalBoutique];
    let logoCreation = 'LOG01';
    let photosReport10 = 'RPHOT01';
    let photosReport20 = 'RMET01';
    let virtualVisit = 'RVID01';
    let photosVideoReport10 = 'RVID02';
    let adwordCampaign = 'ABADW';

    if (!opportunity.OpportunityLineItems
        || !opportunity.OpportunityLineItems.records
        || !opportunity.OpportunityLineItems.records.length
    ) {
        return;
    }

    if (opportunity.CloseDate) {
        const calculatedSignatureDate = momentBusinessDays(opportunity.CloseDate, 'YYYY-MM-DD')
            .businessAdd(8);
        const currentDate = momentBusinessDays();
        store.dispatch('globalStore/setHasSharedSpaceAccess', (calculatedSignatureDate && currentDate <= calculatedSignatureDate) || !calculatedSignatureDate);
    }

    opportunity.OpportunityLineItems.records.map(async opportunityLineItem => {
        let productCode = opportunityLineItem.PricebookEntry.Product2.ProductCode;

        switch (true) {
            case productCode === logoCreation:
                store.commit('globalStore/toggleHasLogoCreation', true);
                break;
            case productCode === photosReport10:
                store.commit('globalStore/toggleHasPhotosReport10', true);
                break;
            case productCode === photosReport20:
                store.commit('globalStore/toggleHasPhotosReport20', true);
                break;
            case productCode === virtualVisit:
                store.commit('globalStore/toggleHasVirtualVisit', true);
                break;
            case productCode === photosVideoReport10:
                store.commit('globalStore/toggleHasPhotosVideoReport10', true);
                break;
        }

        if ('R' === productCode[0]) {
            productCode = productCode.substr(1);
        }
        const offerName = getOfferName(productCode);
        if (!offerName) {
            return;
        }

        if (!store.state.globalStore.partner.hasVisibility) {
            store.dispatch('globalStore/toggleHasVisibility', !webtoolOffersWithNoVisibility.includes(offerName));
        }

        if (!store.state.globalStore.status.isWebtool) {
            store.dispatch('globalStore/toggleIsWebtool', isWebtoolOffers.includes(offerName));
        }
        if (visibilityOffers.includes(offerName)) {
            store.dispatch('globalStore/toggleHasVisibility', true);
            if (isToolboxOffers.includes(offerName)) {
                store.dispatch('globalStore/toggleIsToolbox', true);
                if (-1 !== isLocalHotel.indexOf(offerName)) {
                    store.dispatch('globalStore/toggleIsLocalHotel', true);
                }
                if (isLocalResto.includes(offerName)) {
                    store.dispatch('globalStore/toggleIsLocalResto', true);
                    store.dispatch('globalStore/toggleIsLocalRestoWebtool', isLocalRestoWebtool.includes(offerName));
                    store.dispatch('globalStore/toggleIsLocalRestoBoutique', isLocalRestoBoutique.includes(offerName));
                }
                if (isUbiflowOffers.includes(offerName)) {
                    store.dispatch('globalStore/toggleIsUbiflow', true);
                    store.dispatch('globalStore/setUbiflowLink', websiteService.getUbiflowUrl());
                    if (isLocalAuto.includes(offerName)) {
                        store.dispatch('globalStore/toggleIsLocalAuto', true);
                    }
                    if (isLocalAutoPlus.includes(offerName)) {
                        store.dispatch('globalStore/toggleIsLocalAutoPlus', true);
                    }
                    if (isLocalImmo.includes(offerName)) {
                        store.dispatch('globalStore/toggleIsLocalImmo', true);
                    }
                    if (isLocalImmoPlus.includes(offerName)) {
                        store.dispatch('globalStore/toggleIsLocalImmoPlus', true);
                    }
                }
            }
            if ('LocalPrésence' === offerName) {
                store.dispatch('globalStore/toggleIsWebtool', false);
                store.dispatch('globalStore/toggleIsLocalPresence', true);
            }
            if (isLocalShop.includes(offerName)) {
                store.dispatch('globalStore/toggleIsWebtool', false);
                store.dispatch('globalStore/toggleIsToolbox', false);
                store.dispatch('globalStore/toggleIsLocalShop', true);
                store.dispatch('globalStore/toggleIsEcommerce', true);
            }
            if (isLocalShopWithMigration.includes(offerName)) {
                store.dispatch('globalStore/toggleIsLocalShopWithMigration', true);
            }
            if (isLocalBoutique.includes(offerName)) {
                store.dispatch('globalStore/toggleIsLocalShop', false);
                store.dispatch('globalStore/toggleIsLocalBoutique', true);
                store.dispatch('globalStore/toggleIsNewLocalBoutique', isNewLocalBoutique.includes(offerName));
                store.dispatch('globalStore/toggleIsOldLocalBoutique', isOldLocalBoutique.includes(offerName));
            }
        }

        if (isWebtoolOffers.includes(offerName)) {
            if ('LocalAgenda' === offerName ||
                'LocalBoutique Agenda' === offerName) {
                store.dispatch('globalStore/toggleIsLocalAgenda', true);
            } else if ('LocalStart' === offerName) {
                store.dispatch('globalStore/toggleIsLocalStart', true);
            } else if ('LocalWeb' === offerName) {
                store.dispatch('globalStore/toggleIsLocalWeb', true);
            }
        }

        if (TYPE_OPTION === opportunityType && /ABADW\d+(-PK)?/.test(productCode)) {
            store.commit('globalStore/toggleHasAdwordsCampaign', true);
        }

        if (TYPE_OFFER === opportunityType && localBoostOffers.includes(offerName)) {
            store.dispatch('globalStore/toggleIsLocalBoost', true);
        }

        if (store.state.globalStore.status.isLocalBoost ||
            store.state.globalStore.status.hasAdwordsCampaign) {
            store.dispatch('globalStore/setAdplorerInformation',
                await adplorerService.getCustomerInformation(
                    store.state.account.currentPartner.customerCode,
                    store.state.globalStore.salesforce.account.Agence__c
                ),
                { root: true }
            );
        }
    });
}

function getOfferName(productCode) {
    for (const offerName in offersTab) {
        if (offersTab[offerName].find(item => (new RegExp(`^R?${item}(-PK)?$`)).test(productCode))) {
            return offerName;
        }
    }

    return null;
}

function addOffer(offer) {
    let found = getOffer(offer.id);
    if (!found) {
        store.commit('globalStore/addOffer', offer);
    }
}

function getOffer(id) {
    let offers = getOffers();
    for (let key in offers) {
        if (id === offers[key].id) {
            return offers[key];
        }
    }

    return null;
}

function getOffers() {
    return store.state.globalStore.offers;
}

function setOffers(offers) {
    return store.dispatch('globalStore/setOffers', { offers });
}

function findCurrentOffer() {
    let offers = getOffers();
    if (offers && offers.length) {
        let avalaibleOffers = offers.filter(offer => {
            if (/^R?ABADW/.test(offer.productCode)) {
                // Look for original contrat that is related to this Ads offer
                let matches = offer.contractNumber.match(/^((E-)?\d+)-ads$/);
                if (matches) {
                    // If this ads offer is linked to an original contract, skip it
                    if (offers.find(item => item.name === matches[1])) {
                        return null;
                    }
                }
            }

            return offer;
        });
        if (avalaibleOffers.length) {
            return avalaibleOffers[0];
        }
    }

    return null;
}

/**
 * Returns the most recent opportunity
 *
 * @param opportunities
 * @returns {null|*}
 */
function findCurrentOpportunity(opportunities) {
    if (opportunities && opportunities.length) {
        // sort from newest to oldest
        let offerOpportunities = getOfferOpportunities(opportunities)
            .sort((a, b) => a.CloseDate > b.CloseDate ? -1 : 1);
        if (offerOpportunities.length) {
            return offerOpportunities[0];
        }
    }

    return null;
}

function getOfferOpportunities(opportunities) {
    return opportunities.filter(opportunity => {
        // Look for original contrat that is related to this Ads opportunity
        const matches = opportunity.Name.match(/^((E-)?\d+)-ads$/);
        // If this ads opportunity is linked to an original contract, skip it
        return matches && opportunities.find(item => item.Name === matches[1]) ? null : opportunity;
    });
}

function downloadFile(file) {
    const filePathParts = file.versionData.split('/');
    const versionId = filePathParts[filePathParts.length - 2];
    const url = `${process.env.LOCALETMOI_BASE_URL}/api/salesforce/content/version/${versionId}`;
    return requestHelpers.securedAxiosInstance({
        url: url,
        method: 'GET',
        responseType: 'blob'
    });
}

function getTickets(accountId) {
    return requestHelpers.securedAxiosInstance.get(
        `${process.env.LOCALETMOI_BASE_URL}/api/salesforce/account/${accountId}/tickets`
    ).then(data => {
        return data.records;
    });
}

function getPickList(apiObjectName, fieldName) {
    return requestHelpers.securedAxiosInstance.get(
        `${process.env.LOCALETMOI_BASE_URL}/api/salesforce/picklist/${apiObjectName}/${fieldName}`
    ).then(data => data.values.map(item => item.value));
}

function updateTicket(ticketId, payload) {
    return requestHelpers.securedAxiosInstance.patch(
        `${process.env.LOCALETMOI_BASE_URL}/api/salesforce/ticket/${ticketId}`,
        payload
    );
}

function createTicket(data) {
    return requestHelpers.securedAxiosInstance.post(
        `${process.env.LOCALETMOI_BASE_URL}/api/salesforce/account/${data.accountId}/tickets`,
        {
            'AccountId': data.accountId,
            'CMS__c': data.cms,
            'ContactId': data.contactId,
            'Description': data.description,
            'Origin': data.origin,
            'Subject': data.subject,
            'Estimation_ticket__c': data.type || undefined,
            'Type_de_Ticket__c': data.category || undefined,
            'Priority': data.priority,
        }
    );
}

function updateObject(endpoint, id, data) {
    const url = `${process.env.LOCALETMOI_BASE_URL}/api/salesforce/${endpoint}/${id}`;
    return requestHelpers.securedAxiosInstance.patch(
        url,
        data
    );
}

function getBriefAppointmentInfo(accountId) {
    const recordsTypeIds = [
        process.env.SALESFORCE_BRIEF_EVENT_RECORD_TYPE_ID,
        process.env.SALESFORCE_CLICK_COLLECT_BRIEF_EVENT_RECORD_TYPE_ID,
    ];
    return requestHelpers.securedAxiosInstance.get(
        `${process.env.LOCALETMOI_BASE_URL}/api/salesforce/accounts/${accountId}/events`,
        { params: { recordTypeIds: recordsTypeIds.join(',') } }
    ).then(data => data.records.length ? data.records[0] : null);
}

function isAdsOpportunity(opportunity) {
    return /-ads$/.test(opportunity.Name) ||
        (1 === opportunity.OpportunityLineItems.records.length &&
            /^R?ABADW\d+$/.test(opportunity.OpportunityLineItems.records[0].PricebookEntry.Product2.ProductCode
            )); 
}

function getUserByUsername(username) {
    return requestHelpers.securedAxiosInstance.get(
        `${process.env.LOCALETMOI_BASE_URL}/api/salesforce/user`,
        {
            params: {
                username
            }
        }
    );
}
