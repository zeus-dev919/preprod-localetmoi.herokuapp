<template>
    <div class="documents">
        <app-headerbuttons></app-headerbuttons>
        <b-container fluid class="bv-example-row">
            <b-row>
                <notifications group="no-ticket" position="bottom right" class="notification-container" />
                <app-menuprofile class="hidden-for-mobile margin-profile" />
                <app-menumobile class="menu-mobile"></app-menumobile>
                <fade-loader v-if="status.isPageLoading || status.isSalesforceDocumentsLoading" class="loader-site hidden-for-mobile" :color="color"></fade-loader>
                <b-col lg="9" md="12" sm="12" v-if="!status.isPageLoading && !status.isSalesforceDocumentsLoading">
                    <hr>
                    <b-row>
                        <b-col offset-lg="8" lg="4" offset-md="6" md="6" offset-sm="6" sm="6">
                            <app-customerRef></app-customerRef>
                        </b-col>
                    </b-row>
                    <b-row class="contracts-field">
                        <b-col lg="8" md="12" sm="12" xs="12" cols="12">
                            <b-row>
                                <b-col lg="12">
                                    <h2><strong>Contrats</strong></h2>
                                </b-col>
                                <b-col class="contracts">
                                    <p v-if="0 === contracts.length">Pas de contrat</p>
                                </b-col>
                                <b-col class="contracts" v-for="(value, key) in contracts" :key="key" lg="12" md="12" sm="12" xs="12">
                                    <b-row>
                                        <b-col lg="6" md="6" sm="6" cols="6">
                                            {{ contracts[key].type }} du {{ contracts[key].date }}
                                        </b-col>
                                        <b-col lg="6" md="6" sm="6" cols="6">
                                            <a target="_blank" @click="downloadFile(contracts[key])">
                                                <button class="black-button">Télécharger</button>
                                            </a>
                                        </b-col>
                                    </b-row>
                                </b-col>
                            </b-row>
                        </b-col>
                        <b-col lg="8" md="12" sm="12" xs="12" cols="12">
                            <b-row>
                                <b-col lg="12">
                                    <h2><strong>Factures</strong></h2>
                                </b-col>
                                <b-col class="contracts">
                                    <p v-if="0 === bills.length">Pas de facture</p>
                                </b-col>
                                <b-col class="contracts" v-for="(value, key) in bills" :key="key" lg="12" md="12" sm="12" xs="12">
                                    <b-row>
                                        <b-col lg="6" md="6" sm="6" cols="6">
                                            {{ bills[key].type }} du {{ bills[key].date }}
                                        </b-col>
                                        <b-col lg="6" md="6" sm="6" cols="6">
                                            <a target="_blank" @click="downloadFile(bills[key])">
                                                <button class="black-button">Télécharger</button>
                                            </a>
                                        </b-col>
                                    </b-row>
                                </b-col>
                                <!-- <b-col class="contracts" v-for="(value, key) in allFacturesFile" :key="key" lg="12" md="12" sm="12" xs="12">
                                    <b-row>
                                        <b-col lg="6" md="6" sm="6" cols="6">
                                            Facture du {{ allFacturesFile[key].date }}
                                        </b-col>
                                        <b-col lg="6" md="6" sm="6" cols="6">
                                            <a target="_blank" @click="downloadFileFromContentDoc(allFacturesFile[key])">
                                                <button class="black-button">Télécharger</button>
                                            </a>
                                        </b-col>
                                    </b-row>
                                </b-col> -->
                            </b-row>
                        </b-col>
                        <b-col lg="8" md="12" sm="12" xs="12" cols="12">
                            <b-row>
                                <b-col lg="12">
                                    <h2><strong>SEPA / RIB</strong></h2>
                                </b-col>
                                <b-col class="contracts" lg="12" md="12" sm="12">
                                    <p v-if="0 === sepas.length || 0 === ribs.length" class="error">Certaines informations sont manquantes. Merci de compléter votre SEPA/RIB. Vous pouvez nous les envoyer par courrier avec l'enveloppe qui vous a été fournie ou par mail à <a href="mailto:adv@local.fr">adv@local.fr</a></p>
                                    <b-row>
                                        <b-col v-if="sepas.length > 0" lg="6" md="6" sm="6" cols="6">
                                            Mon mandat SEPA
                                        </b-col>
                                        <b-col v-if="sepas.length > 0" lg="6" md="6" sm="6" cols="6" class="contracts">
                                            <a target="_blank" @click="downloadFile(sepas[sepas.length - 1])">
                                                <button class="black-button">Télécharger</button>
                                            </a>
                                        </b-col>
                                        <b-col lg="6" md="6" sm="6" xs="6">
                                            Mon IBAN
                                        </b-col>
                                        <b-col lg="6" md="6" sm="6" xs="6">
                                            <a @click="toggleRib()" v-if="partner.hasRib">
                                                <button v-if="!showRib" class="black-button" v-bind:disabled="status.isRibLoading">Consulter</button>
                                                <button v-if="showRib" class="black-button" v-bind:disabled="status.isRibLoading">Masquer</button>
                                            </a>
                                            <a v-if="ribs.length > 0" target="_blank" @click="downloadFile(ribs[ribs.length - 1])">
                                                <button class="yellow-button">Voir le document</button>
                                            </a>
                                        </b-col>
                                        <b-col class="marge">
                                        </b-col>
                                        <b-col lg="6" v-if="showRib">
                                            <fade-loader v-if="status.isRibLoading" class="loader-site hidden-for-mobile" :color="color"></fade-loader>
                                            <div v-if="!status.isRibLoading" class="print-rib">
                                                <p class="rib-title center">IBAN - utilisation internationale</p>
                                                <b-row>
                                                    <b-col lg="9" offset-lg="1" class="sepa-nbr">
                                                        <span>{{ iban.substr(0,4) }}</span>
                                                        <span>{{ iban.substr(4,5) }}</span>
                                                        <span>{{ iban.substr(9,5) }}</span>
                                                        <span>{{ iban.substr(14,11) }}</span>
                                                        <span>{{ iban.substr(25,2) }}</span>
                                                        <span></span>
                                                    </b-col>
                                                </b-row>
                                                <p class="rib-title sepa-nbr">Bank Identification Code : {{ bic }}<br />
                                                    <span>Banque: {{ bankName }}</span>
                                                </p>
                                            </div>
                                        </b-col>
                                    </b-row>
                                </b-col>
                            </b-row>
                        </b-col>
                    </b-row>
                </b-col>
            </b-row>
        </b-container>
        <app-footer v-if="nbrFacture > 2"></app-footer>
        <app-footer v-if="nbrFacture < 3" class="footer-auth"></app-footer>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import FadeLoader from 'vue-spinner/src/FadeLoader.vue';
import { salesforceService } from '@/_services';

require('../assets/style/documents.css');

export default {
    name: 'Documents',
    components: {
        FadeLoader
    },
    computed: {
        ...mapState('globalStore', ['status', 'salesforce', 'documents', 'partner']),
        bills: function () {
            return this.documents.filter(document => 'Facture / Avoir' === document.type);
        },
        contracts: function () {
            return this.documents.filter(document => /^Contrat( DocuSign)?$/.test(document.type));
        },
        ribs: function () {
            return this.documents.filter(document => 'RIB' === document.type);
        },
        sepas: function () {
            return this.documents.filter(document => 'SEPA' === document.type);
        }
    },
    mounted: function () {
        (new Promise(resolve => {
            if (this.salesforce.account.Id) {
                resolve();
            }
        })).then(() => {
            this.getSalesforceDocuments({ accountId: this.salesforce.account.Id });
            this.getRib({ accountId: this.salesforce.account.Id });
        });
    },
    data () {
        return {
            totalFilesNbr: null,
            showRib: false,
            nbrFacture: 0,
            nbrContract: null,
            nbrSepa: null,
            iban: '',
            bic: '',
            bankName: '',
            color: '#ec008c'
        };
    },
    methods: {
        ...mapActions('globalStore', ['getRib', 'getSalesforceDocuments']),
        downloadFile: function (file) {
            salesforceService.downloadFile(file).then(
                data => {
                    const url = window.URL.createObjectURL(new Blob([data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', file.documentName);
                    document.body.appendChild(link);
                    link.click();
                }, error => {
                    console.error(error.response.data);
                }
            );
        },
        toggleRib: async function () {
            if (this.showRib) {
                this.iban = '';
                this.bic = '';
                this.bankName = '';
                this.showRib = false;
            } else {
                this.showRib = true;
                const rib = await this.getRib({ accountId: this.salesforce.account.Id });
                this.iban = rib.IBAN__c;
                this.bic = rib.Code_BIC__c;
                this.bankName = rib.Banque__c;
            }
        }
    }
};
</script>
