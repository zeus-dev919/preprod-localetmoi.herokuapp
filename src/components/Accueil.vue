<template>
    <div class="accueil" id="full-page">
        <app-headergeneral />
        <b-container fluid class="ref-section d-lg-flex d-md-flex">
            <div class="ml-lg-auto ml-md-auto d-lg-flex d-md-flex">
                <div class="match-select-padding"><b>Référence de votre dossier :</b></div>
                <div class="ml-lg-2 ml-md-2 min-w-250" v-if="currentPartner">
                    <b-select
                        :value="currentPartner.customerCode"
                        @change="onPartnerChange($event)">
                        <option v-for="option in partnerOptions" :key="option.key" :value="option.value">
                            {{ option.label }}
                        </option>
                    </b-select>
                </div>
                <div class="ml-lg-2 ml-md-2 min-w-250" v-if="!currentPartner">
                    <b-select value="none">
                        <option value="none" disabled>Aucun dossier trouvé</option>
                    </b-select>
                </div>
            </div>
        </b-container>
        <b-container fluid class="ref-section d-lg-flex d-md-flex">
            <div class="ml-lg-auto ml-md-auto d-lg-flex d-md-flex">
                <div><b>Site :</b></div>
                <div class="ml-lg-2 ml-md-2 min-w-250">
                    <a v-if="null !== websiteLink && !status.isPageLoading" v-bind:href="websiteLink" target="_blank">
                        www.{{ websiteLink.replace(/https?:\/\//, '').replace('/', '') }}
                    </a>
                    <a v-if="null === websiteLink">
                        Aucun site
                    </a>
                </div>
            </div>
        </b-container>
        <v-tour name="myTour" :steps="steps" class="hidden-for-mobile">
            <template v-if="currentPartner && true === currentPartner.showTutorial" slot-scope="tour">
                <transition name="fade">
                    <v-step v-if="tour.currentStep === index" v-for="(step, index) of tour.steps" :key="index" :step="step" :previous-step="tour.previousStep" :next-step="tour.nextStep" :stop="tour.stop" :is-first="tour.isFirst" :is-last="tour.isLast" :labels="tour.labels">
                        <template>
                            <div slot="actions">
                                <button v-if="tour.currentStep !== 0" @click="tour.previousStep" class="step-button">Précédent</button>
                                <button v-if="tour.currentStep !== 7" @click="tour.nextStep" class="step-button">Suivant</button>
                                <button @click="tour.stop(); onFinishTour()" class="step-button">Finir le tour</button>
                            </div>
                        </template>
                    </v-step>
                </transition>
            </template>
        </v-tour>
        <b-container fluid class="custom-container">
            <b-row>
                <b-row v-if="status.isPageLoading" class="hidden-for-mobile grey-fade"></b-row>
                <fade-loader v-if="status.isPageLoading" :color="color" class="loader-accueil"></fade-loader>
                <div id="v-step-1"></div>
                <b-col :lg="status.isNewLocalBoutique || status.isLocalRestoBoutique || status.isLocalRestoWebtool ? 3 : 4"
                       md="6" sm="6"
                       class="text-center pad-right" v-bind:class="{'unavailable': status.websiteInfoDisabled }">
                    <router-link class="link-menu" to="/presence/site">
                        <img class="img-big" src="../assets/infos-site.jpg">
                        <div class="title-img-section pink">
                            <p class="title-img">J'accède à toutes les informations relatives à mon site internet</p>
                        </div>
                    </router-link>
                </b-col>
                <b-col :lg="status.isNewLocalBoutique || status.isLocalRestoBoutique || status.isLocalRestoWebtool ? 3 : 4"
                       md="6" sm="6"
                       class="text-center pad-right hidden-for-mobile-only" :class="{'unavailable': status.updateWebsiteDisabled || (status.isWebtool && !isPublished) }">
                    <b-link class="link-menu" :href="cmsUrl" target="_blank" :disabled="status.isWebtool && !isPublished">
                        <img class="img-big" src="../assets/maj-site.jpg" />
                        <img v-if="status.isWebtool && !isPublished" class="img-under-construction" src="../assets/under-construction.svg" />
                        <div class="title-img-section yellow">
                            <p class="title-img off-line" v-if="status.isWebtool && !isPublished">
                                Ce site est en cours de réalisation
                            </p>
                            <p class="title-img on-line" v-else-if="!currentPartner || !cmsSource">Je mets à jour mon site</p>
                            <p class="title-img on-line" v-else>
                                <span v-if="status.isLocalResto && !status.isLocalRestoWebtool">
                                    Je modifie mon site web
                                </span>
                                <span v-else>
                                    Je mets à jour mon site
                                </span>
                            </p>
                        </div>
                    </b-link>
                </b-col>
                <b-col v-if="status.isLocalRestoWebtool && !status.isLocalRestoBoutique"
                       lg="3"
                       md="6" sm="6"
                       class="text-center pad-right hidden-for-mobile-only" :class="{'unavailable': !partner.url.toolbox }">
                    <b-link class="link-menu" :href="partner.url.toolbox" target="_blank" :disabled="!partner.url.toolbox">
                        <img class="img-big" src="../assets/acces-rdv.jpg" />
                        <div class="title-img-section yellow">
                            <p class="title-img on-line">J'accède à mon module de réservation</p>
                        </div>
                    </b-link>
                </b-col>
                <b-col v-if="status.isNewLocalBoutique || status.isLocalRestoBoutique"
                       lg="3"
                       md="6" sm="6"
                       :class="{
                            'unavailable': !partner.boutiqueUrl
                       }"
                       class="text-center pad-right hidden-for-mobile-only"
                       target="_blank"
                >
                    <b-link class="link-menu" :href="partner.boutiqueUrl" target="_blank">
                        <img class="img-big" src="../assets/acces-rdv.jpg" />
                        <div class="title-img-section yellow">
                            <p class="title-img on-line" v-if="currentPartner">Je mets à jour ma boutique</p>
                        </div>
                    </b-link>
                </b-col>
                <b-col v-if="!status.isLocalRestoBoutique"
                       :lg="status.isNewLocalBoutique || status.isLocalRestoWebtool ? 3 : 4"
                       md="6" sm="6"
                       class="text-center pad-right"
                       :class="{'unavailable': status.websiteInfoDisabled }">
                    <router-link class="link-menu" to="presence/campagne">
                        <img class="img-big" src="../assets/google-infos.jpg" />
                        <div class="title-img-section black">
                            <p class="title-img">Je retrouve tous mes rapports de campagne Google Ads</p>
                        </div>
                    </router-link>
                </b-col>
                <b-col v-else
                       lg="3"
                       md="6" sm="6"
                       class="text-center pad-right"
                       :class="{'unavailable': status.websiteInfoDisabled }"
                >
                    <b-link
                        :class="{
                            'unavailable': !status.isLocalRestoBoutique || !partner.toolBoxUrl
                        }"
                        :href="partner.toolBoxUrl"
                        target="_blank"
                        class="link-menu"
                    >
                        <img class="img-big" src="../assets/autologin-resa-table.jpg"/>
                        <div class="title-img-section yellow">
                            <p class="title-img one-line">J'accède à mon module de réservation</p>
                        </div>
                    </b-link>
                </b-col>
            </b-row>
            <b-row v-if="!status.isPageLoading" class="justify-center">
                <div id="v-step-0"></div>
                <b-col v-if="!status.isLocalShop" :lg="status.isLocalRestoBoutique ? 3 : 4" md="4" sm="6" class="text-center pad-right" :class="{'unavailable': status.isEcommerce }">
                    <router-link class="link-menu" to="performance/audience">
                        <img class="img-by-3" src="../assets/performance-outil.jpg" />
                        <div class="title-img-section-big pink">
                            <p class="title-img on-line">J'accède aux performances de mon site</p>
                        </div>
                    </router-link>
                </b-col>
                <b-col v-if="status.isLocalRestoBoutique" :lg="status.isLocalRestoBoutique ? 3 : 4" md="6" sm="6" class="text-center pad-right" v-bind:class="{'unavailable': status.websiteInfoDisabled }">
                    <router-link class="link-menu" to="presence/campagne">
                        <img style="height: 80%" class="img-by-3" src="../assets/google-infos-croped.jpg" />
                        <div class="title-img-section-big black">
                            <p class="title-img">Je retrouve tous mes rapports de campagne Google Ads</p>
                        </div>
                    </router-link>
                </b-col>
                <b-col :lg="status.isLocalRestoBoutique ? 3 : 4" md="4" sm="6" class="text-center pad-right" :class="{'unavailable': notAvailable_5 }">
                    <b-link class="link-menu" href="/#/demandes">
                        <img class="img-by-3" src="../assets/acces-demandes.jpg" />
                        <div class="title-img-section-big pink">
                            <p class="title-img">J'accède à mes demandes en attente, en cours, ou terminées</p>
                        </div>
                    </b-link>
                </b-col>
                <b-col :lg="status.isLocalRestoBoutique ? 3 : 4" md="4" sm="6" class="text-center pad-right" :class="{'unavailable': status.websiteInfoDisabled }">
                    <router-link class="link-menu" to="/documents">
                        <img class="img-by-3" src="../assets/stockage-doc.jpg" />
                        <div class="title-img-section-big black">
                            <p class="title-img">Je retrouve tous mes documents&nbsp;: contrats, avenants, RIB, échéanciers</p>
                        </div>
                    </router-link>
                </b-col>
            </b-row>
        </b-container>
        <app-footer></app-footer>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import router from '@/router';
import FadeLoader from 'vue-spinner/src/FadeLoader.vue';
import { authDpHelper } from "@/_helpers";
import cookieMixin from '../mixins/cookie-mixin';

require('vue-tour/dist/vue-tour.css');

export default {
    name: 'Accueil',
    mixins: [cookieMixin],
    components: {
        FadeLoader
    },
    computed: {
        ...mapState('account', ['identity', 'currentPartner']),
        ...mapState('globalStore', ['status', 'partner', 'websiteLink', 'websitePublicationDate']),
        partnerOptions() {
            return this.identity.partners.reduce(this.partnersReducer, []);
        },
        partners() {
            return this.identity.partners.reduce(this.partnersReducerObjectMap, {});
        },
        isPublished() {
            return null !== this.websitePublicationDate;
        },
        cmsSource() {
            return this.currentPartner.source ?
                `${this.currentPartner.source[0].toUpperCase()}${this.currentPartner.source.substr(1).toLowerCase()}`
                : null;
        },
        cmsUrl() {
            return (!this.status.isWebtool || this.isPublished) &&
                this.currentPartner &&
                this.currentPartner.source
                ? this.partner.url[this.currentPartner.source] : null;
        }
    },
    mounted: function () {
        if (authDpHelper.isProvider(this.identity)) {
            router.push('/backoffice');
        }
        this.startTour();
    },
    data () {
        return {
            steps: [
                {
                    target: '#v-step-0',
                    content: '<p class="title-tour">Bienvenue dans votre espace partenaire <strong>Local&moi</strong> !</p><p>Votre espace vous permet d\'avoir accès à toutes les informations sur votre partenariat en temps réel.</p>',
                    params: {
                        placement: 'top'
                    }
                },
                {
                    target: '#v-step-1',
                    content: 'Découvrez les différentes rubriques auxquelles vous avez accès depuis ce menu d\'accueil.',
                    params: {
                        placement: 'left'
                    }
                },
                {
                    target: '#v-step-3',
                    content: 'Pour toutes demandes relatives à votre partenariat, contactez-nous !',
                    params: {
                        placement: 'left'
                    }
                },
                {
                    target: '#v-step-4',
                    content: 'Accédez facilement aux différentes rubriques à tout moment.'
                },
                {
                    target: '#v-step-4',
                    content: 'Mettez à jour votre site internet avec Webtool.'
                },
                {
                    target: '#v-step-4',
                    content: 'Créez et assurez le suivi de vos demandes.'
                },
                {
                    target: '#v-step-4',
                    content: 'Accédez à votre compte partenaire.'
                },
                {
                    target: '#footer',
                    content: 'Retrouvez-nous sur les réseaux sociaux !',
                    params: {
                        placement: 'bottom'
                    }
                }
            ],
            notAvailable_4: true,
            notAvailable_5: false,
            color: '#ec008c'
        };
    },
    methods: {
        ...mapActions('account', ['updatePartnerPropertyFromForm']),
        ...mapActions('globalStore', ['resetState', 'loadSalesforceData']),
        startTour() {
            (new Promise(resolve => {
                let interval = setInterval(() => {
                    if (!this.currentPartner) {
                        return;
                    }
                    window.clearInterval(interval);
                    resolve(this.currentPartner);
                }, 50);
            })).then(() => {
                if (this.currentPartner && this.currentPartner.showTutorial && !this.status.impersonated) {
                    this.$tours['myTour'].start();
                }
            });
        },
        onFinishTour() {
            this.currentPartner.showTutorial = false;
            this.identity.partners.forEach(partner => {
                if (partner.id === this.currentPartner.id) {
                    partner.showTutorial = this.currentPartner.showTutorial;
                }
            })
            this.updatePartnerPropertyFromForm({
                data: {
                    partner: this.currentPartner,
                    payload: {
                        showTutorial: this.currentPartner.showTutorial,
                    },
                },
                skipPartnerHistory: true
            });
        },
        partnersReducer(accumulator, currentValue) {
            accumulator.push({
                key: `partner__select__option_${currentValue.customerCode}`,
                value: currentValue.customerCode,
                label: `${currentValue.customerCode} / ${currentValue.fullname}`,
                selected: currentValue.customerCode === this.currentPartner.customerCode
            });
            return accumulator;
        },
        partnersReducerObjectMap(accumulator, currentValue) {
            accumulator[currentValue.customerCode] = currentValue;
            return accumulator;
        },
        onPartnerChange(customerCode) {
            this.resetState();
            this.loadSalesforceData({
                identity: this.identity,
                currentPartner: this.partners[customerCode],
                loadDocuments: false
            });
        }
    }
};

</script>
