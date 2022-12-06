<!--
    @Todo Define this page
 -->
 <!-- <template>
    <div class="communication">
        <notifications group="update-success" position="bottom right" class="notification-container" />
        <app-headerbuttons />
        <b-row>
            <app-menuformation />
            <b-col lg="8" md="12" sm="12" class="communication-info">
                <h3><strong>Coordonnées de communication.</strong></h3>
                <h6><font color="#fcc05b">Ces informations sont diffusées sur les supports de communication digitales. Vérifiez leur exactitude.</font></h6>
                <b-row>
                    <b-col lg="3" md="6" sm="6" xs="6">
                        <div class="billing-data">
                            <p>Raison sociale :</p>
                            <p>Nom :</p>
                            <p>Prénom :</p>
                            <p>Adresse :</p>
                            <p>CP Ville :</p>
                            <p>Téléphone Fixe :</p>
                            <p>Portable:</p>
                            <p>E-mail :</p>
                        </div>
                    </b-col>
                    <b-col v-if="isHidden" lg="6" md="" sm="4" xs="xs">
                        <div>
                            <p><strong>{{ businessName }}</strong></p>
                            <p><strong>{{ genre }} {{ lastName }}</strong></p>
                            <p><strong>{{ firstName }}</strong></p>
                            <p><strong>{{ shippingAddress }}</strong></p>
                            <p><strong>{{ shippingPostalCode }}</strong></p>
                            <p><strong>{{ shippingPhone }}</strong></p>
                            <p><strong>{{ shippingMobilePhone }}</strong></p>
                            <p><strong>{{ shippingMail }}</strong></p>
                        </div>
                    </b-col>
                    @TODO: Inputs to edit labels
                            <b-col v-if="IsDispayed" lg="4" md="6" sm="6" xs="xs">
                            <div class="info-billing">
                                <input v-model="lastName" placeholder="Nom"><br />
                                <input v-model="firstName" placeholder="Prénom"><br />
                                <input v-model="shippingAddress" placeholder="modifiez-moi"><br />
                                <input v-model="shippingPostalCode" placeholder="modifiez-moi"><br />
                                <input v-model="shippingPhone" placeholder="modifiez-moi"><br />
                                <input v-model="shippingMobilePhone" placeholder="modifiez-moi"><br />
                                <input v-model="shippingMail" placeholder="modifiez-moi"><br />
                            </div>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
        <app-footer />
    </div>
</template>

<script>
require('../assets/style/accueil.css');
require('../assets/style/profile.css');

import axios from 'axios';
import Profile from '@/components/Profile.vue';

var baseUrl = process.env.SALESFORCE_ROOT_API;
export default {
    name: "Profil",
    beforeMount: function () {
        Profile.methods.is_connected();
    },
    mounted: function() {
        this.retrieve_shiping_info();
        this.retrieve_business_info();
    },
    data () {

        return {
            isDispayed: false,
            isHidden: true,
            businessName: " ",
            genre: " ",
            firstName : " ",
            lastName : " ",
            shippingAddress: " ",
            shippingCity: " ",
            shippingPostalCode: " ",
            shippingPhone : " ",
            shippingMail: " ",
            shippingMobilePhone: " ",
            SALESFORCE_OPPORTUNITY_ID: localStorage.getItem('SALESFORCE_OPPORTUNITY_ID'),
            SALESFORCE_ACCOUNT_ID : localStorage.getItem('SALESFORCE_ACCOUNT_ID'),
            SALESFORCE_CONTACT_ID : localStorage.getItem('SALESFORCE_CONTACT_ID')
        };
    },
    methods: {

        /**
        *   @todo Implement this function.
        **/
        ////////////////////////////////////////////////////////////
        //                                                        //
        //              Method to print/hide input text           //
        //                                                        //
        ////////////////////////////////////////////////////////////

        // edit: function () {
        //  this.IsDispayed = true;
        //  this.isHidden = false;
        // },
        // hide: function () {
        //  this.IsDispayed = false;
        //  this.isHidden = true;
        // },

        ////////////////////////////////////////////////////////////
        //                                                        //
        //              Retrieving Raison Social label .          //
        //                                                        //
        ////////////////////////////////////////////////////////////
        retrieve_business_info: function () {
            var url = baseUrl +  process.env.SALESFORCE_QUERY_BASE_SOBJECTS + "Account/" + this.SALESFORCE_ACCOUNT_ID;
            const authStr = 'Bearer '.concat(this.SALESFORCE_USER_TOKEN);
            axios.get(url, { headers: { Authorization: authStr } }).then(response => {
                this.businessName = response.data.Raison_sociale__c;
            }).catch(error => {
                console.warn('error ' + error);
                window.location.href = '/#/authentification';
            });
        },

        ////////////////////////////////////////////////////////////
        //                                                        //
        //              Retrieving User infos.                    //
        //                                                        //
        ////////////////////////////////////////////////////////////
        retrieve_shiping_info: function () {
            var url = baseUrl +  process.env.SALESFORCE_QUERY_BASE_SOBJECTS + "Contact/" + this.SALESFORCE_CONTACT_ID;
            const authStr = 'Bearer '.concat(this.SALESFORCE_USER_TOKEN);
            axios.get(url, { headers: { Authorization: authStr } }).then(response => {
                this.firstName = response.data.FirstName;
                this.lastName = response.data.LastName;
                this.genre =  response.data.genre;
                this.shippingAddress = response.data.MailingStreet;
                this.shippingCity = response.data.MailingCity;
                this.shippingPostalCode = response.data.MailingPostalCode;
                this.shippingPhone = response.data.Phone;
                this.shippingMail = response.data.email;
                this.shippingMobilePhone = response.data.MobilePhone;
            }).catch(error => {
                console.warn('error ' + error);
                window.location.href = '/#/authentification';
            });
        },

        update_infos: function () {
            var firstName = this.FirstName;
            var lastName = this.LastName;
            var mailingStreet = this.shippingAddress;
            var mailingPostalCode = this.shippingPostalCode;
            var phone = this.shippingPhone;
            var mobilePhone = this.shippingMobilePhone;
            var email = this.shippingMail;
            var url = baseUrl + process.env.SALESFORCE_QUERY_BASE_SOBJECTS + "Contact/" + this.SALESFORCE_CONTACT_ID;
            const authStr = 'Bearer '.concat(this.SALESFORCE_USER_TOKEN);
            const body = {
                "FirstName": firstName,
                "LastName": lastName,
                "MailingStreet": mailingStreet,
                "MailingPostalCode": mailingPostalCode,
                "Phone": phone,
                "mobilePhone": mobilePhone,
                "Email": email
            };
            axios.patch(url, body ,{ headers: { Authorization: authStr }}).then(response => {
                this.$notify({
                    group: 'update-success',
                    title: 'Enregisré !',
                    type: 'success',
                    duration: 10000,
                    text: 'La mise à jour de vos informations de communication a été effectuée avec succès !'
                });
                this.retrieve_shiping_info();
                this.hide();
            }).catch(error => {
                console.warn('error ' + error);
            });
        },
    }
};
</script>
 -->
