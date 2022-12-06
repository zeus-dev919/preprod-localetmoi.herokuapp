<template>
    <div class="partnership-folder" @click="close_menu">
        <app-headerbuttons/>
        <b-container fluid class="bc-example-row">
            <b-row>
                <app-menuprofile class="hidden-for-mobile margin-profile"></app-menuprofile>
                <app-menumobile class="menu-mobile"></app-menumobile>
                <fade-loader v-if="isPageLoading" class="loader-site hidden-for-mobile"></fade-loader>
                <b-col sm="12" md="12" lg="9" v-if="!isPageLoading">
                    <hr>
                    <PartnershipForm v-if="allowPartnerFolderAccess"/>
                    <div v-else>
                        Aucune donnée à afficher.
                    </div>
                </b-col>
            </b-row>
        </b-container>
		<app-footer class="footer" v-if="!currentPartner || !currentPartner.hasPartnerFolder"></app-footer>
		<app-footer class="footer-auth" v-if="currentPartner && currentPartner.hasPartnerFolder"></app-footer>
    </div>
</template>

<script>
import FadeLoader from 'vue-spinner/src/FadeLoader.vue';
import { mapState } from 'vuex';
import MenuMobile from '@/components/MenuMobile.vue';
import PartnershipForm from './PartnershipForm';
import { readyState } from "@/_helpers";

require('../../assets/style/Pfolder/partnership-folder.css');

export default {
    name: 'PartnershipFolder',
    components: {
        FadeLoader,
        MenuMobile,
        PartnershipForm
    },
    computed: {
        ...mapState('account', ['identity', 'currentPartner']),
        ...mapState('globalStore', ['offers', 'status', 'salesforce']),
        allowPartnerFolderAccess() {
            return !this.isPageLoading
                && this.currentPartner
                && this.currentPartner.hasPartnerFolder
                && this.salesforce.dpValidated.canEdit
                && this.status.hasPartnerFolderAccess
        }
    },
    data() {
        return {
            isPageLoading: true
        };
    },
    async mounted() {
        Promise.all([
            readyState.getSalesforceState(),
            readyState.getCurrentPartnerState(),
            readyState.isAllowedToEditToDisplayColorSection(),
            new Promise(resolve => {
                let timeout = setInterval(() => {
                    if (!this.status.isPageLoading
                        && this.currentPartner
                        && undefined !== this.currentPartner.hasPartnerFolder
                        && null !== this.currentPartner.hasPartnerFolder
                        && undefined !== this.salesforce.dpValidated.canEdit
                        && null !== this.salesforce.dpValidated.canEdit
                    ) {
                        clearInterval(timeout);
                        resolve();
                    }
                }, 50);
            })
        ]).finally(() => {
            this.isPageLoading = false;
        });
    },
    methods: {
        close_menu: function () {
            MenuMobile.methods.closeNav();
        }
    }
};
</script>

