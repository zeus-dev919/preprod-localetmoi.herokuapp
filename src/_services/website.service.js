import { store } from '@/_store';
import { toolboxService } from './toolbox.service';
import { tedsService } from "./teds.service";

export const websiteService = {
    getWebsiteAutologin,
    getUbiflowUrl
};

async function getWebsiteAutologin(source) {
    switch (source) {
        case 'toolbox':
            return await toolboxService.getAutologin(store.state.account.currentPartner.customerCode);
        case 'ecommerce':
            return process.env.OXATIS_URL;
        default :
            if (store.state.globalStore.status.isNewLocalBoutique ||
                store.state.globalStore.status.isLocalRestoBoutique
            ) {
                tedsService.getAutologin(
                    store.state.account.currentPartner.customerCode,
                    store.state.account.identity.email,
                    store.state.globalStore.websiteLink
                ).catch(() => {
                    store.dispatch('alert/error', {
                        group: 'auth-error',
                        message: 'Impossible d\'accéder à la boutique Click&Collect',
                        show: true,
                        title: 'Service indisponible',
                        type: 'error'
                    }, { root: true });
                });
            }
            if (store.state.globalStore.status.isLocalRestoBoutique ||
                store.state.globalStore.status.isLocalRestoWebtool
            ) {
                toolboxService
                    .getAutologin(store.state.account.currentPartner.customerCode)
                    .then(toolBoxUrl => store.dispatch('globalStore/setToolBoxPartnerUrl', toolBoxUrl, { root: true }));
            }

            let accessToken = store.state.account.user.access_token;
            if (store.state.account.impersonatedUser && store.state.account.impersonatedUser.access_token) {
                accessToken = store.state.account.impersonatedUser.access_token;
            }

            return process.env.WEBTOOL_BASE_URL +
                process.env.WEBTOOL_TOKEN_CONNECTION +
                '?bearer=' + accessToken;

    }
}

function getUbiflowUrl() {
    return process.env.UBIFLOW_URL;
}

