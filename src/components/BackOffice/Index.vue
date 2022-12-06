<template>
    <div class="accueil" id="full-page">
        <b-row align-h="around" class="marge-header back-office_header">
            <b-col sm="12" md="12" lg="4" class="text-left pl-5 margin-mobile">
                <div>
                    <router-link to="/backoffice">
                        <img class="image-log" src="../../assets/logo-local-et-moi.jpg" />
                    </router-link>
                </div>
                <div class="welcome-message">Bienvenue dans le Back-office de local&moi !</div>
            </b-col>
            <b-col align-self="end" sm="12" md="12" lg="4" class="text-center back-office_search margin-mobile" >
                <b-form-input
                    id="searchPartner"
                    :value="$route.query.customerCode"
                    type="search"
                    name="partner"
                    placeholder="Rechercher un partenaire (code sage)"
                    v-model="customerCode"
                    @input="getPartner"
                />
            </b-col>
            <b-col sm="12" md="12" lg="4" class="text-right pr-5 margin-mobile back-office_dropdown">
                <app-dropdownmenu class="inline-menu" id="v-step-4" :websiteLink='websiteLink'></app-dropdownmenu>
            </b-col>
        </b-row>
        <b-container fluid class="ref-section d-lg-flex d-md-flex back-office_files-infos">
            <div class="ml-lg-auto ml-md-auto d-lg-flex-column d-md-flex-column back-office_files">
                <div v-if="currentPartner && currentPartner.customerCode">
                    <b>Référence du dossier :</b>
                    {{ currentPartner && currentPartner.customerCode ? currentPartner.customerCode : 'Non renseigné' }}
                </div>
                <div><b>Utilisateur :</b>
                    {{ identity.email ? identity.email : 'Non renseigné' }}
                </div>
    
                <div v-if="currentPartner && currentPartner.customerCode">
                    <b>Site :</b>
                    <a v-if="null !== websiteLink && !status.isPageLoading" v-bind:href="websiteLink" target="_blank" style="color: #EC008C !important;">
                        www.{{ websiteLink.replace(/https?:\/\//, '').replace('/', '') }}
                    </a>
                    <a v-if="null === websiteLink">
                        Aucun site
                    </a>
                </div>
            </div>
        </b-container>
        <fade-loader v-if="loading" color="#ec008c" class="loader-accueil"></fade-loader>
        <b-container fluid class="back-office" v-if="!loading">
            <b-row class="justify-content-center">
                <b-col sm="12" md="3" lg="3" v-if="currentPartner && !isProvider">
                    <b-row v-for="user in currentPartner.users" :key="user.id" class="back-office_box mb-3">
                        <router-link :to="'/impersonate/' + user.email">
                            <b-col align-v="center" class="text-center back-office_impersonate">
                                <span>Se connecter à local&moi en tant que {{ user.name || user.email }} </span>
                            </b-col>
                        </router-link>
                    </b-row>
                </b-col>
                <b-col m="12" md="3" lg="3" v-if="currentPartner && currentPartner.hasPartnerFolder">
                    <b-row class="back-office_box">
                        <router-link :to="'/backoffice/dossier-partenaire/' + currentPartner.customerCode">
                            <b-col align-v="center" class="text-center back-office_partnership-folder">
                                <span>Accéder au Dossier partenaire de {{ currentPartner.fullname }}</span>
                            </b-col>
                        </router-link>
                    </b-row>
                </b-col>
                <b-col m="12" md="3" lg="3" v-if="(currentPartner && !currentPartner.hasPartnerFolder)">
                    <b-row class="back-office_box">
                        <b-col align-v="center" class="text-center back-office_partnership-folder disabled">
                            <span>{{ currentPartner.fullname }} n'a pas de dossier partenaire</span>
                        </b-col>
                    </b-row>
                </b-col>
            </b-row>
            <b-row v-if="!currentPartner && customerCode" class="justify-content-center">
                <b-col class="text-center">
                    <span>Aucun partenaire n'a été trouvé</span>
                </b-col>
            </b-row>
        </b-container>
        <app-footer id="footer" class="footer-accueil"></app-footer>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { localfrApiService } from '@/_services';
import FadeLoader from 'vue-spinner/src/FadeLoader.vue';
import { authDpHelper } from "@/_helpers";
import cookieMixin from "../../mixins/cookie-mixin";

require('../../assets/style/back-office.css');

export default {
    name: 'BackOfficeIndex',
    mixins: [cookieMixin],
    components: {
        FadeLoader
    },
    computed: {
        ...mapState('account', ['status', 'identity', 'currentPartner']),
        ...mapState('globalStore', ['websiteLink']),
        isProvider() {
            return authDpHelper.isProvider(this.identity);
        },
    },
    mounted () {
        let promise = this.currentPartner
            ? this.impersonateLogout()
            : Promise.resolve();

        promise.then(() => {
            if (this.$route.query.customerCode) {
                document.querySelector('input#searchPartner').value = this.$route.query.customerCode;
            }

            this.$nextTick(() => {
                if (this.$route.query.customerCode) {
                    this.customerCode = this.$route.query.customerCode;
                } else if (this.currentPartner) {
                    this.customerCode = this.currentPartner.customerCode;
                }
                this.getPartner();
            });
        });
    },
    data () {
        return {
            color: '#ec008c',
            loading: false,
            customerCode: ''
        };
    },
    methods: {
        ...mapActions('account', ['setCurrentPartner', 'impersonateLogout']),
        ...mapActions('globalStore', [
            'getSalesforceAccount',
            'getSalesforceContact',
            'getSalesforceOpportunities',
            'toggleIsWebtool',
            'resetState',
            'setWebsiteLink'
        ]),
        getPartner: function () {
            if (!this.customerCode || !parseInt(this.customerCode) || this.customerCode < 1000) {
                this.resetCurrentPartner();
                return null;
            }
            const customerCode = parseInt(this.customerCode);

            this.loading = true;
            setTimeout(() => {
                localfrApiService.getPartner(customerCode).then(
                    partners => {
                        let partner = partners['hydra:member'][0];
                        if (!partner) {
                            this.resetCurrentPartner();
                            return;
                        }
                        if (partner.customerCode !== customerCode) {
                            this.loading = false;
                            return;
                        }
                        let accountId = partner.company;
                        this.setCurrentPartner({ currentPartner: partner });
                        this.toggleIsWebtool(/^webtool$/i.test(partner.source));
                        return Promise.all([
                            this.getSalesforceAccount({ accountId }),
                            this.getSalesforceContact({ accountId }),
                            this.getSalesforceOpportunities({ accountId }),
                        ]).then(() => this.loading = false);
                    },
                    (error) => {
                        this.resetCurrentPartner();
                        console.error(error);
                    }
                );
            }, 500);
        },
        resetCurrentPartner() {
            this.setCurrentPartner({ currentPartner: null });
            this.resetState();
            this.loading = false;
        }
    }
};

</script>
