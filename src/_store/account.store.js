import router from '@/router';
import { userService, localfrApiService, salesforceService } from '@/_services';
import { normalizer, authDpHelper } from "@/_helpers";
import { partnerRelations, siteRelations } from "../Interface/partnershipFolderDatas";

const user = JSON.parse(localStorage.getItem('user'));
const identity = JSON.parse(localStorage.getItem('identity'));
const salesforceUser = JSON.parse(localStorage.getItem('salesforceUser'));
const currentPartner = identity && identity.partners ? identity.partners[0] : null;
const partnerHistoryContext = JSON.parse(localStorage.getItem('partnerHistoryContext')) || {};
const impersonatedUser = JSON.parse(localStorage.getItem('impersonatedUser'));
const initialLogoutModal = {
    refreshTokenExpiresAt: null,
    refreshTokenTtlState: null,
    isShowLogoutModal: false
};

const initialAccessPfModal = {
    isShowAccessPfModal: false,
    userName: null,
    socket: null,
    id: null
};

const state = user
    ? {
        status: {
            loggedIn: true,
            isStopEditing: false,
            impersonated: impersonatedUser !== null,
            performanceCookie: null,
            targetingCookie: null,
            isPartnerHistoryLoading: false,
            isSalesforceUsersLoading: {}
        },
        timelineSteps: [],
        user,
        salesforceUser,
        salesforceUsers: [],
        identity,
        impersonatedUser,
        currentPartner,
        partnerHistoryContext,
        currentPartnerSnap: null,
        isCurrentMainUserOnPf: false,
        accessPfModalInformation: null,
        accessPfModal: initialAccessPfModal
    }
    : {
        status: {
            isStopEditing: false,
            impersonated: impersonatedUser !== null,
            performanceCookie: null,
            targetingCookie: null,
            isPartnerHistoriesLoading: false,
            isSalesforceUsersLoading: {}
        },
        user: null,
        salesforceUser: null,
        salesforceUsers: [],
        timelineSteps: [],
        identity,
        impersonatedUser,
        currentPartner,
        partnerHistoryContext,
        currentPartnerSnap: null,
        isCurrentMainUserOnPf: false,
        accessPfModalInformation: null,
        accessPfModal: initialAccessPfModal
    };
state.status.logoutModal = initialLogoutModal;

let initializeEntityRelations = function(entity, relations) {
    relations.forEach(key => {
        if (!entity[key] || !entity[key].length) {
            entity[key] = [ {} ];
        }
    });
};

let getOpeningRanges = function(parentEntityName, openingRange) {
    switch (true) {
        case 'partner' === parentEntityName:
            return state.currentPartner.openingRanges;
        case 'agenda' === parentEntityName:
            return state.currentPartner.agenda.appointmentTimeRanges;
        case 'agendaMember' === parentEntityName:
            return state.currentPartner.agenda.agendaMembers
                .find(item => item['@id'] === openingRange.agendaMember
                    || item['@id'] === openingRange.agendaMember['@id'])
                .appointmentTimeRanges;
        case 'partnerHotelResto' === parentEntityName:
            return state.currentPartner.partnerHotelResto.openingRanges;
        default:
            return [];
    }
}

let getDeliveryModes = function(parentEntityName) {
    switch (true) {
        case 'partner' === parentEntityName:
            return state.currentPartner.deliveryModes;
        case 'partnerHotelResto' === parentEntityName:
            return state.currentPartner.partnerHotelResto.deliveryModes;
        default:
            return [];
    }
}

function fillEntity(stateEntity, entityValue) {
    Object.keys(entityValue).forEach(offset => {
        stateEntity[offset] = entityValue[offset];
    });
}

const actions = {
    setIsStopEditing({ commit }, value) {
        commit('setIsStopEditing', value);
    },
    changePassword({dispatch}, {userId, data, token}) {
        userService.changePassword(userId, data, token).then(
            () => {
                dispatch(
                    'alert/success',
                    {
                        group: 'mail-sent',
                        message: 'Votre mot de passe a été créé avec succès.',
                        show: true,
                        title: 'Mot de passe défini',
                        type: 'success'
                    },
                    {root: true}
                );
                setTimeout(() => {
                    router.push('/authentification');
                }, 4000);
            }, error => {
                console.log(error);
                dispatch(
                    'alert/error',
                    {
                        group: 'auth-error',
                        message: 'La création du mot de passe a échoué.',
                        show: true,
                        title: 'Impossible de créer le mot de passe',
                        type: 'error'
                    },
                    {root: true}
                );
            }
        );
    },
    impersonateLogin({dispatch, commit}, {userId, username}) {
        commit('impersonateLoginRequest', {username});

        // Clear current impersoanting information
        userService.impersonateLogout();
        commit('impersonateLogout');
        dispatch('globalStore/resetState', {}, {root: true});

        userService.impersonateLogin(userId, username).then(
            accessToken => {
                userService.me().then(
                    me => {
                        commit('impersonateLoginSuccess', {impersonatedUser: me, accessToken: accessToken});
                        return dispatch('globalStore/loadSalesforceData', {
                            identity: me,
                            currentPartner: me.partners ? me.partners[0] : null
                        }, {root: true});
                    },
                    error => {
                        console.error(error);
                    }
                );
            },
            error => {
                console.error('Impersonation error');
                console.error(error);
                if (state.identity &&
                    state.identity.roles &&
                    state.identity.roles.includes('ROLE_CLIENT')) {
                    dispatch(
                        'alert/warn',
                        {
                            group: 'auth-error',
                            message: `Vous êtes actuellement connecté avec le compte d'un partenaire (<strong>${state.identity.name} / ${state.identity.email}</strong>).
<br>Veuillez vous reconnecter avec vos identifiants <strong>LOCAL.FR</strong>.`,
                            show: true,
                            title: 'Erreur d\'impersonnalisation',
                            type: 'error',
                            duration: 30000
                        },
                        {root: true}
                    );
                }
            }
        );
    },
    impersonateLogout({dispatch, commit}) {
        userService.impersonateLogout();
        return userService.me().then(
            me => {
                commit('impersonateLogout');
                dispatch('globalStore/resetState', {}, {root: true});
                dispatch('setIdentity', {identity: me});
                dispatch('globalStore/loadSalesforceData', {identity: me}, {root: true});
            },
            error => {
                console.error(error);
            }
        );
    },
    login({dispatch, commit}, {username, password, next = null}) {
        commit('loginRequest', {username});

        userService.login(username, password).then(
            user => {
                userService.me().then(
                    me => {
                        if (me.resetPassword) {
                            let errorOptions = {
                                group: 'auth-error',
                                message: 'Votre mot de passe a expiré. Pour des raisons de sécurité, nous vous demandons de le modifier. Pour cela, allez sur "Mot de passe oublié ?" et laissez-vous guider.',
                                show: true,
                                title: 'Erreur de connexion',
                                type: 'error',
                                duration: 30000
                            };

                            commit('loginFailure', null);
                            dispatch(
                                'alert/error',
                                errorOptions,
                                {root: true}
                            );
                            commit('logout', null);
                            localStorage.clear();
                        } else {
                            commit('loginSuccess', {user, me});
                            dispatch('setIdentity', {identity: me});
                            if (me.partners.length) {
                                dispatch('setCurrentPartner', {currentPartner: me.partners[0]});
                            }

                            if (state.identity && (
                                state.identity.allowedToEdit
                                || authDpHelper.isProvider(state.identity)
                                || authDpHelper.isSalesman(state.identity)
                                || authDpHelper.isSuperAdmin(state.identity)
                            )) {
                                if (!next || '/' === next || '/?' === next) {
                                    next = '/backoffice';
                                }
                            } else {
                                if (!next) {
                                    next = '/accueil';
                                }
                            }

                            router.push(next);
                        }
                    },
                    error => {
                        let errorOptions = {
                            group: 'auth-error',
                            message: 'Impossible de récupérer les informations utilisateur.',
                            show: true,
                            title: 'Erreur de connexion',
                            type: 'error'
                        };

                        commit('loginFailure', error);
                        dispatch(
                            'alert/error',
                            errorOptions,
                            {root: true}
                        );
                    }
                );
            },
            error => {
                commit('loginFailure', error);
                dispatch(
                    'alert/error',
                    {
                        group: 'auth-error',
                        message: 'Votre identifiant ou votre mot de passe est erroné.',
                        show: true,
                        title: 'Erreur de connexion',
                        type: 'error'
                    },
                    {root: true}
                );
            }
        );
    },
    logout({dispatch, commit}, {customerCode, identity}) {
        if (customerCode && identity) {
            userService.disconnectUserFromSocket(customerCode, identity.id);
        }
        dispatch('globalStore/resetState', {}, {root: true});
        userService.logout();
        commit('logout');
    },
    disconnectUserFromSocket({dispatch, commit}, {customerCode, identity}) {
        if (customerCode && identity) {
            userService.disconnectUserFromSocket(customerCode, identity.id);
        }
    },

    setRefreshTokenTtl({commit}, value) {
        let expiresAt = new Date();
        expiresAt.setSeconds(expiresAt.getSeconds() + value);
        commit('setRefreshTokenExpiresAt', expiresAt);
        commit('updateRefreshTokenState', true);
        commit('isShowLogoutModal', false);
    },
    refreshTokenUpdated({commit}, value){
        commit('updateRefreshTokenState', value)
    },
    setIsShowLogoutModal({commit}, value) {
        commit('isShowLogoutModal', value);
    },
    setIsShowAccessPfModal({commit}, value) {
        commit('setIsShowAccessPfModal', value);
    },
    setAccessPfModalInformation({commit}, value) {
        commit('setAccessPfModalInformation', value);
    },
    setAccessPfModalData({commit}, show , message) {
        commit('setAccessPfModalData', show , message);
    },
    setPerformanceCookie({ commit }, value) {
        commit('setPerformanceCookie', value);
    },
    setTargetingCookie({ commit }, value) {
        commit('setTargetingCookie', value);
    },
    setIdentity({commit}, {identity}) {
        commit('setIdentity', {identity});
    },
    isCurrentMainUserOnPf({commit}, value) {
        commit('isCurrentMainUserOnPf', value);
    },
    setCurrentPartnerSnap({ commit}, snapshot) {
        commit('setCurrentPartnerSnap', snapshot);
    },
    setCurrentPartner({dispatch, commit}, {currentPartner}) {
        commit('resetPartnerHistoryContext');
        if (currentPartner) {
            initializeEntityRelations(currentPartner, partnerRelations);
            if (currentPartner.sites && currentPartner.sites.length) {
                initializeEntityRelations(currentPartner.sites[0], siteRelations);
            }

            commit('setCurrentPartner', { currentPartner });

            return dispatch('setPartnerHistorySteps');
        }

        return Promise.resolve(currentPartner);
    },
    setPartnerHistorySteps({ commit, state }, currentPartner = null) {
        currentPartner = currentPartner || state.currentPartner;
        if (state.status.isPartnerHistoriesLoading) {
            return Promise.resolve((currentPartner || {}).partnerHistories || []);
        }

        state.status.isPartnerHistoriesLoading = true;
        const currentUserStep = authDpHelper.getCurrentUserStep();
        if (!state.status.isSalesforceUsersLoading) {
            state.status.isSalesforceUsersLoading = {};
        }
        if (!state.salesforceUsers) {
            state.salesforceUsers = {};
        }

        if (!currentPartner.partnerHistories || !currentPartner.partnerHistories.length) {
            return Promise.resolve();
        }

        return Promise.all(currentPartner.partnerHistories.map((partnerHistory, key) => {
            let userPromise;

            if (undefined !== state.salesforceUsers[partnerHistory.userId]) {
                userPromise = Promise.resolve(state.salesforceUsers[partnerHistory.userId]);
            } else if (undefined !== state.status.isSalesforceUsersLoading[partnerHistory.userId]) {
                userPromise = new Promise((resolve, reject) => {
                    let timeout = setInterval(() => {
                        if (state.status.isSalesforceUsersLoading[partnerHistory.userId]) {
                            return;
                        }
                        clearInterval(timeout);
                        if (state.salesforceUsers[partnerHistory.userId]) {
                            resolve(state.salesforceUsers[partnerHistory.userId]);
                        } else {
                            reject();
                        }
                    }, 50);
                });
            } else {
                userPromise = salesforceService.getUser(partnerHistory.userId);
            }
            commit('salesforceUsersLoadingRequest', partnerHistory.userId)

            return userPromise.then(user => {
                partnerHistory.salesforceUser = user;
                currentPartner.partnerHistories[key] = partnerHistory;
                return user;
            }, () => commit('salesforceUsersLoadingFailure', partnerHistory.userId))
                .catch(() => commit('salesforceUsersLoadingFailure', partnerHistory.userId))
                .then(user => commit('salesforceUsersLoadingSuccess', user));
        })).then(() => {
            currentPartner.partnerHistories.sort(
                (a, b) => authDpHelper.getUserStep(a.salesforceUser) - authDpHelper.getUserStep(b.salesforceUser)
            ).forEach(partnerHistory => {
                const user = partnerHistory.salesforceUser;
                const userStep = user && authDpHelper.getUserStatus(user) ? authDpHelper.getUserStatus(user).step : null;

                if (userStep === currentUserStep) {
                    commit('setPartnerHistoryContext', {
                        current: normalizer.normalizePartnerHistory(partnerHistory),
                        currentStep: userStep || null
                    });
                } else if (userStep < currentUserStep) {
                    commit('setPartnerHistoryContext', {
                        previous: normalizer.normalizePartnerHistory(partnerHistory),
                        previousStep: userStep || null
                    });
                } else if (userStep > currentUserStep) {
                    commit('setPartnerHistoryContext', {
                        next: normalizer.normalizePartnerHistory(partnerHistory),
                        nextStep: userStep || null
                    });
                }
            });
        }).then(() => {
            commit('setTimelineSteps', state.currentPartner);
            if (state.identity.allowedToEdit) {
                state.identity.allowedToEdit = !!authDpHelper.canTransmitPf() || authDpHelper.canByPassRolesToUpdatePf();
            }
            state.status.isPartnerHistoriesLoading = false;

            return currentPartner;
        });
    },
    initializePartnerAutoImmo({commit}) {
        if (undefined === state.currentPartner.partnerAutoImmo) {
            commit('setPartnerAutoImmo', { entityValue: {} });
        }
    },
    initializePartnerHotelResto({commit}) {
        if (undefined === state.currentPartner.partnerHotelResto) {
            commit('setPartnerHotelResto', { entityValue: {} });
        }
    },
    initializePartnerBoutique({commit}) {
        if (undefined === state.currentPartner.partnerBoutique) {
            commit('setPartnerBoutique', { entityValue: {} });
        }
    },
    initializePartnerShop({commit}) {
        if (undefined === state.currentPartner.partnerShop) {
            commit('setPartnerShop', { entityValue: {} });
        }
    },
    updateIdentity({dispatch}) {
        return userService.me().then(
            me => {
                dispatch('setIdentity', {identity: me});
                if (me.partners.length) {
                    return dispatch('setCurrentPartner', {currentPartner: me.partners[0]});
                }

                return me;
            },
            () => {
                dispatch(
                    'alert/error',
                    {
                        group: 'general-error',
                        message: 'Impossible de récupérer les informations utilisateur.',
                        show: true,
                        title: 'Erreur',
                        type: 'error'
                    },
                    {root: true}
                );
            }
        )
    },
    async updatePartnerPropertyFromForm({dispatch, commit, state, rootState}, {event, provider, data, showNotification, skipPartnerHistory}) {
        if (provider) {
            const validation = await provider.validate(event);
            if (validation && !validation.valid) {
                return Promise.resolve();
            }
        }

        if (!data) {
            return Promise.resolve();
        }

        let value, offset, payload = {};

        if (event) {
            value = event.target.value;
            if (data.previousEditedValue === value) {
                return Promise.resolve();
            }

            let index = event.target.name.split('.');

            switch (event.target.type) {
                case 'number':
                    value = event.target.valueAsNumber;
                    break;
            }

            if ('float' === data.type) {
                value = normalizer.floatNormalizer(event.target.value);
            }

            if ('bool' === data.type) {
                if ('checkbox' === event.target.type) {
                    value = event.target.checked;
                }
                value = normalizer.booleanNormalizer(value);
            }

            offset = index.slice(-1)[0];
        } else {
            if (data.offset) {
                offset = data.offset;
                value = data.value;
            }
        }

        if (data.payload) {
            payload = data.payload;
        } else {
            switch (data.type) {
                case 'int':
                    value = parseInt(value);
                    break;
                case 'bool':
                    value = normalizer.booleanNormalizer(value);
                    break;
                case 'float':
                    value = normalizer.floatNormalizer(event.target.value);
                    break;
            }

            if ('time2sec' === data.format) {
                value = normalizer.strTimeToSeconds(value);
            }

            payload[offset] = value;
        }

        let dispatchEntity = function (entityTarget, entityName) {
            let index = entityName.charAt(0).toLowerCase() + entityName.slice(1)
            if (undefined !== data[index]) {
                return dispatch(`update${entityTarget}`, {
                    entityName: entityName,
                    id: data[index].id || data[index].Id,
                    data: payload,
                    showNotification: showNotification,
                    context: data,
                });
            }

            return Promise.resolve();
        };

        if (data.site && !data.site.id) {
            data.site.partner = state.currentPartner['@id'];
        }

        return Promise.all([
            // Manage entities updates
            ...[
                'Partner',
                'BookEngine',
                'Agenda',
            ].map(entityName => dispatchEntity('PartnerEntity', entityName)),

            // Manage entities updates/creation
            ...[
                'PartnerBoutique',
                'PartnerHotelResto',
                'PartnerAutoImmo',
                'PartnerShop',
                'Site',
                'CampaignOption',
                'SiteTree',
                'Footage',
                'Banner',
                'OpeningRange',
                'SocialNetwork',
                'AgendaService',
                'AgendaResource',
                'AgendaMember',
                'AgendaVisio',
                'DeliveryMode',
                'FeeDetail',
                'PartnerHistory',
                'Note',
                'BookingService',
                'BookingTimeRange',
            ].map(entityName => {
                let offset = entityName.charAt(0).toLowerCase() + entityName.slice(1);
                if (undefined === data[offset]) {
                    return;
                }
                if (data[offset].id) {
                    return dispatchEntity('PartnerEntity', entityName);
                } else {
                    return dispatch('createEntity', {
                        entityName: entityName,
                        data: data[offset],
                        showNotification: showNotification,
                        context: data,
                    });
                }
            }),

            // Manage Salesforce data updates
            ...[
                'Account',
                'Contact',
                'Opportunity',
                'TaskTracking'
            ].map(entityName => dispatchEntity('SalesforceAccount', entityName))
        ])
            .then(response => response.filter(item => item))
            .finally(() => {
                if (skipPartnerHistory) {
                    return;
                }
                const currentPartner = state.currentPartner;
                const currentSFUser = state.salesforceUser;
                const partnerHistoryContext = state.partnerHistoryContext;
                const currentUserContext = authDpHelper.getUserStatus(state.salesforceUser);
                const partnerHistories = currentPartner.partnerHistories;
                const isAllowedToByPassRolesToUpdateDP = authDpHelper.canByPassRolesToUpdatePf();
                let updatePartnerPromise;

                // case there's no partner histories (first time)
                if ((!partnerHistories || !partnerHistories.length) && !isAllowedToByPassRolesToUpdateDP) {
                    updatePartnerPromise = dispatch('registerPartnerHistory', normalizer.normalizePartnerHistory({
                        partner: currentPartner,
                        userId: currentSFUser.Id,
                        creationDate: new Date(),
                        snapshot: {
                            currentPartner,
                            salesforce: {
                                ...rootState.globalStore.salesforce
                            }
                        },
                        isValidated: false
                    }));
                } else {
                    const currentUserStep = authDpHelper.getCurrentUserStep();
                    let previousPartnerHistory =
                        partnerHistoryContext.previous ||
                        partnerHistoryContext.current ||
                        partnerHistoryContext.next ||
                        null;

                    const previousUserContext = authDpHelper.getUserStatus(
                        previousPartnerHistory ? previousPartnerHistory.salesforceUser : null
                    );

                    let isEditable = false;

                    // skip this logic case the current sf user context is either cpw or planification
                    if (currentUserStep && (3 !== currentUserStep && 4 !== currentUserStep)) {
                        isEditable = isAllowedToByPassRolesToUpdateDP
                            ? false
                            : [(previousUserContext || {}).status, currentUserContext.status].every(
                                status => ['salesman', 'assistant'].includes(status)
                            );
                    }

                    if (partnerHistoryContext && previousPartnerHistory) {
                        let isValidated = previousPartnerHistory.isValidated;
                        let snapshot = JSON.parse(state.currentPartnerSnap);
                        if ((
                                // previous step in the chain of steps, and verify if the is the right editable steps
                                ((currentUserStep === partnerHistoryContext.previousStep + 1) && isEditable) ||
                                (currentUserStep > partnerHistoryContext.previousStep &&
                                    !(('cpw' === currentUserContext.status && 'planning' === previousUserContext.status))
                                )
                            ) ||
                            // to revoke the editable case between cpw and planning
                            (
                                currentUserContext &&
                                (
                                    (
                                        'cpw' === currentUserContext.status &&
                                        'planning' !== previousUserContext.status &&
                                        currentUserContext.status !== previousUserContext.status
                                    ) ||
                                    (
                                        'planning' === currentUserContext.status &&
                                        currentUserStep > partnerHistoryContext.previousStep
                                    )
                                )
                            )
                        ) {
                            if (!partnerHistoryContext.current) {
                                isValidated = true;
                            }
                        } else if (isAllowedToByPassRolesToUpdateDP) {
                            previousPartnerHistory = partnerHistoryContext.current ||
                                partnerHistoryContext.next ||
                                partnerHistoryContext.previous ||
                                null;
                            snapshot = {
                                currentPartner,
                                salesforce: rootState.globalStore.salesforce
                            };
                        }

                        if (!partnerHistoryContext.current) {
                            // validation case the previous partnerHistory is not valid
                            updatePartnerPromise = dispatch('updatePartnerEntity', {
                                entityName: 'PartnerHistory',
                                id: previousPartnerHistory.id,
                                data: normalizer.normalizePartnerHistory({
                                    partner: currentPartner,
                                    updateDate: new Date(),
                                    snapshot,
                                    isValidated
                                }),
                                showNotification: false
                            });
                        }
                    }

                    // need to verify if there's a partnerHistory for this role, case if doesn't exist we create the first batch
                    if (partnerHistories
                        .every(partnerHistory => (partnerHistory.userId || partnerHistory.salesforceUser.Id) !== currentSFUser.Id) &&
                        !isAllowedToByPassRolesToUpdateDP
                    ) {
                        if (!updatePartnerPromise) {
                            updatePartnerPromise = Promise.resolve();
                        }
                        if (authDpHelper.getUserStep(previousPartnerHistory.salesforceUser) === currentUserStep) {
                            updatePartnerPromise = updatePartnerPromise.then(dispatch('updatePartnerEntity', {
                                entityName: 'PartnerHistory',
                                id: previousPartnerHistory.id,
                                data: normalizer.normalizePartnerHistory({
                                    partner: currentPartner,
                                    updateDate: new Date(),
                                    snapshot: {
                                        currentPartner,
                                        salesforce: rootState.globalStore.salesforce
                                    },
                                }),
                                showNotification: false
                            }));
                        } else {
                            updatePartnerPromise = updatePartnerPromise.then(
                                dispatch('registerPartnerHistory', normalizer.normalizePartnerHistory({
                                    partner: currentPartner,
                                    userId: currentSFUser.Id,
                                    creationDate: new Date(),
                                    snapshot: {
                                        currentPartner,
                                        salesforce: rootState.globalStore.salesforce
                                    },
                                    isValidated: false
                                }))
                            );
                        }
                    }
                }

                return (updatePartnerPromise || Promise.resolve()).then(
                    () => dispatch('setPartnerHistorySteps', state.currentPartner)
                );
            });
    },
    registerPartnerHistory({dispatch, commit, state, rootState}, data) {
        return dispatch('createEntity', {
            entityName: 'PartnerHistory',
            data,
            showNotification: false
        }).then(commit('setPartnerHistoryContext', {
            current: normalizer.normalizePartnerHistory({
                snapshot: {
                    currentPartner: state.currentPartner,
                    salesforce: {
                        ...rootState.globalStore.salesforce
                    }
                }
            }),
            currentStep: authDpHelper.getCurrentUserStep()
        }));
    },
    deletePartnerPropertyFromForm({dispatch, commit}, {data, showNotification}) {
        return Promise.all(
            [
                'CampaignOption',
                'SiteTree',
                'Footage',
                'OpeningRange',
                'AgendaService',
                'AgendaResource',
                'AgendaMember',
                'AgendaVisio',
                'FeeDetail',
                'BookingService',
                'BookingTimeRange',
                'DeliveryMode',
            ].map(entityName => {
                let offset = entityName.charAt(0).toLowerCase() + entityName.slice(1)
                if (undefined !== data[offset] && data[offset].id) {
                    return dispatch('deleteEntity', {
                        entityName: entityName,
                        deletedEntity: data[offset],
                        showNotification: showNotification,
                        context: data,
                    });
                }

                return Promise.resolve();
            })
        );
    },
    updatePartnerEntity({dispatch, commit}, {entityName, id, data, showNotification, context}) {
        return localfrApiService[`update${entityName}`](id, data).then(
            response => {
                let promise;
                if ('Partner' === entityName) {
                    promise = dispatch(`setCurrentPartner`, {currentPartner: response});
                } else {
                    if ('Site' === entityName) {
                        initializeEntityRelations(response, siteRelations);
                    }
                    commit(`set${entityName}`, {entityValue: response, context});
                    promise = Promise.resolve();
                }
                return promise.then(() => {
                    dispatch('updateIdentity');
                    if (false !== showNotification) {
                        dispatch(
                            'alert/success',
                            {
                                group: 'general-error',
                                type: 'success',
                                message: 'Donnée sauvegardée !',
                                show: true,
                                title: 'Envoyé !'
                            },
                            {root: true}
                        );
                    }

                    return response;
                });
            },
            () => {
                if (false !== showNotification) {
                    dispatch(
                        'alert/error',
                        {
                            group: 'general-error',
                            message: 'Impossible de mettre à jour les informations du site.',
                            show: true,
                            title: 'Erreur',
                            type: 'error'
                        },
                        {root: true}
                    );
                }
            }
        );
    },
    updateSalesforceAccount({dispatch, commit}, {entityName, id, data, showNotification}) {
        return salesforceService[`update${entityName}`](id, data).then(
            () => {
                if (false !== showNotification) {
                    dispatch(
                        'alert/success',
                        {
                            group: 'general-error',
                            type: 'success',
                            message: 'Donnée sauvegardée !',
                            show: true,
                            title: 'Envoyé !'
                        },
                        {root: true}
                    );
                }
            },
            () => {
                if (false !== showNotification) {
                    dispatch(
                        'alert/error',
                        {
                            group: 'general-error',
                            message: 'Impossible de mettre à jour les informations du compte.',
                            show: true,
                            title: 'Erreur',
                            type: 'error'
                        },
                        {root: true}
                    );
                }
            }
        );
    },
    createEntity({dispatch, commit}, {entityName, data, showNotification, context}) {
        return localfrApiService[`create${entityName}`](data).then(
            currentEntity => {
                if ('Site' === entityName) {
                    initializeEntityRelations(currentEntity, siteRelations);
                }
                commit(`add${entityName}`, {entityValue: currentEntity, context});
                dispatch('updateIdentity');
                if (false !== showNotification) {
                    dispatch(
                        'alert/success',
                        {
                            group: 'general-error',
                            type: 'success',
                            message: 'Donnée sauvegardée !',
                            show: true,
                            title: 'Envoyé !'
                        },
                        {root: true}
                    );
                }

                return currentEntity;
            },
            () => {
                if (false !== showNotification) {
                    dispatch(
                        'alert/error',
                        {
                            group: 'general-error',
                            message: 'Impossible de mettre à jour les informations du site.',
                            show: true,
                            title: 'Erreur',
                            type: 'error'
                        },
                        {root: true}
                    );
                }
            }
        );
    },
    deleteEntity({dispatch, commit}, {entityName, deletedEntity, showNotification, context}) {
        return localfrApiService[`delete${entityName}`](deletedEntity.id).then(
            response => {
                commit(`remove${entityName}`, {deletedEntity, context});
                dispatch('updateIdentity');
                if (false !== showNotification) {
                    dispatch(
                        'alert/success',
                        {
                            group: 'general-error',
                            type: 'success',
                            message: 'Donnée sauvegardée !',
                            show: true,
                            title: 'Envoyé !'
                        },
                        {root: true}
                    );
                }
            },
            () => {
                if (false !== showNotification) {
                    dispatch(
                        'alert/error',
                        {
                            group: 'general-error',
                            message: 'Impossible de mettre à jour les informations du compte.',
                            show: true,
                            title: 'Erreur',
                            type: 'error'
                        },
                        {root: true}
                    );
                }
            }
        );
    },
};

const mutations = {
    setIsStopEditing(state, value) {
        state.status.isStopEditing = value;
    },
    setTimelineSteps(state, currentPartner = null) {
        state.timelineSteps = (currentPartner || state.currentPartner).partnerHistories.map(partnerHistory => {
            const userStatus = authDpHelper
                .getUserStatus(partnerHistory && partnerHistory.salesforceUser ? partnerHistory.salesforceUser : null);

            return {
                step: userStatus && userStatus.step ? userStatus.step : null,
                snapshot: partnerHistory.snapshot,
                creationDate: partnerHistory.creationDate,
                updateDate: partnerHistory.updateDate,
                userFullname: partnerHistory && partnerHistory.salesforceUser ?
                    `${partnerHistory.salesforceUser.LastName} ${partnerHistory.salesforceUser.FirstName}` :
                    '',
                isValidated: partnerHistory && partnerHistory.isValidated
            }
        });
    },
    impersonateLoginRequest(state, impersonatedUser) {
        state.status.impersonating = true;
        state.impersonatedUser = impersonatedUser;
    },
    impersonateLoginSuccess(state, {impersonatedUser, accessToken}) {
        state.status.impersonated = true;
        state.status.impersonating = false;
        impersonatedUser.access_token = accessToken.access_token;
        state.impersonatedUser = impersonatedUser;
        state.currentPartner = impersonatedUser.partners ? impersonatedUser.partners[0] : null;
    },
    impersonateLoginFailure(state) {
        state.status.impersonated = false;
        state.status.impersonating = false;
        state.impersonatedUser = null;
        state.currentPartner = null;
    },
    impersonateLogout(state) {
        state.status.impersonated = false;
        state.status.impersonating = false;
        state.impersonatedUser = null;
        state.currentPartner = null;
    },
    loginRequest(state, user) {
        state.status = {
            loggingIn: true,
            logoutModal: Object.assign({}, initialLogoutModal)
        };
        state.user = user;
    },
    loginSuccess(state, {user, me}) {
        state.status = {
            loggedIn: true,
            logoutModal: Object.assign({}, initialLogoutModal)
        };
        state.user = user;
        state.identity = me;
        if (me.salesforceUser) {
            state.salesforceUser = me.salesforceUser;
        }
    },
    loginFailure(state) {
        state.status = {
            logoutModal: Object.assign({}, initialLogoutModal)
        };
        state.user = null;
    },
    logout(state) {
        state.status = {
            logoutModal: Object.assign({}, initialLogoutModal)
        };
        state.user = null;
        state.impersonatedUser = null;
        state.identity = null;
        state.salesforceUser = null;
        state.currentPartner = null;
    },
    salesforceUsersLoadingRequest(state, userId) {
        if (!state.status.isSalesforceUsersLoading) {
            state.status.isSalesforceUsersLoading = {};
        }
        state.status.isSalesforceUsersLoading[userId] = true;
    },
    salesforceUsersLoadingSuccess(state, user) {
        if (!state.status.isSalesforceUsersLoading) {
            state.status.isSalesforceUsersLoading = {};
        }
        state.salesforceUsers[user.Id] = user;
        state.status.isSalesforceUsersLoading[user.Id] = false;
    },
    salesforceUsersLoadingFailure(state, userId) {
        if (!state.status.isSalesforceUsersLoading) {
            state.status.isSalesforceUsersLoading = {};
        }
        state.status.isSalesforceUsersLoading[userId] = false;
    },
    setRefreshTokenExpiresAt(state, value) {
        state.status.logoutModal.refreshTokenExpiresAt = value;
    },
    updateRefreshTokenState(state, value) {
        state.status.logoutModal.refreshTokenTtlState = value;
    },
    isShowLogoutModal(state, value) {
        state.status.logoutModal.isShowLogoutModal = value;
    },
    setIsShowAccessPfModal(state, value) {
        state.accessPfModalInformation.show = value;
    },
    setAccessPfModalInformation(state, value) {
        if (state.isCurrentMainUserOnPf) {
            state.accessPfModal = value;
        }
    },
    setAccessPfModalData(state, value) {
        state.accessPfModalInformation = value;
    },
    setAccessPfModalShow(state, value) {
        state.accessPfModal.isShowAccessPfModal = value;
    },
    setIdentity(state, {identity}) {
        state.identity = identity;
    },
    isCurrentMainUserOnPf(state, value) {
        state.isCurrentMainUserOnPf = value;
    },
    updateUser(state, value) {
        state.user = value;
    },
    setCurrentPartner(state, {currentPartner}) {
        if (currentPartner
            && currentPartner.sites
            && currentPartner.sites[0]
            && currentPartner.sites[0].siteTrees
            && currentPartner.sites[0].siteTrees.length > 1
        ) {
            currentPartner.sites[0].siteTrees.sort((a, b) => a.position - b.position);
        }
        state.currentPartner = currentPartner;
    },
    setCurrentPartnerSnap(state, currentPartnerSnap) {
        state.currentPartnerSnap = JSON.stringify(currentPartnerSnap);
    },
    setPartnerHistoryContext(state, data) {
        if (!state.partnerHistoryContext) {
            state.partnerHistoryContext = {};
        }
        state.partnerHistoryContext = Object.assign(state.partnerHistoryContext, data);
        localStorage.setItem('partnerHistoryContext', JSON.stringify(state.partnerHistoryContext));
    },
    resetPartnerHistoryContext(state) {
        state.partnerHistoryContext = {};
        localStorage.setItem('partnerHistoryContext', JSON.stringify(state.partnerHistoryContext));
    },
    addPartnerAutoImmo(state, {entityValue}) {
        state.currentPartner.partnerAutoImmo = entityValue;
    },
    setPartnerAutoImmo(state, {entityValue}) {
        state.currentPartner.partnerAutoImmo = entityValue;
    },
    addPartnerHotelResto(state, {entityValue}) {
        state.currentPartner.partnerHotelResto = entityValue;
    },
    setPartnerHotelResto(state, {entityValue}) {
        state.currentPartner.partnerHotelResto = entityValue;
    },
    addPartnerBoutique(state, {entityValue}) {
        state.currentPartner.partnerBoutique = entityValue;
    },
    setPartnerBoutique(state, {entityValue}) {
        state.currentPartner.partnerBoutique = entityValue;
    },
    addPartnerShop(state, {entityValue}) {
        state.currentPartner.partnerShop = entityValue;
    },
    setPartnerShop(state, {entityValue}) {
        state.currentPartner.partnerShop = entityValue;
    },
    setSite(state, {entityValue}) {
        if (entityValue.siteTrees && entityValue.siteTrees.length > 1) {
            entityValue.siteTrees.sort((a, b) => a.position - b.position);
        }
        fillEntity(state.currentPartner.sites[0], entityValue);
    },
    addSite(state, {entityValue}) {
        state.currentPartner.sites[0] = entityValue;
    },
    setPartnerHistory(state, {entityValue}) {
        let found = false;
        if (!state.currentPartner.partnerHistories) {
            state.currentPartner.partnerHistories = [];
        } else {
            state.currentPartner.partnerHistories.forEach(function (item, index) {
                if (item.id === entityValue.id) {
                    found = true;
                    state.currentPartner.partnerHistories[index] = entityValue;
                }
            });
        }

        if (!found) {
            entityValue.salesforceUser = state.salesforceUser;
            state.currentPartner.partnerHistories.push(entityValue);
        }
    },
    addPartnerHistory(state, {entityValue}) {
        if (!state.currentPartner.partnerHistories) {
            state.currentPartner.partnerHistories = [];
        }

        entityValue.salesforceUser = state.salesforceUser;
        state.currentPartner.partnerHistories.push(entityValue);
    },
    setNote(state, {entityValue}) {
        let found = false;
        state.currentPartner.notes.forEach(function (item, index) {
            if (item.id === entityValue.id) {
                found = true;
                state.currentPartner.notes[index] = entityValue;
            }
        });

        if (!found) {
            state.currentPartner.notes.push(entityValue);
        }
    },
    addNote(state, {entityValue}) {
        state.currentPartner.notes.push(entityValue);
    },
    setAgenda(state, {entityValue}) {
        state.currentPartner.agenda = entityValue;
    },
    setBookEngine(state, {entityValue}) {
        state.currentPartner.bookEngines[0] = entityValue;
    },
    setTargetingCookie(state, value) {
        state.status.targetingCookie = value;
    },
    setPerformanceCookie(state, value) {
        state.status.performanceCookie = value;
    },
    setBanner(state, {entityValue}) {
        state.currentPartner.sites[0].banners[0] = entityValue;
    },
    addBanner(state, {entityValue}) {
        state.currentPartner.sites[0].banners[0] = entityValue;
    },
    setFootage(state, {entityValue}) {
        state.currentPartner.footages[0] = entityValue;
    },
    addFootage(state, {entityValue}) {
        let found = false;
        state.currentPartner.footages.forEach(function (item, index) {
            if (!item.id && entityValue.name === item.name) {
                found = true;
                state.currentPartner.footages[index] = entityValue;
            }
        });

        if (!found) {
            state.currentPartner.footages.push(entityValue);
        }
    },
    removeFootage(state, {deletedEntity}) {
        let index = state.currentPartner.footages.findIndex(item => item.id === deletedEntity.id);
        if (-1 !== index) {
            state.currentPartner.footages.splice(index, 1);
        }
    },
    setSocialNetwork(state, {entityValue}) {
        let found = false;
        state.currentPartner.socialNetworks.forEach(function (item, index) {
            if (item.id === entityValue.id) {
                found = true;
                state.currentPartner.socialNetworks[index] = entityValue;
            }
        });

        if (!found) {
            state.currentPartner.socialNetworks.push(entityValue);
        }
    },
    addSocialNetwork(state, {entityValue}) {
        state.currentPartner.socialNetworks.push(entityValue);
    },
    setDeliveryMode(state, {entityValue, context}) {
        const deliveryModes = getDeliveryModes(context.parentEntityName);
        let found = false;
        deliveryModes.forEach(function (item, index) {
            if (item.id === entityValue.id) {
                found = true;
                deliveryModes[index] = entityValue;
            }
        });

        if (!found) {
            deliveryModes.push(entityValue);
        }
    },
    addDeliveryMode(state, {entityValue, context}) {
        const deliveryModes = getDeliveryModes(context.parentEntityName);

        if (deliveryModes) {
            let found = deliveryModes.some(function (item, index) {
                if (item.name === entityValue.name) {
                    found = true;
                    deliveryModes[index] = entityValue;
                    return true;
                }

                return false;
            });

            if (!found) {
                deliveryModes.push(entityValue);
            }
        }
    },
    removeDeliveryMode(state, {deletedEntity, context}) {
        const deliveryModes = getDeliveryModes(context.parentEntityName);
        let index = deliveryModes.findIndex(deliveryMode => deliveryMode.id === deletedEntity.id);
        if (-1 !== index) {
            deliveryModes.splice(index, 1);
        }
    },
    setCampaignOption(state, {entityValue}) {
        let found = false;
        state.currentPartner.campaignOptions.forEach(function (item, index) {
            if (item.id === entityValue.id) {
                found = true;
                state.currentPartner.campaignOptions[index] = entityValue;
            }
        });

        if (!found) {
            state.currentPartner.campaignOptions.push(entityValue);
        }
    },
    addCampaignOption(state, {entityValue}) {
        state.currentPartner.campaignOptions.push(entityValue);
    },
    removeCampaignOption(state, {deletedEntity}) {
        let index = state.currentPartner.campaignOptions.findIndex(campaign => campaign.id === deletedEntity.id);
        if (-1 !== index) {
            state.currentPartner.campaignOptions.splice(index, 1);
        }
    },
    setSiteTree(state, {entityValue}) {
        if (!state.currentPartner
            || !state.currentPartner.sites
            || !state.currentPartner.sites[0]) {
            return;
        }

        if (!state.currentPartner.sites[0].siteTrees) {
            state.currentPartner.sites[0].siteTrees = [];
        }

        let index = state.currentPartner.sites[0].siteTrees.findIndex(item => item.id === entityValue.id);
        if (index < 0) {
            state.currentPartner.sites[0].siteTrees.push(entityValue);
        }
    },
    addSiteTree(state, {entityValue}) {
        if (!state.currentPartner
            || !state.currentPartner.sites
            || !state.currentPartner.sites[0]) {
            return;
        }

        if (!state.currentPartner.sites[0].siteTrees) {
            state.currentPartner.sites[0].siteTrees = [];
        }

        let index = state.currentPartner.sites[0].siteTrees.findIndex(
            item => !item.id && entityValue.name === item.name && entityValue.position === item.position
        );
        if (index < 0) {
            state.currentPartner.sites[0].siteTrees.push(entityValue);
        } else {
            state.currentPartner.sites[0].siteTrees[index] = entityValue;
        }
    },
    removeSiteTree(state, {deletedEntity}) {
        if (!state.currentPartner
            || !state.currentPartner.sites
            || !state.currentPartner.sites[0]
            || !state.currentPartner.sites[0].siteTrees
            || !state.currentPartner.sites[0].siteTrees.length
        ) {
            return;
        }

        let index = state.currentPartner.sites[0].siteTrees.findIndex(item => item.id === deletedEntity.id);
        if (-1 !== index) {
            state.currentPartner.sites[0].siteTrees.splice(index, 1);
        }
    },
    setFeeDetail(state, {entityValue}) {
        let found = false;
        state.currentPartner.deliveryModes[0].feeDetails.forEach(function (item, index) {
            if (item.id === entityValue.id) {
                found = true;
                state.currentPartner.deliveryModes[0].feeDetails[index] = entityValue;
            }
        });

        if (!found) {
            state.currentPartner.deliveryModes[0].feeDetails.push(entityValue);
        }
    },
    addFeeDetail(state, {entityValue}) {
        let found = false;
        state.currentPartner.deliveryModes[0].feeDetails.forEach(function (item, index) {
            if (!item.id && entityValue.name === item.name) {
                found = true;
                state.currentPartner.deliveryModes[0].feeDetails[index] = entityValue;
            }
        });

        if (!found) {
            state.currentPartner.deliveryModes[0].feeDetails.push(entityValue);
        }
    },
    removeFeeDetail(state, {deletedEntity}) {
        let index = state.currentPartner.deliveryModes[0].feeDetails.findIndex(item => item.id === deletedEntity.id);
        if (-1 !== index) {
            state.currentPartner.deliveryModes[0].feeDetails.splice(index, 1);
        }
    },
    setAgendaMember(state, {entityValue}) {
        let found = false;
        state.currentPartner.agenda.agendaMembers.forEach(function (item, index) {
            if (item.id && entityValue.id === item.id) {
                found = true;
                state.currentPartner.agenda.agendaMembers[index] = entityValue;
            }
        });

        if (!found) {
            state.currentPartner.agenda.agendaMembers.push(entityValue);
        }
    },
    addAgendaMember(state, {entityValue}) {
        for (let index in state.currentPartner.agenda.agendaMembers) {
            let item = state.currentPartner.agenda.agendaMembers[index];
            if (!item.id && item.memberType === entityValue.memberType) {
                state.currentPartner.agenda.agendaMembers[index] = entityValue;
                return;
            }
        }
    },
    removeAgendaMember(state, {deletedEntity}) {
        let index = state.currentPartner.agenda.agendaMembers.findIndex(item => item.id === deletedEntity.id);
        if (-1 !== index) {
            state.currentPartner.agenda.agendaMembers.splice(index, 1);
        }
    },
    setAgendaService(state, {entityValue}) {
        let found = false;
        state.currentPartner.agenda.agendaServices.forEach(function (item, index) {
            if (item.id && entityValue.id === item.id) {
                found = true;
                state.currentPartner.agenda.agendaServices[index] = entityValue;
            }
        });

        if (!found) {
            state.currentPartner.agenda.agendaServices.push(entityValue);
        }
    },
    addAgendaService(state, {entityValue}) {
        for (let index in state.currentPartner.agenda.agendaServices) {
            let item = state.currentPartner.agenda.agendaServices[index];
            if (!item.id) {
                state.currentPartner.agenda.agendaServices[index] = entityValue;
                return;
            }
        }
    },
    removeAgendaService(state, {deletedEntity}) {
        let index = state.currentPartner.agenda.agendaServices.findIndex(item => item.id === deletedEntity.id);
        if (-1 !== index) {
            state.currentPartner.agenda.agendaServices.splice(index, 1);
        }
    },
    setAgendaResource(state, {entityValue}) {
        let found = false;
        state.currentPartner.agenda.agendaResources.forEach(function (item, index) {
            if (item.id && entityValue.id === item.id) {
                found = true;
                state.currentPartner.agenda.agendaResources[index] = entityValue;
            }
        });

        if (!found) {
            state.currentPartner.agenda.agendaResources.push(entityValue);
        }
    },
    addAgendaResource(state, {entityValue}) {
        for (let index in state.currentPartner.agenda.agendaResources) {
            let item = state.currentPartner.agenda.agendaResources[index];
            if (!item.id) {
                state.currentPartner.agenda.agendaResources[index] = entityValue;
                return;
            }
        }
    },
    removeAgendaResource(state, {deletedEntity}) {
        let index = state.currentPartner.agenda.agendaResources.findIndex(item => item.id === deletedEntity.id);
        if (-1 !== index) {
            state.currentPartner.agenda.agendaResources.splice(index, 1);
        }
    },
    setAgendaVisio(state, {entityValue}) {
        let found = false;
        state.currentPartner.agenda.agendaVisios.forEach(function (item, index) {
            if (item.id && entityValue.id === item.id) {
                found = true;
                state.currentPartner.agenda.agendaVisios[index] = entityValue;
            }
        });
        if (!found) {
            state.currentPartner.agenda.agendaVisios.push(entityValue);
        }
    },
    addAgendaVisio(state, {entityValue}) {
        let found = false;
        state.currentPartner.agenda.agendaVisios.forEach(function (item, index) {
            if (!item.id) {
                found = true;
                state.currentPartner.agenda.agendaVisios[index] = entityValue;
            }
        });

        if (!found) {
            state.currentPartner.agenda.agendaVisios.push(entityValue);
        }
    },
    removeAgendaVisio(state, {deletedEntity}) {
        let index = state.currentPartner.agenda.agendaVisios.findIndex(item => item.id === deletedEntity.id);
        if (-1 !== index) {
            state.currentPartner.agenda.agendaVisios.splice(index, 1);
        }
    },
    setBookingService(state, {entityValue}) {
        let found = false;
        state.currentPartner.partnerHotelResto.bookingServices.forEach(function (item, index) {
            if (item.id && entityValue.id === item.id) {
                found = true;
                state.currentPartner.partnerHotelResto.bookingServices[index] = entityValue;
            }
        });
        if (!found) {
            state.currentPartner.partnerHotelResto.bookingServices.push(entityValue);
        }
    },
    addBookingService(state, {entityValue}) {
        let found = false;
        state.currentPartner.partnerHotelResto.bookingServices.forEach(function (item, index) {
            if (item.name === entityValue.name) {
                found = true;
                state.currentPartner.partnerHotelResto.bookingServices[index] = entityValue;
            }
        });

        if (!found) {
            state.currentPartner.partnerHotelResto.bookingServices.push(entityValue);
        }
    },
    removeBookingService(state, {deletedEntity}) {
        let index = state.currentPartner.partnerHotelResto.bookingServices.findIndex(item => item.id === deletedEntity.id);
        if (-1 !== index) {
            state.currentPartner.partnerHotelResto.bookingServices.splice(index, 1);
        }
    },
    setBookingTimeRange(state, {entityValue, context}) {
        let found = false;
        state.currentPartner.partnerHotelResto.bookingServices[context.serviceIndex].timeRanges.forEach(function (item, index) {
            if (item.id && entityValue.id === item.id) {
                found = true;
                state.currentPartner.partnerHotelResto.bookingServices[context.serviceIndex].timeRanges[index] = entityValue;
            }
        });
        if (!found) {
            state.currentPartner.partnerHotelResto.bookingServices[context.serviceIndex].timeRanges.push(entityValue);
        }
    },
    addBookingTimeRange(state, {entityValue, context}) {
        let found = false;
        state.currentPartner.partnerHotelResto.bookingServices[context.serviceIndex].timeRanges.forEach(function (item, index) {
            if (!item.id) {
                found = true;
                state.currentPartner.partnerHotelResto.bookingServices[context.serviceIndex].timeRanges[index] = entityValue;
            }
        });

        if (!found) {
            state.currentPartner.partnerHotelResto.bookingServices[context.serviceIndex].timeRanges.push(entityValue);
        }
    },
    removeBookingTimeRange(state, {deletedEntity, context}) {
        let index = state.currentPartner.partnerHotelResto.bookingServices[context.serviceIndex].timeRanges.findIndex(item => item.id === deletedEntity.id);
        if (-1 !== index) {
            state.currentPartner.partnerHotelResto.bookingServices[context.serviceIndex].timeRanges.splice(index, 1);
        }
    },
    setOpeningRange(state, {entityValue, context}) {
        let timeRanges = getOpeningRanges(context.parentEntityName, entityValue);
        let found = false;
        timeRanges.forEach(function (item, index) {
            if (item.id === entityValue.id) {
                found = true;
                timeRanges[index] = entityValue;
            }
        });

        if (!found) {
            timeRanges.push(entityValue);
        }
    },
    addOpeningRange(state, {entityValue, context}) {
        let timeRanges = getOpeningRanges(context.parentEntityName, entityValue);

        if (timeRanges) {
            let found = timeRanges.some((item, index) => {
                if (item.id === entityValue.id) {
                    timeRanges[index] = entityValue;
                    return true;
                }

                return false;
            });

            if (!found) {
                timeRanges.push(entityValue);
            }
        }
    },
    removeOpeningRange(state, {deletedEntity, context}) {
        let timeRanges = getOpeningRanges(context.parentEntityName, deletedEntity);
        let index = timeRanges.findIndex(item => item.id === deletedEntity.id);
        if (-1 !== index) {
            timeRanges.splice(index, 1);
        }
    },
};

export const account = {
    namespaced: true,
    state,
    actions,
    mutations
};
