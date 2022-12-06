<template>
    <b-row>
        <b-col class="logo-menu-container">
            <template v-if="allowedToComeBackToDP && 'EspacePartage' === $route.name">
                <img class="back-dp-button" src="../assets/back-dp.png" title="Revenir au Dossier Partenaire" @click="backToPartnershipFolder()"/>
            </template>
            <b-dropdown variant="link" size="lg" right text="Right align" no-caret v-if="'BackOffice' !== $route.name">
                <template slot="button-content">
                    <img class="logo-menu-header" src="../assets/menu.png" title="Menu" />
                </template>
                <b-dropdown-item v-if="allowBackOfficeAccess" href="/#/backoffice" class="text-menu hidden-for-mobile">
                    <img class="logo-dropdown" src="../assets/mettre-a-jour-mon-site.png" />Retour au back-office
                </b-dropdown-item>
                <b-dropdown-item v-if="cmsUrl" v-bind:href="cmsUrl" target="_blank" class="text-menu hidden-for-mobile" v-bind:class="{'unavailable': $store.state.globalStore.status.updateWebsiteDisabled }">
                    <img class="logo-dropdown" src="../assets/mettre-a-jour-mon-site.png" />Mettre à jour mon site
                </b-dropdown-item>
                <b-dropdown-item v-bind:href="$store.state.globalStore.ubiflowLink" target="_blank" class="text-menu"
                                 v-if="isUser && $store.state.globalStore.status.isUbiflow &&
                                  'BackOffice' !== $route.name && 'BackOfficePartnershipFolder' !== $route.name">
                    <img class="logo-dropdown back-home" src="../assets/annonces.png" />Mes annonces
                </b-dropdown-item>
                <b-dropdown-divider class="hidden-for-mobile"
                                    v-if="'BackOffice' !== $route.name && 'BackOfficePartnershipFolder' !== $route.name && isUser">
                </b-dropdown-divider>
                <b-dropdown-item href="/#/accueil" class="text-menu backtomenu pr-lg-5 pr-md-5"
                                 v-on:click="reloadPage"
                                 v-if="'BackOfficePartnershipFolder' !== $route.name && isUser">
                    <img class="logo-dropdown back-home" src="../assets/icon.png" />Retour à l'accueil
                </b-dropdown-item>
            </b-dropdown>
            <b-dropdown variant="link" size="lg" right text="Right align" no-caret
                        v-if="'BackOffice' !== $route.name && 'BackOfficePartnershipFolder' !== $route.name && isUser">
                <template slot="button-content">
                    <img class="logo-ask" width="10" src="../assets/point-d-interrogation.png" />
                </template>
                <b-dropdown-item href="/#/demandes/creer" class="text-menu">
                    <img class="logo-dropdown" src="../assets/creer-une-demande.png" />Créer une demande
                </b-dropdown-item>
                <b-dropdown-divider></b-dropdown-divider>
                <b-dropdown-item href="/#/demandes" class="text-menu">
                    <img class="logo-dropdown" src="../assets/voir-mes-demandes.png" />Voir mes demandes
                </b-dropdown-item>
                <b-dropdown-divider></b-dropdown-divider>
                <b-dropdown-item href="/#/aide/tutorial" class="text-menu">
                    <img class="logo-dropdown" src="../assets/learning_tutorials.svg" />Mes formations en vidéo
                </b-dropdown-item>
                <b-dropdown-divider></b-dropdown-divider>
                <b-dropdown-item href="/#/aide/presentation" class="text-menu">
                    <img class="logo-dropdown" src="../assets/video-play.png" />Découvrir Local&moi
                </b-dropdown-item>
            </b-dropdown>
            <b-dropdown variant="link" size="lg" right text="Right align" no-caret>
                <template slot="button-content">
                    <img class="logo-menu-header" src="../assets/user.png" title="Profil" />
                </template>
                <b-dropdown-item href="/#/profil" class="text-menu"
                                 v-if="'BackOffice' !== $route.name && 'BackOfficePartnershipFolder' !== $route.name && isUser">
                    <img class="logo-dropdown" src="../assets/voir-mon-compte-client.png" />Mon compte partenaire
                </b-dropdown-item>
                <b-dropdown-divider v-if="'BackOffice' !== $route.name && 'BackOfficePartnershipFolder' !== $route.name && isUser">
                </b-dropdown-divider>
                <b-dropdown-item href="/#/dossier-partenaire" class="text-menu" v-if="allowPartnerFolderAccess && isUser">
                    <img class="logo-dropdown" src="../assets/picto-contrat-partenaire.png" />Mon dossier partenaire
                </b-dropdown-item>
                <b-dropdown-divider v-if="allowPartnerFolderAccess && isUser">
                </b-dropdown-divider>
                <b-dropdown-item @click="logout({customerCode: currentPartner ? currentPartner.customerCode : undefined, identity: identity})" class="text-menu">
                    <img class="log-out" src="../assets/me-deconnecter.png" />Me déconnecter
                </b-dropdown-item>
            </b-dropdown>
        </b-col>
    </b-row>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { authDpHelper } from "../_helpers/auth-dp.helper";
import Navigation from '@/components//Navigation';

export default {
    app: 'DropDown',
    components: {
        Navigation
    },
    computed: {
        ...mapState('account', ['currentPartner', 'identity', 'status']),
        ...mapState('globalStore', ['salesforce', 'partner']),
        allowPartnerFolderAccess() {
            return 'BackOffice' !== this.$route.name
                && 'BackOfficePartnershipFolder' !== this.$route.name
                && this.currentPartner && this.currentPartner.hasPartnerFolder
                && this.salesforce.dpValidated.canEdit
        },
        allowBackOfficeAccess() {
            return this.identity
                && (
                    this.identity.allowedToEdit
                    || this.isSalesman
                    || this.isProvider
                    || this.isSuperAdmin
                )
                && 'BackOffice' !== this.$route.name
        },
        isUser() {
            return authDpHelper.isUser(this.identity);
        },
        isSalesman() {
            return authDpHelper.isSalesman(this.identity);
        },
        isProvider() {
            return authDpHelper.isProvider(this.identity);
        },
        isSuperAdmin() {
            return authDpHelper.isSuperAdmin(this.identity);
        },
        allowedToComeBackToDP() {
            return this.isSalesman || this.isSuperAdmin;
        },
        cmsUrl() {
            return this.identity &&
                this.isUser &&
                !this.identity.allowedToEdit &&
                'BackOfficePartnershipFolder' !== this.$route.name &&
                this.currentPartner &&
                this.currentPartner.source
                ? this.partner.url[this.currentPartner.source.toLowerCase()] : null;
        },
    },
    methods: {
        ...mapActions('account', [
            'logout', 'impersonateLogout'
        ]),
        reloadPage: function () {
            Navigation.methods.refreshPage();
        },
        backToPartnershipFolder() {
            this.$router.push(`/backoffice/dossier-partenaire/${this.currentPartner.customerCode}`);
        }
    }
};
</script>
