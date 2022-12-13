<template>
    <div class="messages">
        <app-headerbuttons></app-headerbuttons>
        <b-container fluid class="mb-3">
            <notifications group="no-ticket" position="bottom right" class="notification-container" />
            <b-row>
                <app-menuformation class='hidden-for-mobile margin-menu'></app-menuformation>
                <app-menumobile class="menu-mobile"></app-menumobile>
                <b-col lg="9" class="presentation-container" v-if="!isPartnerInformationLoading">
                    <hr>
                    <b-col class="video">
                        <b-row v-if="status.isLocalBoutique && (!status.isLocalAgenda || status.isLocalAgenda)">
                            <b-col sm="12">
                                <b-row>
                                    <h1 class="video-title">Formation - LocalBoutique</h1>
                                    <iframe width="100%" height="470px" :src="localBoutiqueTrainingURL" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                                </b-row>
                                <b-row class="mt-5">
                                    <h1 class="video-title">Formation - WEBTOOL</h1>
                                    <iframe width="100%" height="470px" :src="defaultTrainingURL" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                                </b-row>
                            </b-col>
                        </b-row>
                        <b-row v-else-if="status.isLocalShop || status.isLocalShopWithMigration">
                            <b-col sm="12">
                                <b-row>
                                    <h1 class="video-title">Formation - E-Commerce session 1</h1>
                                    <iframe :src="localShopTrainingURL" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen frameborder="0"  height="470px" width="100%"></iframe>
                                </b-row>
                                <b-row class="mt-5 mb-5">
                                    <h1 class="video-title">Formation - E-Commerce session 2</h1>
                                    <iframe width="100%" height="470px" :src="localShopExpressTrainingURL" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                                </b-row>
                            </b-col>
                        </b-row>
                        <b-row v-else>
                            <b-col sm="12">
                                <h1 class="video-title">Formation - WEBTOOL</h1>
                                <iframe width="100%" height="470px" :src="defaultTrainingURL" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                            </b-col>
                        </b-row>
                    </b-col>
                    <div class="video-access" v-if="showTutorialButton">
                        <a target="_blank" href="https://www.etre-visible.local.fr/naviguez-dans-l-espace-partenaire-local-et-moi">
                            <div class="more-video-link">
                                <strong>Accéder aux vidéos tutos</strong>
                            </div>
                        </a>
                    </div>
                </b-col>
                <fade-loader v-else color="#ec008c" class="loader-accueil"></fade-loader>
            </b-row>
        </b-container>
        <app-footer></app-footer>
    </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import FadeLoader from 'vue-spinner/src/FadeLoader.vue';

require('../assets/style/presentation.css');

export default {
    name: 'Tutorial',
    components: {
        FadeLoader
    },
    data() {
        return {
            localBoutiqueTrainingURL: process.env.LOCALBOUTIQUE_TRAINING_VIDEO_LINK,
            localBoutiqueAgendaTrainingURL: process.env.LOCALBOUTIQUE_AGENDA_TRAINING_VIDEO_LINK,
            defaultTrainingURL: process.env.VITE_DEFAULT_TRAINING_VIDEO_LINK,
            localShopExpressTrainingURL: process.env.LOCALSHOP_EXPRESS_TRAINING_VIDEO_LINK,
            localShopTrainingURL: process.env.LOCALSHOP_TRAINING_VIDEO_LINK,
            isPartnerInformationLoading: true,
        };
    },
    computed: {
        ...mapState('globalStore', ['salesforce', 'status']),
        ...mapState('account', ['identity']),
        showTutorialButton() {
            return this.status && !this.status.isLocalShop && !this.status.isLocalShopWithMigration;
        }
    },
    methods: {
        ...mapActions('globalStore', ['loadSalesforceData']),
    },
    mounted() {
        if (this.salesforce && this.salesforce.opportunities) {
            this.isPartnerInformationLoading = false;
            return;
        }

        this.loadSalesforceData({
            identity: this.identity,
            currentPartner: this.identity && this.identity.partners && this.identity.partners.length ? this.identity.partners[0] : null
        }).finally(() => this.isPartnerInformationLoading = false);
    }
};
</script>
