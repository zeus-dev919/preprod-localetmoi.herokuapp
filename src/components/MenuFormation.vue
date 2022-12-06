<template>
    <b-col class="hidden-for-mobile" lg="3" md="12" sm="12">
        <notifications group="connexion-failed" position="bottom right" class="notification-container" />
        <div role="tablist">
            <b-card no-body class="mb-1">
                <b-btn block href="#" v-b-toggle.accordion1 variant="info" class="menu-left-title" v-bind:class="{ 'current-section': current_section_1 }">Présence</b-btn>
                <b-collapse v-model="firstMenushowCollapse" id="accordion1" accordion="my-accordion" role="tabpanel">
                    <b-card-body>
                        <router-link to="/presence/site" class='card-text'>
                            Site
                        </router-link>
                        <hr v-if="status.isQrcodeEnabled">
                        <router-link to="/presence/qrcode" class='card-text' v-if="status.isQrcodeEnabled">
                            QR Code
                        </router-link>
                        <hr>
                        <div>
                            <a @click="getUberallAutologin({ page: 'profile' })" class="uberall-link" v-bind:class="{'uberall-link-available': partner.hasVisibility && !status.isVisibilityOfferBeforeUberall }">
                                Coordonnées de communication
                            </a>
                        </div>
                        <hr v-if="status.isLocalResto || status.isLocalHotel">
                        <div v-if="status.isLocalResto || status.isLocalHotel">
                            <a @click="getUberallAutologin({ page: 'inbox' })" class="uberall-link" v-bind:class="{'uberall-link-available': partner.hasVisibility && !status.isVisibilityOfferBeforeUberall }">
                                Avis clients
                            </a>
                        </div>
                        <hr v-if="status.isLocalResto || status.isLocalHotel">
                        <div v-if="status.isLocalResto || status.isLocalHotel">
                            <a @click="getUberallAutologin({ page: 'posting' })" class="uberall-link" v-bind:class="{'uberall-link-available': partner.hasVisibility && !status.isVisibilityOfferBeforeUberall }">
                                Publications
                            </a>
                        </div>
                    </b-card-body>
                </b-collapse>
            </b-card>
            <b-card no-body class="mb-1" v-if="!status.isEcommerce && !status.isLocalShop && !status.isPageLoading">
                <b-btn block v-b-toggle.accordion2 variant="info" class="menu-left-title" v-bind:class="{ 'current-section': current_section_2 }">Performance</b-btn>
                <b-collapse v-model="secondMenushowCollapse" id="accordion2" accordion="my-accordion" role="tabpanel">
                    <b-card-body>
                        <router-link to="/performance/audience" class='card-text'>
                            Statistiques de mon site web
                        </router-link>
                        <hr>
                        <router-link to="/performance/localBroadcast" class='card-text' v-if="uberall.listingsLength">
                            Diffusion locale
                        </router-link>
                        <div v-if="status.isWebtool">
                            <hr v-if="uberall.listingsLength">
                            <router-link to="/performance/messages" class='card-text'>
                                Messages
                            </router-link>
                            <hr>
                            <router-link to="/performance/newsletter" class='card-text'>
                                Newsletter
                            </router-link>
                        </div>
                    </b-card-body>
                </b-collapse>
            </b-card>
            <b-card no-body class="mb-1" v-if="status.isLocalShop && !status.isPageLoading">
                <b-btn block v-b-toggle.accordion2 variant="info" class="menu-left-title" v-bind:class="{ 'current-section': current_section_2 }">Performance</b-btn>
                <b-collapse v-model="secondMenushowCollapse" id="accordion2" accordion="my-accordion" role="tabpanel">
                    <b-card-body>
                        <hr v-if="uberall.listingsLength">
                        <router-link to="/performance/localBroadcast" class='card-text' v-if="uberall.listingsLength">
                            Diffusion locale
                        </router-link>
                        <div v-if="status.isWebtool">
                            <hr v-if="uberall.listingsLength">
                            <router-link to="/performance/messages" class='card-text'>
                                Messages
                            </router-link>
                            <hr>
                            <router-link to="/performance/newsletter" class='card-text'>
                                Newsletter
                            </router-link>
                        </div>
                    </b-card-body>
                </b-collapse>
            </b-card>
        </div>
    </b-col>
</template>

<script>
import { mapState, mapActions } from 'vuex';

require('../assets/style/accueil.css');

export default {
    app: 'MenuFormation',
    computed: {
        ...mapState('globalStore', ['partner', 'status', 'uberall'])
    },
    mounted: function () {
        this.read_current_menu();
    },
    data () {
        return {
            current_section_1: false,
            current_section_2: false,
            firstMenushowCollapse: false,
            secondMenushowCollapse: false
        };
    },
    methods: {
        ...mapActions('globalStore', ['getUberallAutologin']),
        read_current_menu: function () {
            if (this.$route.path.includes('presence')) {
                this.firstMenushowCollapse = true;
                this.current_section_1 = true;
            }
            if (this.$route.path.includes('performance')) {
                this.secondMenushowCollapse = true;
                this.current_section_2 = true;
            }
        }
    }
};
</script>
