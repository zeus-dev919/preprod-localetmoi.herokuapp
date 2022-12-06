import {
    amazonService,
    localfrApiService,
    mailService,
    salesforceService,
    websiteService,
    webtoolService,
    dropboxService,
    sortTabsService,
    atInternetService,
    microWebService,
    socketService
} from '@/_services';
import { authDpHelper } from "../_helpers";
import { account } from "./account.store";
import moment from "moment/moment";

let getInitialState = function() {
    return {
        status: {
            isCurrentMainUserOnPf: false,
            isStartTimerForWaiting: false,
            isRequestForAccessIsActive: false,
            isStartTimer: false,
            isQrcodeEnabled: false,
            isPageLoading: false,
            isSalesforceAccountLoading: false,
            isSalesforceContactLoading: false,
            isSalesforceTaskLoading: false,
            isSalesforceOpportunitiesLoading: false,
            isSalesforceDocumentsLoading: false,
            isSalesforceProductionValidated: false,
            isLocalBoost: false,
            isLocalStart: false,
            isLocalWeb: false,
            isLocalPresence: false,
            isWebtool: false,
            isToolbox: false,
            isEcommerce: false,
            isLocalShop: false,
            isLocalShopWithMigration: false,
            isUbiflow: false,
            isLocalAuto: false,
            isLocalAutoPlus: false,
            isLocalImmo: false,
            isLocalImmoPlus: false,
            isLocalHotel: false,
            isLocalResto: false,
            isLocalBoutique: false,
            isLocalRestoBoutique: false,
            isLocalRestoWebtool: false,
            isNewLocalBoutique: false,
            isOldLocalBoutique: false,
            isLocalAgenda: false,
            isVisibilityOfferBeforeUberall: false,
            passwordResetForm: false,
            isPasswordResetting: false,
            isNewBillingInfoSending: false,
            isNewDropobNotification: false,
            isNotifyingUploadedFiles: false,
            isDropboxEmailSent: false,
            isGetRecentFolderLoading: false,
            websiteInfoDisabled: true,
            updateWebsiteDisabled: true,
            isWebsiteOnline: false,
            isUploadingDropboxFileSending: false,
            isDownloadingDropboxFileSending: false,
            isSalesforceTicketLoading: false,
            isSalesforceTicketsLoading: false,
            isSalesforceTicketCreating: false,
            isSalesforceTicketUpdating: false,
            isSalesforceTicketThreadLoading: false,
            isSalesforceTicketAttachmentSending: false,
            isS3Uploading: false,
            isRibLoading: false,
            isLoadingVisits: false,
            isLoadingSources: false,
            isUberallAutologinLoading: false,
            isUberallAutologinFailure: false,
            isWebsiteAutologinLoading: false,
            isRetrieveListingsFailure: false,
            isRetrieveListingsLoading: false,
            isRetrievingUpdatedPf: false,
            isConnectingToAtInternet: false,
            isContactMessagesLoading: false,
            isCountContactMessagesLoading: false,
            isNbrSubscriberLoading: false,
            isFilesSubmitting: false,
            isPaymentModesLoading: false,
            isLanguagesLoading: false,
            isPortalsLoading: false,
            hasLogoCreation: false,
            hasPhotosReport10: false,
            hasPhotosReport20: false,
            hasVirtualVisit: false,
            hasPhotosVideoReport10: false,
            hasAdwordsCampaign: false,
            hasMostRecentFolder: false,
            hasPartnerFolderAccess: true,
            hasSharedSpaceAccess: false,
            reportHasBeenSent: false,
            isSalesforceBriefAppointmentInfoLoading: false,
            mostRecentFolder: {
                path: '',
                multipleFolders: [],
                message: ''
            }
        },
        salesforce: {
            account: {
                Agence__c: null,
                BillingCity: null,
                BillingPostalCode: null,
                BillingStreet: null,
                Code_Ape__c: null,
                Code_Sage__c: '',
                Date_de_cr_ation__c: null,
                Id: null,
                Industry: null,
                Libell_code_APE__c: null,
                List_ContentDocumentId__c: null,
                Name: null,
                Ownership: null,
                Phone: null,
                Raison_sociale__c: null,
                Satisfaction_client__c: 0,
                Siren__c: null,
                Nic__c: null,
                Site_Local_fr__c: null,
                Website: null,
                Date_Mise_en_ligne_Site__c: null
            },
            brief: {
                date: null,
                callResult: null,
                ownerName: null
            },
            contact: {
                Id: null,
                Birthdate: null,
                Email: null,
                FirstName: null,
                LastName: null,
                MobilePhone: null,
                Phone: null
            },
            opportunity: {
                Signalement__c: null,
                Signalement_Commentaire__c: null,
                Cr_ation_logo__c: null,
            },
            taskTracking: {
                NDD_transf_rer__c: null,
                Registrar__c: null,
                Adresses_Mail_liees_coche__c: null,
                Adresses_Mail_liees__c: null,
                Offres_sp_cifiques_exchange__c: null,
            },
            dpValidated: {
                canEdit: null,
                validatedDpDate: null
            },
            agenda: {
                crm: null,
                visio: null,
                online: null
            },
            opportunities: null,
        },
        adplorer: {
            companyId: null,
            orderId: null
        },
        ubiflowLink: null,
        websiteLink: null,
        websitePublicationDate: null,
        partner: {
            hasVisibility: false,
            url: {
                webtool: null,
                toolbox: null,
                ecommerce: null,
            },
            hasRib: false,
            boutiqueUrl: null,
            isLoading: false,
            loaded: null,
            toolBoxUrl: null
        },
        uberall: {
            listingsTab: null,
            listingsLength: null
        },
        atInternetInformation: null,
        filterAudienceRange: null,
        atInternetVisitsData: null,
        atInternetSourceData: null,
        webtool: {
            newsletter: {
                userList: [],
                nbrUser: 0
            }
        },
        offers: [],
        paymentModes: {},
        languages: {},
        portals: {},
        documents: [],
        salesforceTickets: [],
        salesforceTicketThread: []
    };
};

const state = getInitialState();

const actions = {
    async getNewsletterNbr ({dispatch, commit}) {
        commit('getNumberOfSubscriberRequest');
        return webtoolService.getNewsletterNbr().then(
            response => {
                dispatch('setNumberOfUser', response);
                commit('getNumberOfSubscriberSuccess');
            }, error => {
                console.error(error);
                commit('getNumberOfSubscriberFailure');
                dispatch(
                    'alert/error',
                    {
                        group: 'no-ticket',
                        title: 'Service indisponible',
                        type: 'error',
                        show: true,
                        text: 'Impossible d\'afficher le nombre d\'inscrits à votre newsletter'
                    },
                    {root: true}
                );
            });
    },
    // webtool newsletter
    setNumberOfUser ({commit}, listOfSites) {
        if (listOfSites.length !== 0) {
            let subscribers = [];
            for (let site in listOfSites) {
                listOfSites[site].forEach(function(item){
                    subscribers.push(item.email);
                });
            }
            commit('setSubscribers', subscribers);
            commit('setNumberOfSubscribers', subscribers.length);
        } else {
            commit('setNumberOfSubscribers', 0);
        }
    },
    setIsOldOpportunityBeforeUberall({ commit, state }) {
        if (state.salesforce && state.salesforce.opportunity) {
            const signatureDate = moment(state.salesforce.opportunity.CloseDate, 'YYYY-MM-DD');
            const uberallOffersStartDate = moment('2018-10-01', 'YYYY-MM-DD');
            commit('setIsVisibilityOfferBeforeUberall', signatureDate < uberallOffersStartDate);
        }
    },
    getUberallListings ({dispatch, commit}) {
        dispatch('setIsOldOpportunityBeforeUberall');
        if (!state.partner.hasVisibility) {
            return dispatch(
                'alert/warn',
                {
                    group: 'general-error',
                    message: 'Pour souscrire à ce service, contactez votre commercial ou assistante d’agence.',
                    show: true,
                    title: 'Service visibilité non souscrit',
                    type: 'error'
                },
                {root: true}
            );
        }
        
        if (state.status.isVisibilityOfferBeforeUberall) {
            return;
        }
        commit('getRetrieveListingsRequest');

        return microWebService.getListings().then(
            response => {
                dispatch('setListingsTabs', response.listings || []);
            }, error => {
                console.error(error);
                commit('getRetrieveListingsFailure');
                dispatch(
                    'alert/error',
                    {
                        group: 'general-error',
                        message: 'Impossible d\'accéder à votre bilan de visibilité.',
                        show: true,
                        title: 'Service indisponible',
                        type: 'error'
                    },
                    {root: true}
                );
            }
        );
    },
    // uberall listings
    setListingsTabs ({commit}, listings) {
        listings.sort(sortTabsService.sortTabs('type', 'asc'));
        for (var i = 0; i < listings.length; i++) {
            listings[i].urlImage = process.env.UBERALL_PUBLIC_IMAGES + listings[i].type + '.png';
        }
        commit('setUberallListing', listings);
        commit('getRetrieveListingsSuccess');
    },
    getUberallAutologin ({dispatch, commit}, {email, page}) {
        dispatch('setIsOldOpportunityBeforeUberall');
        if (!state.partner.hasVisibility) {
            return dispatch(
                'alert/warn',
                {
                    group: 'general-error',
                    message: 'Pour souscrire à ce service, contactez votre commercial ou assistante d’agence.',
                    show: true,
                    title: 'Service visibilité non souscrit',
                    type: 'error'
                },
                {root: true}
            );
        }

        if (state.status.isVisibilityOfferBeforeUberall) {
            return; 
        }
        commit('getUberallAutologinRequest');

        return microWebService.getUberallAutologin(email, page).then(
            response => {
                commit('getUberallAutologinSuccess');
                dispatch('openUberallAutologinLink', response.autologinLink);
            }, error => {
                commit('getUberallAutologinFailure');
                dispatch(
                    'alert/error',
                    {
                        group: 'general-error',
                        message: 'Impossible d\'accéder à ce compte visibilité.',
                        show: true,
                        title: 'Service indisponible',
                        type: 'error'
                    },
                    {root: true}
                );
            }
        );
    },
    openUberallAutologinLink ({}, link) {
        window.open(link);
    },
    loadPartnerInformation({dispatch, commit}, customerCode) {
        return localfrApiService.getPartner(customerCode).then(
            partners => {
                let partner = partners['hydra:member'][0];
                if (!partner) {
                    return;
                }
                if (partner.customerCode !== customerCode) {
                    return;
                }
                let accountId = partner.company;
                dispatch('account/setCurrentPartner', {currentPartner: partner}, {root: true});
                commit('toggleIsWebtool', 'webtool' === partner.source);
                return Promise.all([
                    dispatch('getSalesforceAccount', {accountId}),
                    dispatch('getSalesforceContact', {accountId}),
                    dispatch('getSalesforceOpportunities', {accountId})
                ]);
            },
            (error) => console.error(error));
    },
    getSalesforceTicket({dispatch, commit}, {ticketId}) {
        commit('getSalesforceTicketRequest');

        return salesforceService.getTicket(ticketId).then(
            response => {
                commit('getSalesforceTicketSuccess');

                return response;
            }, error => {
                console.error(error);
                commit('getSalesforceTicketFailure');
                dispatch(
                    'alert/error',
                    {
                        group: 'general-error',
                        message: 'Impossible créer le ticket de support.',
                        show: true,
                        title: 'Service indisponible',
                        type: 'error'
                    },
                    {root: true}
                );
            }
        );
    },
    createSalesforceTicket({dispatch, commit}, {data}) {
        commit('createSalesforceTicketRequest');

        return salesforceService.createTicket(data).then(
            response => {
                commit('createSalesforceTicketSuccess');

                return response;
            }, error => {
                console.error(error);
                commit('createSalesforceTicketFailure');
                dispatch(
                    'alert/error',
                    {
                        group: 'general-error',
                        message: 'Impossible créer le ticket de support.',
                        show: true,
                        title: 'Service indisponible',
                        type: 'error'
                    },
                    {root: true}
                );
            }
        );
    },
    updateSalesforceTicket({dispatch, commit}, {ticketId, data}) {
        commit('updateSalesforceTicketRequest');

        return salesforceService.updateTicket(ticketId, data).then(
            response => {
                commit('updateSalesforceTicketSuccess');

                return response;
            }, error => {
                console.error(error);
                commit('updateSalesforceTicketFailure');
                dispatch(
                    'alert/error',
                    {
                        group: 'general-error',
                        message: 'Impossible créer le ticket de support.',
                        show: true,
                        title: 'Service indisponible',
                        type: 'error'
                    },
                    {root: true}
                );
            }
        );
    },
    uploadDropboxFile({dispatch, commit}, {folderName, subFolder, file, message}) {
        commit('uploadDropboxFileRequest');
        commit('isFilesSubmitting', true);

        return dropboxService.uploadFile(folderName, subFolder, file, message)
            .then(response => {
                commit('uploadDropboxFileSuccess');
                commit('isFilesSubmitting', false);
                dispatch(
                    'alert/success',
                    {
                        group: 'success',
                        message: 'Vos fichiers ont bien été envoyés !',
                        show: true,
                        title: 'Envoyé !',
                        type: 'success'
                    },
                    {root: true}
                )
                return response;
            }).catch(error => {
                console.error(error);
                commit('uploadDropboxFileFailure');
                commit('isFilesSubmitting', false);
                dispatch(
                    'alert/error',
                    {
                        group: 'general-error',
                        message: 'Impossible d\'envoyer le fichier.',
                        show: true,
                        title: 'Service indisponible',
                        type: 'error'
                    },
                    {root: true}
                );

                return {
                    error: error
                };
            });
    },
    getMostRecentFolder({dispatch, commit}, {customerCode, companyName, subFolder}) {
        commit('getMostRecentFolderPathRequest');

        return dropboxService.getFolder(customerCode, companyName, subFolder, true)
            .then(response => {
                commit('getMostRecentFolderPathSuccess');
                commit('mostRecentFolderPath', {
                    path: response,
                    multipleFolders: response.multipleFolders,
                    hasMostRecentFolder: true,
                    message: response.message
                });

                return response;
            }).catch(error => {
                console.error(error);
                commit('getMostRecentFolderPathFailure');
                dispatch(
                    'alert/error',
                    {
                        group: 'general-error',
                        message: 'Impossible de récuperer le dossier le plus récent.',
                        show: true,
                        title: 'Service indisponible',
                        type: 'error'
                    },
                    {root: true}
                );
            });
    },
    async downloadDropboxFile({dispatch, commit}, {folderName, subFolder, file}) {
        commit('downloadDropboxFileRequest');

        return dropboxService.downloadFile(folderName, subFolder, file).then(
            response => {
                commit('downloadDropboxFileSuccess');
                return response;
            }, error => {
                console.error(error);
                commit('downloadDropboxFileFailure');
                dispatch(
                    'alert/error',
                    {
                        group: 'general-error',
                        message: 'Impossible d\'ajouter les fichiers au ticket de support.',
                        show: true,
                        title: 'Service indisponible',
                        type: 'error'
                    },
                    {root: true}
                );
            }
        );
    },
    async s3Upload({dispatch, commit}, {sageCode, file}) {
        commit('s3UploadRequest');

        return amazonService.s3UploadFile(sageCode, file).then(
            link => {
                commit('s3UploadSuccess');
                return link;
            }, error => {
                console.error(error);
                commit('s3UploadFailure');
                dispatch(
                    'alert/error',
                    {
                        group: 'general-error',
                        message: 'Impossible d\'ajouter les fichiers au ticket de support.',
                        show: true,
                        title: 'Service indisponible',
                        type: 'error'
                    },
                    {root: true}
                );
            }
        );
    },
    getTickets({dispatch, commit}, {accountId}) {
        commit('getSalesforceTicketsRequest');

        return salesforceService.getTickets(accountId).then(
            response => {
                let tickets = response.map(ticket => ({
                    id: ticket.id,
                    subject: ticket.Subject,
                    status: ticket.Status,
                    description: ticket.Description,
                    date: ticket.createdAt,
                    createdBy: ticket.CreatedById,
                    createdDate: ticket.CreatedDate ? new Date(ticket.CreatedDate).toLocaleString() : null,
                    closedDate: ticket.ClosedDate ? new Date(ticket.ClosedDate).toLocaleString() : null
                }));
                commit('getSalesforceTicketsSuccess', {tickets});

                return tickets;
            }, error => {
                console.error(error);
                commit('getSalesforceTicketsFailure');
                dispatch(
                    'alert/error',
                    {
                        group: 'general-error',
                        message: 'Impossible d\'accéder à vos demandes pour le moment.',
                        show: true,
                        title: 'Service indisponible',
                        type: 'error'
                    },
                    {root: true}
                );
            }
        );
    },
    sendNewBillingInfoMail ({dispatch, commit}, {data}) {
        commit('sendNewBillingInfoMailRequest');

        return mailService.sendNewBillingInfoMail(data).then(
            () => {
                commit('sendNewBillingInfoMailSuccess');
                dispatch(
                    'alert/success',
                    {
                        group: 'mail-sent',
                        message: 'Vos nouvelles coordonnées ont été transmises et seront prises en compte sous 48h.',
                        show: true,
                        title: 'Merci !',
                        type: 'success'
                    },
                    {root: true}
                );
            }, () => {
                commit('sendNewBillingInfoMailFailure');
                dispatch(
                    'alert/error',
                    {
                        group: 'general-error',
                        message: 'L\'envoi du mail a échoué.',
                        show: true,
                        title: 'Envoi impossible',
                        type: 'error'
                    },
                    {root: true}
                );
            }
        );
    },
    sendDropboxNotification ({dispatch, commit}, {customerCode, source, folders}) {
        commit('sendDropboxNotificationRequest');

        return mailService.sendDropboxNotification(customerCode, source, folders).then(
            () => {
                commit('sendDropboxNotificationSuccess');
                commit('isDropboxEmailSent', true);
            }, () => {
                commit('sendDropboxNotificationFailure');
                dispatch(
                    'alert/error',
                    {
                        group: 'general-error',
                        message: 'L\'envoi du mail a échoué.',
                        show: true,
                        title: 'Envoi impossible',
                        type: 'error'
                    },
                    {root: true}
                );
            }
        );
    },
    notifyUploadedFiles ({dispatch, commit}, {customerCode, source, files, folderName}) {
        commit('notifyUploadedFilesRequest');

        return mailService.notifyUploadedFiles(customerCode, source, files, folderName).then(
            () => {
                commit('notifyUploadedFilesSuccess');
            }, () => {
                commit('notifyUploadedFilesFailure');
                dispatch(
                    'alert/error',
                    {
                        group: 'general-error',
                        message: 'L\'envoi du mail a échoué.',
                        show: true,
                        title: 'Envoi impossible',
                        type: 'error'
                    },
                    {root: true}
                );
            }
        );
    },
    sendResetPasswordMail ({dispatch, commit}, {data}) {
        commit('sendResetPasswordMailRequest');

        return mailService.sendResetPasswordMail(data).then(
            () => {
                commit('sendResetPasswordMailSuccess');
                dispatch(
                    'alert/success',
                    {
                        group: 'mail-sent',
                        message: 'Le message a bien été envoyé !',
                        show: true,
                        title: 'Merci !',
                        type: 'success'
                    },
                    {root: true}
                );
                commit('togglePasswordResetForm', false);
            }, error => {
                let message = "L'envoi du mail a échoué.";
                if (400 === error.response.status) {
                    message = 'Adresse email incorrect.';
                }
                commit('sendResetPasswordMailFailure');
                dispatch(
                    'alert/error',
                    {
                        group: 'auth-error',
                        message: message,
                        show: true,
                        title: 'Envoi impossible',
                        type: 'error'
                    },
                    {root: true}
                );
            }
        );
    },
    getSalesforceAccount ({dispatch, commit, state}, {accountId}) {
        let accountPromise;
        if (state.status.isSalesforceAccountLoading ||
            (state.salesforce.account && state.salesforce.account.Id)
        ) {
            accountPromise = new Promise((resolve, reject) => {
                let timeout = setInterval(() => {
                    if (!state.status.isSalesforceAccountLoading ||
                        (state.salesforce.account && state.salesforce.account.Id)
                    ) {
                        clearInterval(timeout);
                        if (state.salesforce.account.Id) {
                            resolve(state.salesforce.account)
                        } else {
                            reject();
                        }
                    }
                }, 50)
            });
        } else {
            accountPromise = salesforceService.getAccount(accountId);
        }
        commit('getSalesforceAccountRequest');

        return accountPromise.then(
            async (account) => {
                commit('getSalesforceAccountSuccess', {account});
                await dispatch('setLatestAppointmentBriefInfo', state.salesforce.account.Id);
                return account;
            }, error => {
                commit('getSalesforceAccountFailure');
                console.error(error);
                dispatch(
                    'alert/error',
                    {
                        group: 'general-error',
                        message: 'Impossible de récupérer les informations de votre compte.',
                        show: true,
                        title: 'Erreur',
                        type: 'error'
                    },
                    {root: true}
                );
            }
        );
    },
    async getSalesforceTask({dispatch, commit}, {accountId}) {
        commit('getSalesforceTaskRequest');

        return salesforceService.getTask(accountId).then(
            task => {
                if (null === task) {
                    console.warn('Task into Salesforce not created');
                } else {
                    console.info('Task created into Salesforce');
                    commit('getSalesforceTaskSuccess');
                    commit('setHasPartnerFolderAccess', authDpHelper.checkPartnerFolderAccess(
                        task,
                        account.state.identity
                    ));
                }
            }, error => {
                commit('getSalesforceTaskFailure');
                console.error(error);
                dispatch(
                    'alert/error',
                    {
                        group: 'general-error',
                        message: 'Impossible de récupérer les informations des tâches en cours.',
                        show: true,
                        title: 'Erreur',
                        type: 'error'
                    },
                    {root: true}
                );
            }
        );
    },
    async setLatestAppointmentBriefInfo({commit, state}, accountId) {
        if (state.status.isSalesforceBriefAppointmentInfoLoading) {
            return;
        }
        commit('setSalesforceBriefAppointmentInfoLoadingRequest');
        return await salesforceService.getBriefAppointmentInfo(accountId).then(
            response => {
                commit('setSalesforceBriefAppointmentInfoLoadingSuccess');
                commit('setLatestAppointmentBriefInfo', response || null);
                return response;
            }
        ).catch(() => commit('setSalesforceBriefAppointmentInfoLoadingFailure'));
    },
    async getSalesforceContact ({dispatch, commit}, {accountId}) {
        let contactPromise;

        if (state.status.isSalesforceContactLoading ||
            (state.salesforce.contact && state.salesforce.contact.Id)
        ) {
            contactPromise = new Promise((resolve, reject) => {
                let timeout = setInterval(() => {
                    if (!state.status.isSalesforceContactLoading ||
                        (state.salesforce.contact && state.salesforce.contact.Id)
                    ) {
                        clearInterval(timeout);
                        if (state.salesforce.contact && state.salesforce.contact.Id) {
                            resolve(state.salesforce.contact);
                        } else {
                            reject();
                        }
                    }
                }, 50);
            });
        } else {
            contactPromise = salesforceService.getContact(accountId);
        }

        commit('getSalesforceContactRequest');
        const onFailure = (error) => {
            commit('getSalesforceContactFailure');
            console.error(error);
            dispatch(
                'alert/error',
                {
                    group: 'general-error',
                    message: 'Impossible de récupérer les informations du contact.',
                    show: true,
                    title: 'Erreur',
                    type: 'error'
                },
                {root: true}
            );
        };

        return contactPromise.then(contact => {
            if (contact) {
                commit('getSalesforceContactSuccess', { contact });

                return contact;
            }

            throw `No contact found for account ${accountId}`;
        }, onFailure).catch(onFailure);
    },
    async getSalesforceOpportunities ({dispatch, commit}, {accountId}) {
        if (state.status.isSalesforceOpportunitiesLoading || null !== state.salesforce.opportunities) {
            return new Promise((resolve, reject) => {
                let timeout = setInterval(() => {
                    if (state.status.isSalesforceOpportunitiesLoading) {
                        return;
                    }
                    clearInterval(timeout);
                    if (null !== state.salesforce.opportunities) {
                        resolve(state.salesforce.opportunities)
                    } else {
                        reject();
                    }
                }, 50)
            });
        }
        commit('getSalesforceOpportunitiesRequest');

        return salesforceService.getOpportunities(accountId)
            .then(
                opportunities => {
                    const opportunity = salesforceService.findCurrentOpportunity(opportunities);
                    commit('setOpportunity', { opportunity });
                    if (!opportunity) {
                        return [];
                    }

                    salesforceService.getTaskTracking(opportunity.Id).then(taskTracking => {
                        commit('setTaskTracking', { taskTracking });
                    });

                    dispatch('setDpValidated', authDpHelper.canEditPartnerFolder(
                        opportunity.Date_passage_DP_Valide__c,
                        account.state.identity
                    ));

                    if (opportunity.QR_Code__c) {
                        dispatch('isQrcodeEnabled', true);
                    }
                    if (opportunity.Deviseur_Visio__c) {
                        dispatch('setAgendaVisio', true);
                    }
                    if (opportunity.Deviseur_CRM__c) {
                        dispatch('setAgendaCrm', true);
                    }
                    if (opportunity.Deviseur_Agenda_en_ligne__c) {
                        dispatch('setAgendaOnline', true);
                    }

                    if ('Production Validée' === opportunity.StageName) {
                        dispatch('isProductionValidated', true);
                    }

                    if (!opportunity.Signalement__c || !opportunity.Signalement_Commentaire__c) {
                        dispatch('setReportHasBeenSent', false);
                    }

                    if (null !== opportunity.Signalement__c && null !== opportunity.Signalement_Commentaire__c) {
                        dispatch('setReport', {
                            Signalement__c: opportunity.Signalement__c,
                            Signalement_Commentaire__c: opportunity.Signalement_Commentaire__c
                        });
                        dispatch('setReportHasBeenSent', true);
                    }

                    return opportunities;
                },
                error => {
                    commit('getSalesforceOpportunitiesFailure');
                    console.error(error);
                    dispatch(
                        'alert/error',
                        {
                            group: 'general-error',
                            message: 'Impossible de récupérer les informations de contrat.',
                            show: true,
                            title: 'Erreur',
                            type: 'error'
                        },
                        {root: true}
                    );
                }
            )
            .then(opportunities => commit('getSalesforceOpportunitiesSuccess', opportunities))
            .catch(error => {
                console.error(error);
                dispatch(
                    'alert/error',
                    {
                        group: 'general-error',
                        message: 'Impossible de récupérer les informations de produit(s).',
                        show: true,
                        title: 'Erreur',
                        type: 'error'
                    },
                    {root: true}
                );
            });
    },
    async getSalesforceDocuments ({dispatch, commit}, {accountId}) {
        commit('getSalesforceDocumentsRequest');

        // Documents
        let documents = [];

        const attachments = await salesforceService.getAttachments(accountId).catch(
            error => {
                commit('getSalesforceDocumentsFailure');
                console.error(error);
                return dispatch(
                    'alert/error',
                    {
                        group: 'general-error',
                        message: 'Impossible de récupérer les fichiers.',
                        show: true,
                        title: 'Erreur',
                        type: 'error'
                    },
                    {root: true}
                );
            }
        );

        await attachments.filter(attachment => /^(joint|validé)e?$/i.test(attachment.Statut__c)).map(async attachment => {
            let items = await salesforceService.parseAttachment(attachment.Id, attachment.Type_de_piece__c, attachment.CreatedDate);
            if (items) {
                documents.push(items);
            }
        });

        const files = await salesforceService.parseFiles(JSON.parse(state.salesforce.account.List_ContentDocumentId__c)).catch(
            error => {
                commit('getSalesforceDocumentsFailure');
                console.error(error);
                return dispatch(
                    'alert/error',
                    {
                        group: 'general-error',
                        message: 'Impossible de récupérer les fichiers.',
                        show: true,
                        title: 'Erreur',
                        type: 'error'
                    },
                    {root: true}
                );
            }
        );

        files.forEach(file => {
            if (!documents.find(item => item.versionData === file.versionData)) {
                documents.push(file);
            }
        });

        commit('getSalesforceDocumentsSuccess', {documents});
    },
    getPartner({commit, state}, customerCode) {
        let partnerPromise;
        if (state.partner.isPartnerLoading) {
            partnerPromise = new Promise((resolve) => {
                let timeout = setInterval(() => {
                    if (!state.partner.loaded) {
                        return;
                    }
                    clearInterval(timeout);
                    resolve(state.partner.loaded);
                }, 50);
            });
        } else {
            partnerPromise = localfrApiService.getPartner(customerCode);
        }

        commit('getPartnerLoadingRequest');
        return partnerPromise.then(response => {
            commit('setPartnerLoaded', response);
            commit('getPartnerLoadingSuccess');
            return response;
        }, error => {
            commit('getPartnerLoadingFailure');
            return error;
        }).catch(error => {
            commit('getPartnerLoadingFailure');
            return error;
        });
    },
    getPaymentModes ({dispatch, commit}) {
        if (state.status.isPaymentModesLoading) {
            return
        }

        commit('getPaymentModesRequest');

        localfrApiService.getPaymentModes()
            .then(response => {
                let paymentModes = {};
                if (response['hydra:totalItems'] > 0) {
                    response['hydra:member'].forEach(paymentMode => {
                        if (undefined === paymentModes[paymentMode.name]) {
                            paymentModes[paymentMode.name] = paymentMode;
                        }
                    });
                }
                commit('setPaymentModes', paymentModes);
                commit('getPaymentModesSuccess');
            })
            .catch(error => {
                commit('getPaymentModesFailure');
                return dispatch(
                    'alert/error',
                    {
                        group: 'general-error',
                        message: 'Impossible de récupérer les moyens de paiement.',
                        show: true,
                        title: 'Erreur',
                        type: 'error'
                    },
                    {root: true}
                );
            });
    },
    getLanguages ({dispatch, commit}) {
        if (state.status.isLanguagesLoading) {
            return;
        }

        commit('getLanguagesRequest');

        localfrApiService.getLanguages()
            .then(response => {
                let languages = {};
                if (response['hydra:totalItems'] > 0) {
                    response['hydra:member'].forEach(language => {
                        if (language.language && undefined === languages[language.language.toLowerCase()]) {
                            languages[language.language.toLowerCase()] = language;
                        }
                    });
                }
                commit('setLanguages', languages);
                commit('getLanguagesSuccess');
            })
            .catch(error => {
                commit('getLanguagesFailure');
                return dispatch(
                    'alert/error',
                    {
                        group: 'general-error',
                        message: 'Impossible de récupérer les langues.',
                        show: true,
                        title: 'Erreur',
                        type: 'error'
                    },
                    {root: true}
                );
            });
    },
    getPortals ({dispatch, commit}) {
        if (state.status.isPortalsLoading) {
            return;
        }

        commit('getPortalsRequest');

        localfrApiService.getPortals()
            .then(response => {
                let portals = {};
                if (response['hydra:totalItems'] > 0) {
                    response['hydra:member'].forEach(portal => {
                        if (portal.name && undefined === portals[portal.name.toLowerCase()]) {
                            portals[portal.name.toLowerCase()] = portal;
                        }
                    });
                }
                commit('setPortals', portals);
                commit('getPortalsSuccess');
            })
            .catch(error => {
                commit('getPortalsFailure');
                return dispatch(
                    'alert/error',
                    {
                        group: 'general-error',
                        message: 'Impossible de récupérer les portails.',
                        show: true,
                        title: 'Erreur',
                        type: 'error'
                    },
                    {root: true}
                );
            });
    },
    async loadSalesforceData ({dispatch, commit}, {identity, currentPartner, loadDocuments}) {
        if (!currentPartner) {
            return;
        }

        commit('toggleIsPageLoading', true);

        // Reset Documents & Tickets states
        commit('getSalesforceDocumentsSuccess', {documents: []});
        commit('getSalesforceTicketsSuccess', {tickets: []});

        // Update identity in account store
        dispatch('account/setIdentity', {identity}, {root: true});
        // Update currentPartner in account store
        dispatch('account/setCurrentPartnerSnap', Object.assign({}, currentPartner), {root: true});
        dispatch('account/setCurrentPartner', {currentPartner}, {root: true});

        // Toggle webtool source
        commit('toggleIsWebtool', /^webtool$/i.test(currentPartner.source));

        // Get Salesforce account
        await dispatch('getSalesforceAccount', {accountId: currentPartner.company});

        if (!state.salesforce.account || !state.salesforce.account.Id) {
            commit('toggleIsPageLoading', false);
            return;
        }

        // Get Salesforce contact
        await dispatch('getSalesforceContact', {accountId: state.salesforce.account.Id});

        // Get Salesforce opportunity
        await dispatch('getSalesforceOpportunities', {accountId: state.salesforce.account.Id});

        // Get Salesforce task
        await dispatch('getSalesforceTask',  {accountId: currentPartner.company});

        // enable Website Info
        commit('toggleWebsiteInfoDisabled', false);

        for (const source of ['webtool', 'toolbox', 'ecommerce']) {
            let isSource = `is${source[0].toUpperCase() + source.substring(1)}`;
            let status = state.status[isSource];
            if (!status) {
                status = source === currentPartner.source.toLowerCase();
                state.status[isSource] = status;
            }
            if (status) {
                dispatch('setPartnerUrl', {
                    source,
                    url: await websiteService.getWebsiteAutologin(source),
                });
            }
        }

        if (!/^webtool$/i.test(currentPartner.source)) {
            commit('toggleUpdateWebsiteDisabled', false);
            if (state.salesforce.account.Date_Mise_en_ligne_Site__c) {
                commit('toggleIsWebsiteOnline', true);
            }
        } else {
            let domainName = state.salesforce.account.Site_Local_fr__c
                ? state.salesforce.account.Site_Local_fr__c
                : state.salesforce.account.Website;
            if (!domainName) {
                commit('toggleUpdateWebsiteDisabled', true);
                commit('toggleIsWebsiteOnline', false);
            } else {
                await webtoolService.isWebsiteOnline(domainName)
                    .then(isOnline => {
                        commit('toggleUpdateWebsiteDisabled', 0 === isOnline);
                        commit('toggleIsWebsiteOnline', 1 === isOnline);
                        return webtoolService.getWebsitePublicationDate(domainName)
                            .then(publicationDate => {
                                commit('setWebsitePublicationDate', publicationDate ? new Date(publicationDate) : null);
                                if (1 === isOnline) {
                                    commit('toggleUpdateWebsiteDisabled', !publicationDate || null === publicationDate.date);
                                }
                            })
                            .catch(error => {
                                commit('toggleUpdateWebsiteDisabled', true);
                                commit('setWebsitePublicationDate', null);
                            });
                    })
                    .catch(error => {
                        commit('toggleUpdateWebsiteDisabled', true);
                        commit('toggleIsWebsiteOnline', false);
                    });
            }
        }

        if (loadDocuments) {
            await dispatch('getSalesforceDocuments', {accountId: state.salesforce.account.Id});
            await dispatch('getRib', {accountId: state.salesforce.account.Id});
        }

        commit('toggleIsPageLoading', false);
    },
    async connectToAtInternet ({dispatch, commit}) {
        commit('connectToAtInternetRequest');

        return atInternetService.connect().then(
            response => {
                commit('connectToAtInternetSuccess', response);
                return response;
            }, error => {
                commit('connectToAtInternetFailure');
                dispatch(
                    'alert/error',
                    {
                        group: 'general-error',
                        message: 'Impossible d\'accéder à votre rapport d\'audience.',
                        show: true,
                        title: 'Service indisponible',
                        type: 'error'
                    },
                    {root: true}
                );
                return error;
            }
        );
    },
    async loadAtInternetData({dispatch}, {customerCode, dateRange}) {
        await dispatch('loadAtInternetVisitsData', {customerCode, dateRange});
        await dispatch('loadAtInternetSourceData', {customerCode, dateRange});
    },
    loadAtInternetVisitsData({dispatch, commit}, {customerCode, dateRange}) {
        commit('loadAtInternetVisitsDataRequest');
        const currentSite = state.websiteLink.replace('http://', '');
        if (state.atInternetInformation && !state.atInternetInformation[currentSite]) {
            commit('setAtInternetVisitsData', {});
            commit('loadAtInternetVisitsDataDone');
            return Promise.resolve();
        } else {
            const atInternet = state.atInternetInformation && state.atInternetInformation[currentSite];
            return atInternetService.getVisits((atInternet || {}).atinternet_id, customerCode, dateRange)
                .then(response => commit('setAtInternetVisitsData', response))
                .finally(() => commit('loadAtInternetVisitsDataDone'));
        }
    },
    loadAtInternetSourceData({dispatch, commit}, {customerCode, dateRange}) {
        commit('loadAtInternetSourcesDataRequest');
        const currentSite = state.websiteLink.replace('http://', '');
        if (state.atInternetInformation && !state.atInternetInformation[currentSite]) {
            commit('setAtInternetSourceData', {})
            commit('loadAtInternetSourcesDataDone')
            return Promise.resolve();
        } else {
            const atInternet = state.atInternetInformation && state.atInternetInformation[currentSite];
            return atInternetService.getSourceVisits((atInternet || {}).atinternet_id, customerCode, dateRange)
                .then(response => commit('setAtInternetSourceData', response))
                .finally(() => commit('loadAtInternetSourcesDataDone'));
        }
    },
    setHasSharedSpaceAccess({ commit }, value) {
        commit('setHasSharedSpaceAccess', value);
    },
    setSalesforceInformation({ commit }, value) {
        commit('setSalesforceInformation', value);
    },
    setAdplorerInformation({ commit }, value) {
        commit('setAdplorerInformation', value);
    },
    toggleIsLocalBoost ({commit}, value) {
        commit('toggleIsLocalBoost', value);
    },
    toggleIsLocalStart ({commit}, value) {
        commit('toggleIsLocalStart', value);
    },
    toggleIsLocalWeb ({commit}, value) {
        commit('toggleIsLocalWeb', value);
    },
    toggleIsLocalPresence ({commit}, value) {
        commit('toggleIsLocalPresence', value);
    },
    toggleIsWebtool ({commit}, value) {
        commit('toggleIsWebtool', value);
    },
    toggleIsToolbox ({commit}, value) {
        commit('toggleIsToolbox', value);
    },
    toggleIsEcommerce ({commit}, value) {
        commit('toggleIsEcommerce', value);
    },
    toggleIsLocalShop ({ dispatch, commit }, value) {
        commit('toggleIsLocalShop', value);
        if (true === value) {
            dispatch('account/initializePartnerShop', {}, {root: true});
        }
    },
    toggleIsLocalShopWithMigration ({ dispatch, commit }, value) {
        commit('toggleIsLocalShopWithMigration', value);
        if (true === value) {
            dispatch('account/initializePartnerShop', {}, {root: true});
        }
    },
    toggleIsUbiflow ({ commit }, value) {
        commit('toggleIsUbiflow', value);
    },
    toggleIsLocalAuto ({ dispatch, commit }, value) {
        commit('toggleIsLocalAuto', value);
        if (true === value) {
            dispatch('account/initializePartnerAutoImmo', {}, {root: true});
        }
    },
    toggleIsLocalAutoPlus ({ dispatch, commit }, value) {
        commit('toggleIsLocalAutoPlus', value);
        if (true === value) {
            dispatch('account/initializePartnerAutoImmo', {}, {root: true});
        }
    },
    toggleIsLocalImmo ({ dispatch, commit }, value) {
        commit('toggleIsLocalImmo', value);
        if (true === value) {
            dispatch('account/initializePartnerAutoImmo', {}, {root: true});
        }
    },
    toggleIsLocalImmoPlus ({ dispatch, commit }, value) {
        commit('toggleIsLocalImmoPlus', value);
        if (true === value) {
            dispatch('account/initializePartnerAutoImmo', {}, {root: true});
        }
    },
    toggleIsLocalHotel ({ dispatch, commit }, value) {
        commit('toggleIsLocalHotel', value);
        if (true === value) {
            dispatch('account/initializePartnerHotelResto', {}, {root: true});
        }
    },
    toggleIsLocalResto ({ dispatch, commit }, value) {
        commit('toggleIsLocalResto', value);
        if (true === value) {
            dispatch('account/initializePartnerHotelResto', {}, {root: true});
        }
    },
    toggleIsLocalRestoBoutique ({ dispatch, commit }, value) {
        commit('toggleIsLocalRestoBoutique', value);
        if (true === value) {
            dispatch('account/initializePartnerHotelResto', {}, {root: true});
            dispatch('account/initializePartnerBoutique', {}, {root: true});
        }
    },
    toggleIsLocalRestoWebtool({ commit }, value) {
        commit('toggleIsLocalRestoWebtool', value);
    },
    toggleHasVisibility ({commit}, value) {
        commit('toggleHasVisibility', value);
    },
    toggleIsLocalBoutique ({ dispatch, commit }, value) {
        commit('toggleIsLocalBoutique', value);
        if (true === value) {
            dispatch('account/initializePartnerBoutique', {}, {root: true});
        }
    },
    toggleIsNewLocalBoutique ({ dispatch, commit }, value) {
        commit('toggleIsNewLocalBoutique', value);
        if (true === value) {
            dispatch('account/initializePartnerBoutique', {}, {root: true});
        }
    },
    toggleIsOldLocalBoutique ({ dispatch, commit }, value) {
        commit('toggleIsOldLocalBoutique', value);
        if (true === value) {
            dispatch('account/initializePartnerBoutique', {}, {root: true});
        }
    },
    toggleIsLocalAgenda ({commit}, value) {
        commit('toggleIsLocalAgenda', value);
    },
    setUbiflowLink ({ commit }, value) {
        commit('setUbiflowUrl', value);
    },
    setOffers ({commit}, {offers}) {
        commit('setOffers', offers);
    },
    setSalesforceTask({commit}, {overrideTask}) {
        commit('setSalesforceTask', overrideTask);
    },
    setPartnerUrl({commit}, source, url) {
        commit('setPartnerUrl', source, url);
    },
    setPartnerBoutiqueUrl({commit}, boutiqueUrl) {
        commit('setPartnerBoutiqueUrl', boutiqueUrl);
    },
    setToolBoxPartnerUrl({commit}, toolBoxPartnerUrl) {
        commit('setToolBoxPartnerUrl', toolBoxPartnerUrl);
    },
    setDpValidated({commit}, dpValidated) {
        commit('setDpValidated', dpValidated);
    },
    setAgendaVisio({commit}, value) {
        commit('setAgendaVisio', value);
    },
    setAgendaCrm({commit}, value) {
        commit('setAgendaCrm', value);
    },
    setAgendaOnline({commit}, value) {
        commit('setAgendaOnline', value);
    },
    isProductionValidated({commit}, value) {
        commit('isProductionValidated', value);
    },
    isQrcodeEnabled({commit}, value) {
        commit('isQrcodeEnabled', value);
    },
    isCurrentMainUserOnPf({commit}, value) {
        commit('isCurrentMainUserOnPf', value);
    },
    setIsRetrievingUpdatedPf({ commit }, value) {
        commit('setIsRetrievingUpdatedPf', value);
    },
    setReport({commit}, value) {
        commit('setOpportunity', { opportunity: value });
    },
    setReportHasBeenSent({commit}, value) {
        commit('setReportHasBeenSent', value);
    },
    resetPartnerOffers ({commit}) {
        commit('resetPartnerOffers');
    },
    async getRib({dispatch, commit}, {accountId}) {
        commit('getRibRequest');

        return salesforceService.getRib(accountId).then(
            rib => {
                let hasRib = false;
                if (rib) {
                    hasRib = true;
                }
                commit('getRibSuccess', {hasRib});
                return rib;
            }, error => {
                commit('getRibFailure');
                console.error(error);
                dispatch(
                    'alert/error',
                    {
                        group: 'general-error',
                        message: 'Impossible de récupérer vos informations de paiement.',
                        show: true,
                        type: 'error',
                        title: 'Erreur'
                    },
                    {root: true}
                );
            }
        );
    },
    async getContactMessages ({dispatch, commit}) {
        commit('getContactMessagesRequest');

        return webtoolService.getContactMessages().then(
            response => {
                commit('getContactMessagesSuccess');
                return response;
            }, error => {
                commit('getContactMessagesFailure');
                dispatch(
                    'alert/error',
                    {
                        group: 'general-error',
                        message: 'Impossible de récupérer vos messages.',
                        show: true,
                        type: 'error',
                        title: 'Erreur'
                    },
                    {root: true}
                );
            }
        );
    },
    async getCountContactMessages ({dispatch, commit}) {
        commit('getCountContactMessagesRequest');

        return webtoolService.getCountContactMessages().then(
            response => {
                commit('getCountContactMessagesSuccess');
                return response;
            }, error => {
                commit('getCountContactMessagesFailure');
                dispatch(
                    'alert/error',
                    {
                        group: 'general-error',
                        message: 'Impossible de récupérer vos messages.',
                        show: true,
                        type: 'error',
                        title: 'Erreur'
                    },
                    {root: true}
                );
            }
        );
    },
    getFilterAudienceValue({commit, dispatch}, {customerCode, dateRange}) {
        commit('setFilterAudienceValue', dateRange);
        return dispatch('loadAtInternetData', {
            customerCode,
            dateRange: {
                startDate: moment(dateRange.startDate).format('YYYY-MM-DD'),
                endDate: moment(dateRange.endDate).format('YYYY-MM-DD')
            }
        });
    },
    setWebsiteLink ({commit}, value) {
        commit('setWebsiteLink', value);
    },
    resetState ({commit}) {
        commit('resetState');
    },
    setIsRequestForAccessIsActive({ commit }, value) {
        commit('setIsRequestForAccessIsActive', value);      
    },
    setIsStartTimerForWaiting({ commit }, value) {
        commit('setIsStartTimerForWaiting', value);
    },
    setStartTimer({ commit }, value) {
        commit('setStartTimer', value);      
    },
};

const mutations = {
    isCurrentMainUserOnPf(state, value) {
        state.status.isCurrentMainUserOnPf = value;
    },
    setIsRetrievingUpdatedPf(state, value) {
        state.status.isRetrievingUpdatedPf = value;
    },
    getNumberOfSubscriberRequest (state) {
        state.status.isNbrSubscriberLoading = true;
    },
    getNumberOfSubscriberSuccess (state) {
        state.status.isNbrSubscriberLoading = false;
    },
    getNumberOfSubscriberFailure (state) {
        state.status.isNbrSubscriberLoading = false;
    },
    getRetrieveListingsRequest (state) {
        state.status.isRetrieveListingsLoading = true;
    },
    getRetrieveListingsSuccess (state) {
        state.status.isRetrieveListingsLoading = false;
        state.status.isRetrieveListingsFailure = false;
    },
    getRetrieveListingsFailure (state) {
        state.status.isRetrieveListingsLoading = false;
        state.status.isRetrieveListingsFailure = true;
    },
    getUberallAutologinRequest (state) {
        state.status.isUberallAutologinLoading = true;
    },
    getUberallAutologinSuccess (state) {
        state.status.isUberallAutologinLoading = false;
        state.status.isUberallAutologinFailure = false;
    },
    getUberallAutologinFailure (state) {
        state.status.isUberallAutologinLoading = false;
        state.status.isUberallAutologinFailure = true;
    },
    setIsVisibilityOfferBeforeUberall (state, value) {
        state.status.isVisibilityOfferBeforeUberall = value;
    },
    // getSalesforceAccount
    getSalesforceAccountRequest (state) {
        state.status.isSalesforceAccountLoading = true;
    },
    getSalesforceAccountSuccess (state, {account}) {
        Object.keys(state.salesforce.account).forEach(key => {
            state.salesforce.account[key] = account[key];
        })

        let website = account.Site_Local_fr__c ? account.Site_Local_fr__c : account.Website;
        if (website) {
            website = website.replace('www.', '');
            if (!website.includes('http')) {
                website = 'http://' + website;
            }
        } else {
            website = null;
        }
        state.websiteLink = website;
        state.status.isSalesforceAccountLoading = false;
    },
    getSalesforceAccountFailure (state) {
        state.status.isSalesforceAccountLoading = false;
    },
    // getSalesforceTask
    getSalesforceTaskRequest(state) {
        state.status.isSalesforceTaskLoading = true;
    },
    getSalesforceTaskSuccess(state) {
        state.status.isSalesforceTaskLoading = false;
    },
    getSalesforceTaskFailure(state) {
        state.status.isSalesforceTaskLoading = false;
    },
    // getSalesforceContact
    getSalesforceContactRequest (state) {
        state.status.isSalesforceContactLoading = true;
    },
    getSalesforceContactSuccess (state, {contact}) {
        state.status.isSalesforceContactLoading = false;
        state.salesforce.contact = {
            Id: contact.Id,
            Birthdate: contact.Birthdate,
            Email: contact.Email,
            FirstName: contact.FirstName,
            LastName: contact.LastName,
            MobilePhone: contact.MobilePhone,
            Phone: contact.Phone,
        };
    },
    getSalesforceContactFailure (state) {
        state.status.isSalesforceContactLoading = false;
    },
    // getSalesforceOpportunities
    getSalesforceOpportunitiesRequest (state) {
        state.status.isSalesforceOpportunitiesLoading = true;
    },
    getSalesforceOpportunitiesSuccess (state, opportunities) {
        state.salesforce.opportunities = opportunities;
        state.status.isSalesforceOpportunitiesLoading = false;
    },
    getSalesforceOpportunitiesFailure (state) {
        state.status.isSalesforceOpportunitiesLoading = false;
    },
    // getSalesforceDocuments
    getSalesforceDocumentsRequest (state) {
        state.status.isSalesforceDocumentsLoading = true;
    },
    getSalesforceDocumentsSuccess (state, {documents}) {
        state.status.isSalesforceDocumentsLoading = false;
        state.documents = documents;
    },
    getSalesforceDocumentsFailure (state) {
        state.status.isSalesforceDocumentsLoading = false;
    },
    // getSalesforceTask
    getPartnerLoadingRequest(state) {
        state.partner.isPartnerLoading = true;
    },
    getPartnerLoadingSuccess(state) {
        state.partner.isPartnerLoading = false;
    },
    getPartnerLoadingFailure(state) {
        state.partner.isPartnerLoading = false;
    },
    setPartnerLoaded(state, partner) {
        state.partner.loaded = partner;
    },
    // uploadDropboxFile
    uploadDropboxFileRequest (state) {
        state.status.isUploadingDropboxFileSending = true;
    },
    uploadDropboxFileSuccess (state) {
        state.status.isUploadingDropboxFileSending = false;
    },
    uploadDropboxFileFailure (state) {
        state.status.isUploadingDropboxFileSending = false;
    },
    // getMostRecentFolder
    getMostRecentFolderPathRequest (state) {
        state.status.hasMostRecentFolder = true;
        state.status.isGetRecentFolderLoading = true;
    },
    getMostRecentFolderPathSuccess (state) {
        state.status.hasMostRecentFolder = false;
        state.status.isGetRecentFolderLoading = false;
    },
    getMostRecentFolderPathFailure (state) {
        state.status.hasMostRecentFolder = false;
        state.status.isGetRecentFolderLoading = false;
    },
    // downloadDropboxFile
    downloadDropboxFileRequest (state) {
        state.status.isDownloadingDropboxFileSending = true;
    },
    downloadDropboxFileSuccess (state) {
        state.status.isDownloadingDropboxFileSending = false;
    },
    downloadDropboxFileFailure (state) {
        state.status.isDownloadingDropboxFileSending = false;
    },
    // createSalesforceTicket
    createSalesforceTicketRequest (state) {
        state.status.isSalesforceTicketCreating = true;
    },
    createSalesforceTicketSuccess (state) {
        state.status.isSalesforceTicketCreating = false;
    },
    createSalesforceTicketFailure (state) {
        state.status.isSalesforceTicketCreating = false;
    },
    // updateSalesforceTicket
    updateSalesforceTicketRequest (state) {
        state.status.isSalesforceTicketUpdating = true;
    },
    updateSalesforceTicketSuccess (state) {
        state.status.isSalesforceTicketUpdating = false;
    },
    updateSalesforceTicketFailure (state) {
        state.status.isSalesforceTicketUpdating = false;
    },
    // sendSalesforceTicketAttachment
    sendSalesforceTicketAttachmentRequest (state) {
        state.status.isSalesforceTicketAttachmentSending = true;
    },
    sendSalesforceTicketAttachmentSuccess (state) {
        state.status.isSalesforceTicketAttachmentSending = false;
    },
    sendSalesforceTicketAttachmentFailure (state) {
        state.status.isSalesforceTicketAttachmentSending = false;
    },
    setSalesforceInformation(state, salesforce) {
        state.salesforce = salesforce;
    },
    setAdplorerInformation(state, adplorer) {
        state.adplorer = adplorer;
    },
    // s3Upload
    s3UploadRequest (state) {
        state.status.isS3Uploading = true;
    },
    s3UploadSuccess (state) {
        state.status.isS3Uploading = false;
    },
    s3UploadFailure (state) {
        state.status.isS3Uploading = false;
    },
    // getSalesforceTicket
    getSalesforceTicketRequest (state) {
        state.status.isSalesforceTicketLoading = true;
    },
    getSalesforceTicketSuccess (state) {
        state.status.isSalesforceTicketLoading = false;
    },
    getSalesforceTicketFailure (state) {
        state.status.isSalesforceTicketLoading = false;
    },
    // getSalesforceTickets
    getSalesforceTicketsRequest (state) {
        state.status.isSalesforceTicketsLoading = true;
    },
    getSalesforceTicketsSuccess(state, {tickets}) {
        state.status.isSalesforceTicketsLoading = false;
        state.salesforceTickets = tickets;
    },
    getSalesforceTicketsFailure (state) {
        state.status.isSalesforceTicketsLoading = false;
    },
    // loadSalesforceTicketThread
    loadSalesforceTicketThreadRequest (state) {
        state.status.isSalesforceTicketThreadLoading = true;
    },
    loadSalesforceTicketThreadSuccess(state, {thread}) {
        state.status.isSalesforceTicketThreadLoading = false;
        state.salesforceTicketThread = thread;
    },
    loadSalesforceTicketThreadFailure (state) {
        state.status.isSalesforceTicketThreadLoading = false;
    },
    // sendNewBillingInfoMail
    sendNewBillingInfoMailRequest (state) {
        state.status.isNewBillingInfoSending = true;
    },
    sendNewBillingInfoMailSuccess (state) {
        state.status.isNewBillingInfoSending = false;
    },
    sendNewBillingInfoMailFailure (state) {
        state.status.isNewBillingInfoSending = false;
    },
    // sendDropboxNotification
    sendDropboxNotificationRequest (state) {
        state.status.isNewDropobNotification = true;
    },
    sendDropboxNotificationSuccess (state) {
        state.status.isNewDropobNotification = false;
    },
    sendDropboxNotificationFailure (state) {
        state.status.isNewDropobNotification = false;
    },
    // notifyUploadedFiles
    notifyUploadedFilesRequest (state) {
        state.status.isNotifyingUploadedFiles = true;
    },
    notifyUploadedFilesSuccess (state) {
        state.status.isNotifyingUploadedFiles = false;
    },
    notifyUploadedFilesFailure (state) {
        state.status.isNotifyingUploadedFiles = false;
    },
    // contactMessages
    getContactMessagesRequest (state) {
        state.status.isContactMessagesLoading = true;
    },
    getContactMessagesSuccess (state) {
        state.status.isContactMessagesLoading = false;
    },
    getContactMessagesFailure (state) {
        state.status.isContactMessagesLoading = false;
    },
    // countContactMessages
    getCountContactMessagesRequest (state) {
        state.status.isCountContactMessagesLoading = true;
    },
    getCountContactMessagesSuccess (state) {
        state.status.isCountContactMessagesLoading = false;
    },
    getCountContactMessagesFailure (state) {
        state.status.isCountContactMessagesLoading = false;
    },
    // sendResetPasswordMail
    sendResetPasswordMailRequest (state) {
        state.status.isPasswordResetting = true;
    },
    sendResetPasswordMailSuccess (state) {
        state.status.isPasswordResetting = false;
    },
    sendResetPasswordMailFailure (state) {
        state.status.isPasswordResetting = false;
    },
    // PaymentModes
    getPaymentModesRequest (state) {
        state.status.isPaymentModesLoading = true;
    },
    getPaymentModesSuccess (state) {
        state.status.isPaymentModesLoading = false;
    },
    getPaymentModesFailure (state) {
        state.status.isPaymentModesLoading = false;
    },
    // Languages
    getLanguagesRequest (state) {
        state.status.isLanguagesLoading = true;
    },
    getLanguagesSuccess (state) {
        state.status.isLanguagesLoading = false;
    },
    getLanguagesFailure (state) {
        state.status.isLanguagesLoading = false;
    },
    // Portals
    getPortalsRequest (state) {
        state.status.isPortalsLoading = true;
    },
    getPortalsSuccess (state) {
        state.status.isPortalsLoading = false;
    },
    getPortalsFailure (state) {
        state.status.isPortalsLoading = false;
    },
    togglePasswordResetForm (state, value) {
        state.status.passwordResetForm = value;
    },
    toggleIsPageLoading (state, value) {
        state.status.isPageLoading = value;
    },
    isFilesSubmitting(state, value) {
        state.status.isFilesSubmitting = value;
    },
    toggleIsLocalBoost (state, value) {
        state.status.isLocalBoost = value;
    },
    toggleIsLocalStart (state, value) {
        state.status.isLocalStart = value;
    },
    toggleIsLocalWeb (state, value) {
        state.status.isLocalWeb = value;
    },
    toggleIsLocalPresence (state, value) {
        state.status.isLocalPresence = value;
    },
    toggleIsWebtool (state, value) {
        state.status.isWebtool = value;
    },
    toggleIsToolbox (state, value) {
        state.status.isToolbox = value;
    },
    toggleIsEcommerce (state, value) {
        state.status.isEcommerce = value;
    },
    toggleIsLocalShop (state, value) {
        state.status.isLocalShop = value;
    },
    toggleIsLocalShopWithMigration (state, value) {
        state.status.isLocalShopWithMigration = value;
    },
    toggleIsUbiflow (state, value) {
        state.status.isUbiflow = value;
    },
    toggleIsLocalAuto (state, value) {
        state.status.isLocalAuto = value;
    },
    toggleIsLocalAutoPlus (state, value) {
        state.status.isLocalAutoPlus = value;
    },
    toggleIsLocalImmo (state, value) {
        state.status.isLocalImmo = value;
    },
    toggleIsLocalImmoPlus (state, value) {
        state.status.isLocalImmoPlus = value;
    },
    toggleIsLocalHotel (state, value) {
        state.status.isLocalHotel = value;
    },
    toggleIsLocalResto (state, value) {
        state.status.isLocalResto = value;
    },
    toggleIsLocalRestoBoutique(state, value) {
        state.status.isLocalRestoBoutique = value;
    },
    toggleIsLocalRestoWebtool(state, value) {
        state.status.isLocalRestoWebtool = value;
    },
    toggleIsLocalBoutique (state, value) {
        state.status.isLocalBoutique = value;
    },
    toggleIsNewLocalBoutique (state, value) {
        state.status.isNewLocalBoutique = value;
    },
    toggleIsOldLocalBoutique (state, value) {
        state.status.isOldLocalBoutique = value;
    },
    toggleIsLocalAgenda (state, value) {
        state.status.isLocalAgenda = value;
    },
    toggleWebsiteInfoDisabled (state, value) {
        state.status.websiteInfoDisabled = value;
    },
    toggleUpdateWebsiteDisabled (state, value) {
        state.status.updateWebsiteDisabled = value;
    },
    toggleIsWebsiteOnline(state, value) {
        state.status.isWebsiteOnline = value;
    },
    setWebsitePublicationDate(state, value) {
        state.websitePublicationDate = value;
    },
    setLatestAppointmentBriefInfo(state, briefInfo) {
        if (!briefInfo) {
            return;
        }
        state.salesforce.brief.date = briefInfo.ActivityDateTime;
        state.salesforce.brief.callResult = briefInfo.R_sultat_d_appel__c;
        state.salesforce.brief.ownerName = briefInfo.Owner.Name;
    },
    setSalesforceBriefAppointmentInfoLoadingRequest(state) {
        state.status.isSalesforceBriefAppointmentInfoLoading = true;
    },
    setSalesforceBriefAppointmentInfoLoadingSuccess(state) {
        state.status.isSalesforceBriefAppointmentInfoLoading = false;
    },
    setSalesforceBriefAppointmentInfoLoadingFailure(state) {
        state.status.isSalesforceBriefAppointmentInfoLoading = false;
    },
    setDocuments (state, documents) {
        state.documents = documents;
    },
    setWebsiteLink (state, websiteLink) {
        state.websiteLink = websiteLink;
    },
    setIsRequestForAccessIsActive(state, value) {
        state.status.isRequestForAccessIsActive = value;
    },
    setIsStartTimerForWaiting(state, value) {
        state.status.isStartTimerForWaiting = value;
    },
    setStartTimer(state, value) {
        state.status.isStartTimer = value;
    },
    setFilterAudienceValue(state, value) {
        state.filterAudienceRange = value;
    },
    setPartnerUrl(state, {source, url}) {
        if (null === state.partner.url) {
            state.partner.url = {};
        }
        state.partner.url[source] = url;
    },
    setToolBoxPartnerUrl(state, toolBoxUrl) {
        state.partner.toolBoxUrl = toolBoxUrl;
    },
    setPartnerBoutiqueUrl(state, boutiqueUrl) {
        state.partner.boutiqueUrl = boutiqueUrl;
    },
    setUbiflowUrl (state, ubiflowUrl) {
        state.ubiflowLink = ubiflowUrl;
    },
    setHasSharedSpaceAccess(state, hasSharedSpaceAccess) {
        state.status.hasSharedSpaceAccess = hasSharedSpaceAccess;
    },
    setHasPartnerFolderAccess(state, hasPartnerFolderAccess) {
        state.status.hasPartnerFolderAccess = hasPartnerFolderAccess;
    },
    setAtInternetVisitsData(state, data) {
        state.atInternetVisitsData = Object.assign({}, data);
        state.status.isLoadingVisits = false;
    },
    loadAtInternetVisitsDataRequest(state) {
        state.status.isLoadingVisits = true;
    },
    loadAtInternetSourcesDataDone(state) {
        state.status.isLoadingSources = false;
    },
    loadAtInternetVisitsDataDone(state) {
        state.status.isLoadingVisits = false;
    },
    loadAtInternetSourcesDataRequest(state) {
        state.status.isLoadingSources = true;
    },
    setAtInternetSourceData(state, data) {
        state.status.isLoadingSources = false;
        state.atInternetSourceData = data;
    },
    resetPartnerOffers (state) {
        state.offers = [];
    },
    toggleHasVisibility (state, value) {
        state.partner.hasVisibility = value;
    },
    setOffers (state, offers) {
        state.offers = offers;
    },
    addOffer(state, offer) {
        state.offers.push(offer);
    },
    setPaymentModes (state, paymentModes) {
        state.paymentModes = paymentModes;
    },
    setLanguages (state, languages) {
        state.languages = languages;
    },
    setPortals (state, portals) {
        state.portals = portals;
    },
    setUberallListing (state, listings) {
        state.uberall.listingsLength = listings.length;
        state.uberall.listingsTab = listings;
    },
    setNumberOfSubscribers (state, count) {
        state.webtool.newsletter.nbrUser = count;
    },
    setSubscribers (state, list) {
        state.webtool.newsletter.userList = list;
    },
    setSalesforceTask(state, task) {
      state.salesforce.task = task;
    },
    setDpValidated(state, dpValidated) {
      state.salesforce.dpValidated.canEdit = dpValidated.canEdit;
      state.salesforce.dpValidated.validatedDpDate = dpValidated.validatedDpDate;
    },
    setAgendaVisio(state, value) {
      state.salesforce.agenda.visio = value;
    },
    setAgendaCrm(state, value) {
      state.salesforce.agenda.crm = value;
    },
    setAgendaOnline(state, value) {
      state.salesforce.agenda.online = value;
    },
    setOpportunity(state, { opportunity }) {
        if (!opportunity) {
            opportunity = getInitialState().salesforce.opportunity;
        }
        if (!state.salesforce.opportunity) {
            state.salesforce.opportunity = {};
        }
        Object.assignRecursive(state.salesforce.opportunity, opportunity);
    },
    setTaskTracking(state, { taskTracking }) {
        if (!taskTracking) {
            taskTracking = getInitialState().salesforce.taskTracking;
        }
        if (!state.salesforce.taskTracking) {
            state.salesforce.taskTracking = {};
        }
        Object.assignRecursive(state.salesforce.taskTracking, taskTracking);
    },
    isProductionValidated(state, value) {
        state.status.isSalesforceProductionValidated = value;
    },
    isQrcodeEnabled(state, value) {
        state.status.isQrcodeEnabled = value;
    },
    setReportHasBeenSent(state, value) {
        state.status.reportHasBeenSent = value;
    },
    // getRib
    getRibRequest (state) {
        state.status.isRibLoading = true;
    },
    getRibSuccess (state, {hasRib}) {
        state.status.isRibLoading = false;
        state.partner.hasRib = hasRib;
    },
    getRibFailure (state) {
        state.status.isRibLoading = false;
    },
    connectToAtInternetRequest (state) {
        state.status.isConnectingToAtInternet = true;
    },
    connectToAtInternetSuccess (state, data) {
        state.atInternetInformation = data;
        state.status.isConnectingToAtInternet = false;
    },
    connectToAtInternetFailure (state) {
        state.status.isConnectingToAtInternet = false;
    },
    // options
    toggleHasLogoCreation (state, value) {
        state.status.hasLogoCreation = value;
    },
    toggleHasPhotosReport10 (state, value) {
        state.status.hasPhotosReport10 = value;
    },
    toggleHasPhotosReport20 (state, value) {
        state.status.hasPhotosReport20 = value;
    },
    toggleHasVirtualVisit (state, value) {
        state.status.hasVirtualVisit = value;
    },
    toggleHasPhotosVideoReport10 (state, value) {
        state.status.hasPhotosVideoReport10 = value;
    },
    toggleHasAdwordsCampaign (state, value) {
        state.status.hasAdwordsCampaign = value;
    },
    isDropboxEmailSent (state, value) {
        state.status.isDropboxEmailSent = value;
    },
    mostRecentFolderPath (state, value) {
        state.status.mostRecentFolder = {
            path: value.path,
            multipleFolders: value.multipleFolders,
            message: value.message
        }
        state.status.hasMostRecentFolder = value.hasMostRecentFolder;
    },
    resetState (state) {
        Object.assignRecursive(state, getInitialState());
    }
};

export const globalStore = {
    namespaced: true,
    state,
    actions,
    mutations
};
