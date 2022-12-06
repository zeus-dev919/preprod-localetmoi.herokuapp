import { dateHelpers } from "./date.helper";
import {
    allowedRolesToEditPartnerFolder,
    allowedRolesToTransmitPartnerFolder,
    byPassRulesToEditDP
} from "../Interface/permissions";
import { store } from "@/_store";

export const authDpHelper = {
    canEditPartnerFolder,
    isUser,
    isProvider,
    isSalesman,
    isSuperAdmin,
    hasRoleToEditPartnerFolder,
    checkPartnerFolderAccess,
    getUserStatus,
    getUserStep,
    getCurrentUserStep,
    canTransmitPf,
    canByPassRolesToUpdatePf,
};

function hasRole(identity, role) {
    return -1 !== identity.roles.indexOf(role);
}

function isUser(identity) {
    return hasRole(identity, 'ROLE_CLIENT') || hasRole(identity, 'ROLE_ADMIN');
}

function isProvider(identity) {
    return hasRole(identity, 'ROLE_PROVIDER');
}

function isSalesman(identity) {
    return hasRole(identity, 'ROLE_SALESMAN') || hasRole(identity, 'ROLE_CRP');
}

function isSuperAdmin(identity) {
    return hasRole(identity, 'ROLE_SUPER_ADMIN') || hasRole(identity, 'ROLE_MANAGER') || hasRole(identity, 'ROLE_DEV_ADMIN');
}

function canEditPartnerFolder(opportunityDate, identity) {
    const dpValidatedDate = opportunityDate ? dateHelpers.strDateToObject(opportunityDate) : null;
    const dpValidatedDateFormatted = dpValidatedDate ? dpValidatedDate.toLocaleString('fr-FR').substring(0, 10) : null;

    switch (true) {
        case isSalesman(identity):
            return {
                canEdit: !dpValidatedDate ? true : dpValidatedDate > new Date(),
                validatedDpDate: dpValidatedDateFormatted
            };

        case isProvider(identity):
            return {
                canEdit: false,
                validatedDpDate: dpValidatedDateFormatted
            };

        case isUser(identity):
            return {
                canEdit: !dpValidatedDate ? false : dpValidatedDate < new Date(),
                validatedDpDate: dpValidatedDateFormatted
            };

        case isSuperAdmin(identity):
            return {
                canEdit: true,
                validatedDpDate: dpValidatedDateFormatted
            };

        default:
            return {
                canEdit: false,
                validatedDpDate: dpValidatedDateFormatted
            };
    }
}

function checkPartnerFolderAccess({ IsClosed }, identity) {
    if (isUser(identity)) {
        return !IsClosed;
    }
    return true;
}

function hasRoleToEditPartnerFolder(user) {
    return allowedRolesToEditPartnerFolder.filter(role => -1 !== user.roles.indexOf(role)).length > 0;
}

function getUserStatus(user) {
    if (!user || !user.Fonction_hi_rarchique__c) {
        return null;
    }

    return allowedRolesToTransmitPartnerFolder.find(item => -1 !== item.roles.indexOf(user.Fonction_hi_rarchique__c));
}

function getUserStep(user) {
    const status = user ? getUserStatus(user) : null;

    return status ? status.step : null;
}

function getCurrentUserStep() {
    const currentUserStatus = getUserStatus(store.state.account.salesforceUser);

    return currentUserStatus ? currentUserStatus.step : null;
}

function canTransmitPf() {
    const currentUserStep = getCurrentUserStep();
    const currentSfUser = store.state.account.salesforceUser;
    const partnerHistoryContext = store.state.account.partnerHistoryContext;
    const allowedRoles = allowedRolesToTransmitPartnerFolder
        .reduce((accumulator, allowedRole) => {
            accumulator.push(...allowedRole.roles)
            return accumulator;
        }, []);
    if (!currentSfUser) {
        return false;
    } else if (!Object.keys(partnerHistoryContext).length) {
        return allowedRoles.includes(currentSfUser.Fonction_hi_rarchique__c);
    }
    let canTransmit = false;
    switch (currentUserStep) {
        case 1:
            canTransmit = (partnerHistoryContext.currentStep || null) < 2 && !partnerHistoryContext.next && !partnerHistoryContext.nextStep;
            break;
        case 2:
            canTransmit = (
                    (
                        (partnerHistoryContext.current && (partnerHistoryContext.currentStep || null) === currentUserStep) ||
                        (partnerHistoryContext.previous && (partnerHistoryContext.previousStep || null) + 1 === currentUserStep)
                    ) &&
                    !partnerHistoryContext.next
                );
            break;
        case 3:
        case 4:
            canTransmit = true;
            break;
    }
    return canTransmit;
}

function canByPassRolesToUpdatePf() {
    return store.state.account && store.state.account.salesforceUser &&
        byPassRulesToEditDP.includes(store.state.account.salesforceUser.Fonction_hi_rarchique__c);
}
