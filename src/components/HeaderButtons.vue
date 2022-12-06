<template>
    <b-container fluid class="bc-example-row">
        <app-headergeneral />
        <b-row class="text-center justify-content-center" v-if="isUser">
            <b-col xl="1" lg="1" md="12" sm="12">
                <router-link to="/accueil" class='link-header' >
                    <img width="40" src="../assets/icon.png" />
                </router-link>
            </b-col>
            <b-col xl="2" lg="3" sm="4" class="hidden-for-mobile" :class="{'unavailable': globalStoreStatus.updateWebsiteDisabled }" v-if="cmsUrl">
                <b-link class="link-menu" :href="cmsUrl" target="_blank">
                    <div class="update-button button-profile">Mettre à jour mon site</div>
                </b-link>
            </b-col>
            <b-col xl="2" lg="3" sm="12">
                <router-link to="/demandes" class='link-header'>
                    <div class="ask-button button-profile">Mes demandes</div>
                </router-link>
            </b-col>
            <b-col xl="2" lg="3" sm="12" class="hidden-for-mobile" v-if="allowPartnerFolderAccess">
                <router-link to="/dossier-partenaire" class="link-header">
                    <div class="update-button button-profile">Mon dossier partenaire</div>
                </router-link>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import { mapState } from "vuex";
import { authDpHelper } from "../_helpers/auth-dp.helper";

export default {
    app: 'HeaderButton',
    computed: {
        ...mapState('account', ['currentPartner', 'identity', 'status']),
        ...mapState('globalStore', {
            salesforce: state => state.salesforce,
            globalStoreStatus: state => state.status,
            partner: state => state.partner,
            websitePublicationDate: state => state.websitePublicationDate
        }),
        allowPartnerFolderAccess() {
            return this.currentPartner
                && this.currentPartner.hasPartnerFolder
                && this.salesforce.dpValidated.canEdit
                && this.globalStoreStatus.hasPartnerFolderAccess;
        },
        isUser() {
            return authDpHelper.isUser(this.identity);
        },
        cmsUrl() {
            return (!this.status.isWebtool || null !== this.websitePublicationDate) &&
                this.currentPartner &&
                this.currentPartner.source
                ? this.partner.url[this.currentPartner.source.toLowerCase()] : null;
        }
    }
};
</script>
