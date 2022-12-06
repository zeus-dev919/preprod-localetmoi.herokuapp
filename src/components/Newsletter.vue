<template>
    <div class="messages">
        <app-headerbuttons></app-headerbuttons>
        <b-container fluid class="bv-example-row">
            <notifications group="success" position="bottom right" class="notification-container"/>
            <notifications group="no-ticket" position="bottom right" class="notification-container"/>
            <b-row>
                <app-menuformation class='hidden-for-mobile margin-menu'></app-menuformation>
                <app-menumobile class="menu-mobile"></app-menumobile>
                <b-col lg="9" class="header-ticket">
                    <!--  Modal to create a new subscription -->
                    <modal name="modal-create-subscription" width="70%" height="560">
                        <div class="create-subscription-modal">
                            <h3>Ajouter un inscrit<span><img class="button-close" @click="closeModalCreateSubscription" src="../assets/close.png"></span></h3><hr>
                            <p>Prénom</p>
                            <b-form-input v-model="newSubscription.firstName" type="text" required placeholder="Entrez un prénom"></b-form-input><br>
                            <p>Nom</p>
                            <b-form-input v-model="newSubscription.lastName" type="text" placeholder="Entrez un nom"></b-form-input><br>
                            <p>Email* <span v-if="!newSubscription.email" class="error-for-subscription error-subscription">Champ obligatoire</span>
                                <span class="error-for-subscription error-subscription" v-if="!isMailValid"> Email invalide</span>
                            </p>
                            <b-form-input v-model="newSubscription.email" type="text" placeholder="Entrez un email"></b-form-input><br>
                            <p>Téléphone</p>
                            <b-form-input v-model="newSubscription.phone" type="text" placeholder="Entrez un numéro de téléphone"></b-form-input>
                            <br />
                            <button @click="createSubscription()" class="subscription-btn" type="submit">Ajouter</button>
                        </div>
                    </modal>
                    <!-- End of Modal -->
                    <!--  Modal to edit subscription -->
                    <modal name="modal-edit-subscription" width="70%" height="580">
                        <div class="create-subscription-modal">
                            <h3>Modifier un inscrit
                                <span><img class="button-close" @click="closeModalEditSubscription" src="../assets/close.png"></span>
                            </h3>
                            <hr>
                            <p>Prénom</p>
                            <b-form-input v-model="newSubscription.firstName" type="text" required placeholder="Entrez un prénom"></b-form-input><br>
                            <p>Nom</p>
                            <b-form-input v-model="newSubscription.lastName" type="text" placeholder="Entrez un nom"></b-form-input><br>
                            <p>Email* <span v-if="!newSubscription.email" class="error-for-subscription error-subscription">Champ obligatoire</span>
                                <span class="error-for-subscription error-subscription" v-if="!isMailValid"> Email invalide</span>
                            </p>
                            <b-form-input v-model="newSubscription.email" type="text" placeholder="Entrez un email"></b-form-input><br>
                            <p>Téléphone</p>
                            <b-form-input v-model="newSubscription.phone" type="text" placeholder="Entrez un numéro de téléphone"></b-form-input>
                            <br />
                            <button @click="submitSubscription()" class="subscription-btn" type="submit">Modifier</button>
                        </div>
                    </modal>
                    <!-- End of Modal -->
                    <b-col lg="12" class="subscription-list-container">
                        <b-row>
                            <b-col>
                                <b-row>
                                    <b-col>
                                        <button @click="openModalCreateSubscription" class="subscription-btn add-subscription-btn">Ajouter un inscrit</button>
                                    </b-col>
                                    <b-col>
                                        <b-form-select v-if="myWebsitesNames.length > 1" @change="getSubscriptions()" v-model="currentWebsite" :options="myWebsitesNames" class="mb-3 site-selector"></b-form-select>
                                    </b-col>
                                    <b-col>
                                        <button @click="exportCsv" class="subscription-btn export-btn">Exporter en CSV</button>
                                    </b-col>
                                </b-row>
                            </b-col>
                        </b-row>
                        <div class="hidden-for-mobile">
                            <b-col>
                                <b-row>
                                    <b-col class="cells top-line" lg="2" md="2" sm="2" cols="2">
                                        <b>Prénom</b>
                                    </b-col>
                                    <b-col class="cells top-line" lg="1" md="1" sm="2" cols="2">
                                        <b>Nom</b>
                                    </b-col>
                                    <b-col class="cells top-line mail-cell" lg="3" md="3" sm="3" cols="3">
                                        <b>Email</b>
                                    </b-col>
                                    <b-col class="cells top-line" lg="2" md="2" sm="2" cols="2">
                                        <b>Téléphone</b>
                                    </b-col>
                                    <b-col class="cells top-line" lg="2" md="2" sm="2" cols="2">
                                        <b>Source</b>
                                    </b-col>
                                    <b-col class="cells top-line" lg="2" md="2" sm="2" cols="2">
                                        <b>Action</b>
                                    </b-col>
                                </b-row>
                            </b-col>
                            <!-- desktop Version -->
                            <p v-if="noSubscription" class="no-subscription">Vous n'avez aucun inscrit</p>
                            <b-col v-for="subscription in allSubscriptions" :key="subscription.id">
                                <b-row class="line">
                                    <b-col lg="2" md="2" sm="2" cols="2" class="cells">
                                        {{ subscription.firstName }}
                                    </b-col>
                                    <b-col lg="1" md="1" sm="1" cols="1" class="cells">
                                        {{ subscription.lastName }}
                                    </b-col>
                                    <b-col lg="3" md="3" sm="3" cols="3" class="cells mail-cell">
                                        {{ subscription.email }}
                                    </b-col>
                                    <b-col lg="2" md="2" sm="2" cols="2" class="cells">
                                        {{ subscription.phone }}
                                    </b-col>
                                    <b-col lg="2" md="2" sm="2" cols="2" class="cells">
                                        {{ subscription.source }}
                                    </b-col>
                                    <b-col lg="2" md="2" sm="2" cols="2" class="cells">
                                        <span class="glyphicon glyphicon-pencil" @click="editSubscription(subscription)"></span>
                                        <img @click="deleteSubscription(subscription)" class="subscription-btn subscription-action-btn" src="../assets/delete.png"/>
                                        <img @click="editSubscription(subscription)" class="subscription-btn subscription-action-btn" src="../assets/edit-pen.png"/>
                                    </b-col>
                                </b-row>
                            </b-col>
                        </div>
                        <!-- End of desktop Version -->
                        <!-- Mobile Version -->
                        <div class="hidden-for-desktop">
                            <b-col>
                                <b-row>
                                    <b-col class="cells top-line mail-cell" lg="7" md="7" sm="7" cols="7">
                                        <b>Email</b>
                                    </b-col>
                                    <b-col class="cells top-line" lg="5" md="5" sm="5" cols="5">
                                        <b>Action</b>
                                    </b-col>
                                </b-row>
                            </b-col>
                            <b-col v-for="subscription in allSubscriptions" :key="subscription.id">
                                <b-row class="line">
                                    <b-col lg="7" md="7" sm="7" cols="7" class="cells mail-cell">
                                        {{ subscription.email }}
                                    </b-col>
                                    <b-col lg="5" md="5" sm="5" cols="5" class="cells">
                                        <span class="glyphicon glyphicon-pencil"
                                              @click="editSubscription(subscription)"></span>
                                        <img @click="deleteSubscription(subscription)" class="subscription-btn"
                                             src="../assets/delete.png"/>
                                        <img @click="editSubscription(subscription)" class="subscription-btn"
                                             src="../assets/edit-pen.png"/>
                                    </b-col>
                                </b-row>
                            </b-col>
                        </div>
                        <!-- End of Mobile Version -->
                        <div v-if="messagesList.length <= 8" class="margin-subscription"></div>
                    </b-col>
                </b-col>
            </b-row>
        </b-container>
        <app-footer v-bind:class="{ 'footer-auth': messagesList.length <= 8 }"></app-footer>
    </div>
</template>

<script>

    import {webtoolService} from "../_services";

    require('../assets/style/newsletter.css');

    export default {
        name: 'Newsletter',
        mounted() {
            this.getSubscriptions();
        },
        data() {
            return {
                messagesList: [],
                nbrMsg: 0,
                isMailValid: true,
                allSubscriptions: [],
                newSubscription: {
                    firstName: '',
                    lastName: '',
                    phone: '',
                    email: ''
                },
                myWebsitesNames: [],
                myWebsitesList: [],
                currentWebsite: null,
                currentWebsiteSiteId: [],
                noSubscription: false,
                selectedWebsite: null
            };
        },
        methods: {
            openModalCreateSubscription() {
                this.newSubscription = {
                    firstName: '',
                    lastName: '',
                    phone: '',
                    email: ''
                };
                this.$modal.show('modal-create-subscription');
            },
            openModalEditSubscription() {
                this.newSubscription = {
                    firstName: '',
                    lastName: '',
                    phone: '',
                    email: ''
                };
                this.$modal.show('modal-edit-subscription');
            },
            closeModalCreateSubscription() {
                this.$modal.hide('modal-create-subscription');
            },
            closeModalEditSubscription() {
                this.$modal.hide('modal-edit-subscription');
            },
            getSubscriptions() {
                this.allSubscriptions = [];
                this.noSubscription = false;

                return webtoolService.getSubscriptions()
                    .then(response => {
                        this.myWebsitesNames = [];
                        this.myWebsitesList = response;

                        for (let site in response) {
                            this.myWebsitesNames.push(site);
                        }

                        if (null === this.currentWebsite) {
                            this.currentWebsite = this.myWebsitesNames[0];
                        }

                        this.selectedWebsite = this.currentWebsite;

                        let listUser = response[this.currentWebsite];
                        if (listUser && listUser.length > 0) {
                            this.allSubscriptions = listUser;
                        } else {
                            this.noSubscription = true;
                        }
                    }).catch(error => {
                        var self = this;
                        setTimeout(() => {
                            self.$notify({
                                group: 'no-ticket',
                                title: 'Service indisponible',
                                type: 'error',
                                duration: 6000,
                                text: 'Impossible d\'accéder à la liste de vos inscrits.'
                            });
                        }, 1500);
                        console.warn(error);
                    });
            },
            editSubscription(subscription) {
                this.openModalEditSubscription();
                if (null === subscription.firstName) {
                    subscription.firstName = '';
                }
                if (null === subscription.lastName) {
                    subscription.lastName = '';
                }
                if (null === subscription.phone) {
                    subscription.phone = '';
                }
                if (null === subscription.email) {
                    subscription.email = '';
                }
                this.newSubscription = {
                    firstName: subscription.firstName,
                    lastName: subscription.lastName,
                    phone: subscription.phone,
                    email: subscription.email,
                    id: subscription.id
                };
            },
            submitSubscription() {
                if (!this.newSubscription.email) {
                    return 0;
                } else {
                    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.newSubscription.email)) {
                        this.isMailValid = false;
                        return;
                    }

                    let newSubscription = {
                        id: this.newSubscription.id,
                        firstName: this.newSubscription.firstName,
                        lastName: this.newSubscription.lastName,
                        email: this.newSubscription.email,
                        phone: this.newSubscription.phone
                    };

                    webtoolService.updateSubscription(newSubscription)
                        .then(() => {
                            let name = this.newSubscription.email;
                            this.closeModalEditSubscription();
                            return webtoolService.getSubscription(newSubscription.id)
                                .then(response => {
                                    this.newSubscription = response;
                                    this.getSubscriptions();
                                    this.$notify({
                                        group: 'success',
                                        title: 'Modification effectuée',
                                        type: 'success',
                                        duration: 6000,
                                        text: name + ' a été modifié avec succès !'
                                    });
                                }).catch(error => {
                                    console.warn(error);
                                    this.$notify({
                                        group: 'no-ticket',
                                        title: 'Erreur dans la modification',
                                        type: 'error',
                                        duration: 6000,
                                        text: name + ' n\'a été trouvé !'
                                    });
                                })
                        }).catch(error => {
                            console.warn(error);
                            this.$notify({
                                group: 'no-ticket',
                                title: 'Un problème est survenu',
                                type: 'error',
                                duration: 6000,
                                text: 'Erreur dans l\'envoi des données'
                            });
                        });
                }
            },
            deleteSubscription(subscription) {
                return webtoolService.deleteSubscription(subscription.id)
                    .then(response => {
                        this.$notify({
                            group: 'success',
                            title: 'Supprimé !',
                            type: 'warn',
                            duration: 6000,
                            text: response
                        });
                        this.getSubscriptions();
                    }).catch(error => {
                        console.warn(error);
                    });
            },
            createSubscription() {
                if (!this.newSubscription.email) {
                    return 0;
                } else {
                    let currentWebsite = this.selectedWebsite;

                    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.newSubscription.email)) {
                        this.isMailValid = false;
                        return;
                    }
                    let newSubscription = {
                        firstName: this.newSubscription.firstName,
                        lastName: this.newSubscription.lastName,
                        email: this.newSubscription.email,
                        phone: this.newSubscription.phone,
                        domainName: currentWebsite
                    };

                    return webtoolService.createSubscription(newSubscription)
                        .then(response => {
                            this.$notify({
                                group: 'success',
                                title: 'Inscription effectuée',
                                type: 'success',
                                duration: 6000,
                                text: response
                            });
                            this.isMailValid = true;
                            this.newSubscription = {};
                            this.closeModalCreateSubscription();
                            this.getSubscriptions();
                        }).catch(error => {
                            console.warn(error);
                            this.$notify({
                                group: 'no-ticket',
                                title: 'Inscription impossible',
                                type: 'error',
                                duration: 6000,
                                text: 'Une erreur est survenu lors de l\'inscription'
                            });
                        });
                }
            },
            exportCsv() {
                 webtoolService.exportCsv(this.selectedWebsite)
                    .then(response => {
                        const url = window.URL.createObjectURL(new Blob([response]));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', 'rapport.csv');
                        document.body.appendChild(link);
                        link.click();
                    });
            }
        }
    };
</script>
