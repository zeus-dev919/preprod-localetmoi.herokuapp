import {authDpHelper, normalizer} from "../_helpers";
import { mapActions, mapState } from "vuex";

export default {
    computed: {
        ...mapState('account', ['currentPartner', 'identity']),
        ...mapState('globalStore', ['status', 'salesforce', 'websiteLink']),
        customerCode() {
            return this.currentPartner && this.currentPartner.customerCode
                ? this.currentPartner.customerCode
                : null;
        },
        userEmail() {
            return this.identity && this.identity.email
                ? this.identity.email
                : null;
        }
    },
    data() {
        return {
            displayPartnerFolder: false,
            isPageLoading: true,
        };
    },
    mounted() {
        this.$nextTick(() => {
            let customerCode = this.$route.params.customerCode ||
                (this.currentPartner && this.currentPartner.customerCode) ||
                (this.identity && this.identity.partners && this.identity.partners[0] && this.identity.partners[0].customerCode)
            ;
            this.loadPartner(customerCode);
        });
    },
    methods: {
        ...mapActions('account', ['setCurrentPartner', 'setCurrentPartnerSnap']),
        ...mapActions('globalStore', [
            'getSalesforceAccount',
            'getSalesforceContact',
            'getSalesforceOpportunities',
            'toggleIsWebtool',
            'resetState',
            'getPartner'
        ]),
        loadPartner(customerCode) {
            if (!customerCode || !parseInt(customerCode)) {
                this.onFailure();
                return;
            }
            this.isPageLoading = true;
            if (authDpHelper.isUser(this.identity)) {
                this.isPageLoading = false;
                return;
            }

            return this.getPartner(customerCode).then(
                partners => {
                    if (partners['hydra:member'] && partners['hydra:member'].length) {
                        let partner = partners['hydra:member'][0];
                        let accountId = partner.company;
                        this.toggleIsWebtool('webtool' === partner.source);
                        return Promise.all([
                            this.setCurrentPartner({ currentPartner: partner }),
                            this.getSalesforceAccount({ accountId }),
                            this.getSalesforceContact({ accountId }),
                            this.getSalesforceOpportunities({ accountId }),
                        ]).then(() => this.setCurrentPartnerSnap({
                            currentPartner: partner,
                            salesforce: this.salesforce
                        })).then(() => {
                            this.identity.allowedToEdit =
                                authDpHelper.hasRoleToEditPartnerFolder(this.identity) &&
                                this.salesforce.dpValidated.canEdit &&
                                (!!authDpHelper.canTransmitPf() || authDpHelper.canByPassRolesToUpdatePf())
                            ;
                            this.displayPartnerFolder = this.currentPartner
                                && this.currentPartner.hasPartnerFolder;
                            this.isPageLoading = false;
                        });
                    } else {
                        this.onFailure();
                    }
                },
                error => {
                    this.onFailure();
                    console.error(error);
                }
            ).finally(() => {
                this.isPageLoading = false;
            });
        },
        onFailure() {
            this.displayPartnerFolder = false;
            this.isPageLoading = false;
            this.setCurrentPartner({ currentPartner: null });
            this.resetState();
        }
    }
}
