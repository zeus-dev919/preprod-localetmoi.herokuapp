<template>
    <b-container fluid class="bc-example-row">
        <vue-progress-bar id="timeline-progress-bar" v-if="isTimeLineProgressBarActive"/>
        <b-row v-if="accountStatus.impersonated && identity">
            <b-col cols="12">
                <div class="alert alert-danger text-center">
                    Connecté en tant que : {{ identity.name }} ({{ identity.email }}) / {{ currentPartner.fullname }} <a href="#/accueil" @click="onImpersonateLogoutClick"> Déconnecter </a>
                </div>
            </b-col>
        </b-row>
        <b-row v-if="isAccessPfModalInformation && isAccessPfModalInformation.show"
               class="access-pf-header mb-5"
               :class="{'fuchsia': displayRequestAccess}"
        >
            <b-col v-if="isRequestForAccessIsActive" md="3">
                <div class="back-to-edit d-flex" style="background: white; color: black; cursor: unset">
                    <img alt="" src="../assets/clock-icon.svg"/>
                    En attente de la réponse, {{ time }} secondes restantes
                </div>
            </b-col>
            <b-col v-if="isStartTimerForWaiting" md="4">
                <div class="back-to-edit d-flex" style="background: white; color: black; cursor: unset">
                    <img alt="" src="../assets/clock-icon.svg"/>
                    L'utilisateur termine de modifier le DP, {{ time }} sec. restantes
                </div>
            </b-col>
            <b-col v-if="displayRequestAccess && !isRequestForAccessIsActive && !isStartTimer && !isStartTimerForWaiting" md="3">
                <div class="back-to-edit d-flex" @click="onRequestAccessToPf()">
                    <img alt="" src="../assets/pen.svg"/>
                    <div>
                      <span>Cliquez pour demander l'accès à la modification</span>
                    </div>
                </div>
            </b-col>
            <b-col v-if="isStartTimer" md="3">
                <div class="back-to-edit d-flex" style="background: white; color: black; cursor: unset" :class="redText ? 'red-text' : ''">
                    <img alt="" :class="redText ? 'red-icon' : ''" src="../assets/clock-icon.svg"/>
                    {{ timerValue }} secondes restantes pour terminer votre action
                </div>
            </b-col>
            <b-col v-if="isStartTimerForWaiting" :md="displayRequestAccess ? 6 : 12">
                <div class="text-center white-text">
                    {{ isAccessPfModalInformation.message }} {{ time }} secondes
                </div>
            </b-col>
            <b-col v-else :md="displayRequestAccess || isStartTimer ? 7 : 12">
                <div class="text-center white-text">
                    {{ isAccessPfModalInformation.message }}
                </div>
            </b-col>
        </b-row>
        <b-row class="marge-header" :class="{'startAccess': isAccessPfModalInformation && isAccessPfModalInformation.message}">
            <b-col :lg="(displayDropElements || isBackOfficePartnershipFolderRoute) ? 4 : 6" md="6">
                <div>
                    <router-link :to="(identity && identity.allowedToEdit) || !isUser ? '/backoffice' : '/accueil'">
                        <img class="image-log" src="../assets/logo-local-et-moi.jpg" />
                    </router-link>
                </div>
                <div class="welcome-message">Bienvenue dans votre espace partenaire local&moi !</div>
            </b-col>
            <DropButtonLink v-if="displayDropElements"/>
            <Timeline v-if="isBackOfficePartnershipFolderRoute && !status.isPageLoading"/>
            <b-col class="text-right" :lg="(displayDropElements || isBackOfficePartnershipFolderRoute) ? 4 : 6">
                <a href="tel:+33420101080" v-if="'BackOffice' !== $route.name && 'BackOfficePartnershipFolder' !== $route.name && isUser">
                    <img class="logo-phone" src="../assets/phone.png">
                    <div class="phone-number">04 20 10 10 80</div>
                </a>
                <app-dropdownmenu class="inline-menu" id="v-step-4" :websiteLink='websiteLink'></app-dropdownmenu>
            </b-col>
        </b-row>
        <notifications group="auth-error" position="bottom right" class="notification-container" />
        <notifications group="general-error" position="bottom right" class="notification-container" />
    </b-container>
</template>

<script>
import router from '@/router';
import { mapState, mapActions, mapMutations } from 'vuex';
import DropButtonLink from './DropButtonLink';
import Timeline from './PartnershipFolder/Timeline/Timeline';
import { authDpHelper } from '../_helpers';
import { store } from '@/_store';
import partnerMixin from '../mixins/partner-mixin';
import moment from "moment";
import { socketService } from '@/_services';

export default {
    name: 'HeaderGeneral',
    mixins: [partnerMixin],
    components: {
        DropButtonLink,
        Timeline
    },
    computed: {
        ...mapState('account', {
            identity: state => state.identity,
            accountStatus: state => state.status,
            currentPartner: state => state.currentPartner,
            isAccessPfModalInformation: state => state.accessPfModalInformation,
            isCurrentMainUserOnPf: state => state.isCurrentMainUserOnPf
        }),
        ...mapState('globalStore', {
            offers: state => state.offers,
            partner: state => state.partner,
            salesforce: state => state.salesforce,
            websiteLink: state => state.websiteLink,
            isRequestForAccessIsActive: state => state.status.isRequestForAccessIsActive,
            isStartTimer: state => state.status.isStartTimer,
            isStartTimerForWaiting: state => state.status.isStartTimerForWaiting,
        }),
        displayDropElements() {
            return -1 !== ['Accueil', 'Root'].indexOf(this.$route.name) &&
                undefined !== this.isHeaderInitializing &&
                !this.status.isPageLoading &&
                this.status.hasSharedSpaceAccess &&
                !!this.currentPartner;
        },
        displayRequestAccess() {
            return !!this.currentPartner &&
                !this.isUser &&
                !this.isCurrentMainUserOnPf &&
                this.isBackOfficePartnershipFolderRoute;
        },
        isUser() {
            return authDpHelper.isUser(this.identity);
        },
        isBackOfficePartnershipFolderRoute() {
            return 'BackOfficePartnershipFolder' === this.$route.name;
        }
    },
    data() {
        return {
            isHeaderInitializing: false,
            isTimeLineProgressBarActive: false,
            time: 30,
            timerValue: 30,
            redText: false
        };
    },

    async mounted() {
        await this.initialize();
    },
    methods: {
        ...mapActions('globalStore', [
            'loadSalesforceData',
            'setIsRequestForAccessIsActive',
            'setIsStartTimerForWaiting',
            'setStartTimer',
        ]),
        ...mapActions('account', [
            'impersonateLogout',
        ]),
        ...mapMutations('globalStore', [
            'toggleIsPageLoading',
            'toggleUpdateWebsiteDisabled'
        ]),

        formatDate(date) {
            return moment(date).format('DD/MM/YYYY à HH:mm');
        },
        onImpersonateLogoutClick() {
            this.impersonateLogout().then(() => {
                router.push('/backoffice');
            });
        },
        async initialize() {
            if (this.isHeaderInitializing) {
                return new Promise(resolve => {
                    if (!this.isHeaderInitializing) {
                        resolve();
                    }
                });
            }

            if (this.offers.length > 0) {
                this.isHeaderInitializing = false;
                return Promise.resolve();
            }

            if (!this.isHeaderInitializing) {
                this.isHeaderInitializing = true;
            }

            // User without partner (i.e: internal user)
            if (!this.currentPartner) {
                console.info('No current partner found, this is normal for internal users.');
            }

            const args = {
                identity: this.identity,
                currentPartner: this.currentPartner,
                loadDocuments: false
            };
            if ('/documents' === this.$route.path) {
                args.loadDocuments = true;
            }
            await this.loadSalesforceData(args);

            this.isHeaderInitializing = false;

            return Promise.resolve();
        },
        backToEditPf() {
            this.isTimeLineProgressBarActive = true;
            this.$Progress.start();
            this.loadPartner(this.$route.params.customerCode)
                .then(() =>
                    store.dispatch('alert/warn', {
                        group: 'general-error',
                        type: 'warn',
                        message: "Dans ce mode, vous pouvez modifier le dossier partenaire, sauf si l'étape suivante du DP a déjà été validée.",
                        show: true,
                        title: 'Vous êtes en mode édition'
                    }, { root: true })
                )
                .finally(() => {
                    this.$Progress.finish();
                    this.isTimeLineProgressBarActive = false;
                });
        },
        onRequestAccessToPf() {
            socketService.askAccess(this.customerCode, this.identity);
        },
    },
    watch: {
        isRequestForAccessIsActive() {
            if (this.isRequestForAccessIsActive) {
                window.myRequestInterval = setInterval(() => {
                    this.time--;
                    if (this.time <= 0 || this.isCurrentMainUserOnPf) {
                        this.setIsRequestForAccessIsActive(false);
                        window.myRequestInterval && clearInterval(window.myRequestInterval);
                        this.time = 30;
                    }
                }, 1000);
            } else {
                if (window.myRequestInterval) {
                    window.myRequestInterval && clearInterval(window.myRequestInterval);
                    this.time = 30;
                }
            }
        },
        isStartTimerForWaiting() {
            if (this.isStartTimerForWaiting) {
                window.myRequestInterval = setInterval(() => {
                    this.time--;
                    if (this.time <= 0 || this.isCurrentMainUserOnPf) {
                        this.setIsStartTimerForWaiting(false);
                        window.myRequestInterval && clearInterval(window.myRequestInterval);
                        this.time = 30;
                    }
                }, 1000);
            } else {
                if (window.myRequestInterval) {
                    window.myRequestInterval && clearInterval(window.myRequestInterval);
                    this.time = 30;
                }
            }
        },
        isStartTimer() {
            if (this.isStartTimer) {
                window.myTimerInterval = setInterval(() => {
                    this.timerValue--;
                    if (!this.timerValue) {
                        window.myTimerInterval && clearInterval(window.myTimerInterval);
                        this.setStartTimer(false);
                        this.redText = false;
                        this.timerValue = 30;
                    }
                    if (15 >= this.timerValue) {
                        this.redText = true;
                    }
                }, 1000);
            }
            if (!this.isStartTimer) {
                window.myTimerInterval && clearInterval(window.myTimerInterval);
                window.myRequestInterval && clearInterval(window.myRequestInterval);
                this.time = 30;
                this.timerValue = 30;
            }
        }
    }
};
</script>
