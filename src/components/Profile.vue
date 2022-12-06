<template>
    <div class="profile" @click="close_menu">
        <app-headerbuttons></app-headerbuttons>
        <b-container fluid class="bc-example-row">
            <b-row>
                <app-menuprofile class="hidden-for-mobile margin-profile"></app-menuprofile>
                <app-menumobile class="menu-mobile"></app-menumobile>
                <fade-loader v-if="status.isPageLoading" class="loader-site hidden-for-mobile" :color="color"></fade-loader>
                <notifications group="mail-sent" position="bottom right" class="notification-container" />
                <modal name="modal-edit-factu" width="70%" height="330px">
                    <fade-loader v-if="status.isNewBillingInfoSending" class="loader-site hidden-for-mobile" :color="color"></fade-loader>
                    <div v-if="!status.isNewBillingInfoSending" class="edit-factu-infos-modal">
                        <h3>Modifications de coordonnées
                            <span><img class="button-close" @click="close_modal" src="../assets/close.png"></span>
                        </h3>
                        <hr>
                        <p>Indiquez ici les modifications à apporter</p>
                        <b-form-textarea v-model='message' id='textarea1' placeholder='Description' rows='3' wrap='soft'></b-form-textarea><br>
                        <button @click="sendNewBillingInfo()" class="newsletter-btn" type="submit" v-bind:disabled="status.isNewBillingInfoSending">Envoyer</button>
                    </div>
                </modal>
                <b-col lg="9" md="12" sm="12">
                    <hr>
                    <div class="billing">
                        <b-row>
                            <b-col lg="6" md="6" sm="6" xs="12" cols="12">
                                <h3 class="factu-title">Coordonnées de facturation
                                    <img @click="open_edit_factu_modale()" class="edit-logo" src="../assets/edit.png">
                                </h3>
                            </b-col>
                            <b-col lg="6" md="6" sm="6" xs="6" cols="12">
                                <app-customerRef></app-customerRef>
                            </b-col>
                            <b-col v-if="!status.isPageLoading && salesforce.account && salesforce.contact" lg="12">
                                <div>
                                    <p>Raison sociale : <strong>{{ salesforce.account.Raison_sociale__c }}</strong></p>
                                    <p>Nom : <strong>{{ salesforce.contact.LastName }}</strong></p>
                                    <p>Prénom : <strong>{{ salesforce.contact.FirstName }}</strong></p>
                                    <p>Adresse : <strong>{{ salesforce.account.BillingStreet }}</strong></p>
                                    <p>CP Ville : <strong>{{ salesforce.account.BillingPostalCode }}</strong></p>
                                    <p>Téléphone Fixe : <strong>{{ salesforce.account.Phone }}</strong></p>
                                    <p>Téléphone portable : <strong>{{ salesforce.contact.MobilePhone }}</strong></p>
                                    <p>E-mail : <strong>{{ salesforce.contact.Email }}</strong></p>
                                </div>
                            </b-col>
                        </b-row>
                    </div>
                </b-col>
            </b-row>
        </b-container>
        <app-footer class="footer-profile" />
    </div>
</template>

<script>

import { mapState, mapActions } from 'vuex';

import MenuMobile from '@/components/MenuMobile.vue';
import FadeLoader from 'vue-spinner/src/FadeLoader.vue';

require('../assets/style/accueil.css');
require('../assets/style/profile.css');

export default {
    name: 'Profil',
    components: {
        FadeLoader
    },
    computed: {
        ...mapState('account', ['identity']),
        ...mapState('globalStore', ['salesforce', 'status'])
    },
    data () {
        return {
            message: '',
            color: '#ec008c'
        };
    },
    methods: {
        ...mapActions('globalStore', ['sendNewBillingInfoMail']),
        feedback: function () {
            (function (t, e, s, o) {
                var n, c, l;
                t.SMCX = t.SMCX || [], e.getElementById(o) || (n = e.getElementsByTagName(s), c = n[n.length - 1], l = e.createElement(s), l.type = 'text/javascript', l.async = !0, l.id = o, l.src = ['https:' === location.protocol ? 'https://' : 'http://', 'widget.surveymonkey.com/collect/website/js/tRaiETqnLgj758hTBazgd9QuxQWSQk99_2FVuA3ik9gvgH5IGpj66HI3poKGa9ebrp.js'].join(''), c.parentNode.insertBefore(l, c));
            })(window, document, 'script', 'smcx-sdk');
        },
        sendNewBillingInfo: function () {
            const data = {
                email: this.identity.email,
                sageCode: this.salesforce.account.Code_Sage__c,
                message: this.message
            };
            this.sendNewBillingInfoMail({ data }).then(
                () => {
                    this.close_modal();
                }
            );
        },
        open_edit_factu_modale: function () {
            this.$modal.show('modal-edit-factu');
        },
        close_modal: function () {
            this.$modal.hide('modal-edit-factu');
        },
        close_menu: function () {
            MenuMobile.methods.closeNav();
        }
    }
};
</script>
