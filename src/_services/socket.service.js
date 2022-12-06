import { io } from 'socket.io-client';
import { store } from '@/_store';
import {salesforceService} from './salesforce.service';

export const socketService = {
    setupSocketConnection,
    disconnect,
    askAccess,
    giveAccess,
    giveAccessAfterInterval,
    accessRefused
};

var socket;

function setupSocketConnection({ customerCode, identity }) {

    socket = io(process.env.LOCALETMOI_BASE_URL, {transports: ['websocket']});

    socket.on('connectedUsers', async (userIds, requestSocket = null, wait = null, socketIdDisconnected = null) => {
        let userPosition = userIds.map(user => user.socketId).indexOf(socket.id) + 1;
        if (socketIdDisconnected && store.state.account.accessPfModal.socket === socketIdDisconnected) {
            store.dispatch('globalStore/setStartTimer', false, {root: true});
            store.dispatch('account/setAccessPfModalInformation', {
                isShowAccessPfModal: false,
                userName: null,
                socket: null,
                id: null
            }, {root: true});
        }
        if (1 === userIds.length) {
            store.dispatch('account/isCurrentMainUserOnPf', true, {root: true});
            store.dispatch('account/setIdentity', {
                identity: {
                    ...identity,
                    allowedToEdit: true
                }
            }, {root: true});
            store.dispatch('account/setAccessPfModalData', {
                show: false,
                message: null
            }, {root: true});
            store.dispatch('globalStore/setIsRetrievingUpdatedPf', false, {root: true});
        } else {
            store.dispatch('account/setAccessPfModalData', {
                show: true,
                message: userPosition > 1
                    ? `Mode lecture du DP. ${userIds[0].username} modifie actuellement le DP.`
                    : `Mode édition du DP. Une autre personne est en train de consulter le DP.`
            }, {root: true});
            if (userPosition === 1 && requestSocket) {
                store.dispatch('globalStore/setIsRetrievingUpdatedPf', true, {root: true});
                store.dispatch('globalStore/getPartner', customerCode, {root: true}).then(
                    partners => {
                        if (partners['hydra:member'] && partners['hydra:member'].length) {
                            let partner = partners['hydra:member'][0];
                            salesforceService.getAccount(partner.company).then((account) => {
                                store.commit('globalStore/getSalesforceAccountSuccess', {account}, {root: true});
                            });
                            salesforceService.getContact(partner.company).then((contact) => {
                                store.commit('globalStore/getSalesforceContactSuccess', {contact}, {root: true});
                            });
                            store.dispatch('account/setCurrentPartner', { currentPartner: partner }, {root: true});
                        }
                    }
                ).finally(() => {
                    store.dispatch('globalStore/setIsRetrievingUpdatedPf', false, {root: true});
                    store.dispatch('account/setIdentity', {
                        identity: {
                            ...identity,
                            allowedToEdit: userPosition <= 1
                        }
                    }, {root: true});
                }
                );
            }
            if (userPosition !== 1) {
                store.dispatch('globalStore/getPartner', customerCode, {root: true}).then(partners => {
                    store.dispatch('account/setIdentity', {
                        identity: {
                            ...identity,
                            allowedToEdit: false
                        }
                    }, {root: true});
                });
            }
            store.dispatch('account/isCurrentMainUserOnPf', userPosition === 1, {root: true});

            if (requestSocket && requestSocket === socket.id && wait) {
                store.dispatch('account/setAccessPfModalData', {
                    show: true,
                    message: userPosition > 1
                        ? `Votre demande a été acceptée. Vous pourrez l'éditer dans`
                        : `Mode lecture du DP. ${userIds[0].username} modifie actuellement le DP.`
                }, {root: true});
                store.dispatch('globalStore/setIsRequestForAccessIsActive', false, { root: false });
                store.dispatch('globalStore/setIsStartTimerForWaiting', true, { root: false });
            }
            await store.dispatch('globalStore/loadPartnerInformation', customerCode, {root: true});
        }
    });

    socket.on('access-refused', (userIds, requestSocket = null) => {
        let userPosition = userIds.map(user => user.socketId).indexOf(socket.id) + 1;
        if (requestSocket === socket.id) {
            store.dispatch('account/setAccessPfModalData', {
                show: true,
                message: `Un CRP a refusé votre demande d'accès au dossier partenaire.`
            }, {root: true});
            store.dispatch('globalStore/setIsRequestForAccessIsActive', false, { root: false });
        } else {
            store.dispatch('account/setAccessPfModalData', {
                show: true,
                message: userPosition > 1
                    ? `Mode lecture du DP. ${userIds[0].username} modifie actuellement le DP.`
                    : `Mode édition du DP. Une autre personne est en train de consulter le DP.`
            }, {root: true});
        }
    });

    socket.emit('connectToPf', {customerCode, identity});

    socket.on('access', ({userName, socketId, id}) => {
        store.dispatch('account/setAccessPfModalInformation', {
            isShowAccessPfModal: true,
            userName,
            socket: socketId,
            id
        }, {root: true});
    });
}

function disconnect(customerCode, identityId) {
    socket && socket.emit('disconnectFromPf', {customerCode, identityId});
}

function askAccess(customerCode, identity) {
    socket && socket.emit('access', { customerCode, userName: identity.name, socketId: socket.id, id: identity.id });
    store.dispatch('globalStore/setIsRequestForAccessIsActive', true, { root: true });
}

function giveAccess(customerCode, identity, requestSocket, id) {
    store.dispatch('account/setIdentity', {
        identity: {
            ...identity,
            allowedToEdit: false
        }
    }, { root: true });
    store.dispatch('account/isCurrentMainUserOnPf', true, {root: true});
    socket.emit('connectToPf', { customerCode, identity, requestSocket, id });
}

function accessRefused(customerCode, requestSocket) {
    socket && socket.emit('access-refused', { customerCode, requestSocket });
}
function giveAccessAfterInterval(customerCode, requestSocket) {
    socket.emit('wait-30-sec', { customerCode, requestSocket });
}
