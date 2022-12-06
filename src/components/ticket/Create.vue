<template>
    <div class="creer" @click="close_menu">
        <app-headerbuttons />
        <b-container fluid class="bv-example-row">
            <b-col lg="12" md="12" sm="12" class="header-ticket">
                <b-row>
                    <app-menuprofile class="menu-asks hidden-for-mobile"></app-menuprofile>
                    <app-menumobile class="menu-mobile"></app-menumobile>
                    <b-col lg="9" md="12" sm="12" class="create-ticket">
                        <b-row class="ticket-form" :class="isSendingTicket ? 'disabled' : ''">
                            <b-col>
                                <modal name="modal-input-creer" :adaptive="true" :max-width="300" :max-height="100">
                                    <div class="modal-input">Merci de renseigner tous les champs.</div>
                                </modal>
                                <h2>Créer une nouvelle demande</h2>
                                <br />
                                <b-form-input v-model="object" type="text" placeholder="Objet de la demande"></b-form-input>
                                <br />
                                <p>Votre demande concerne :</p>
                                <b-form-select v-model="selectedType" :options="availableTypes" class="mb-3"></b-form-select>
                                <br />
                                <p>Détail de votre demande :</p>
                                <fade-loader :color="color" class="ticket-spinner" v-if="isSendingTicket"></fade-loader>
                                <ValidationProvider name="description" rules="min:20"
                                                    v-slot="{ validate, classes, errors }">
                                    <b-form-textarea v-model="description"
                                                     id="textarea1"
                                                     placeholder="Description"
                                                     rows="3"
                                                     wrap="soft">
                                    </b-form-textarea>
                                    <small :class="classes">
                                        {{ handleTicketDescriptionError(errors) }}
                                    </small>
                                </ValidationProvider>
                            </b-col>
                        </b-row>
                        <b-row>
                            <vue-progress-bar id="progress-tickets"></vue-progress-bar>
                        </b-row>
                        <b-row>
                            <button @click="add_files()" class="submit-button"
                                    :disabled="isSendingTicket || !formValid"
                                    :class="{ disabled: isSendingTicket || !formValid }">
                                Ajouter des fichiers
                            </button>
                            <button @click="formValid && validate_form()"
                                    class="validate-button submit-button"
                                    :class="{ disabled: !formValid || isSendingTicket }"
                                    :disabled="!formValid"
                            >Valider
                            </button>
                        </b-row>
                        <b-row>
                            <b-col md="6" offset-md="3" class="my-3">
                                <b-row v-for="(file, key) in files" :key="key+forceReload" class="my-1">
                                    <b-col md="9">{{ file.name }}</b-col>
                                    <b-col md="1">
                                        <span v-if="file.uploaded" class="uploaded-file"><i class="fas fa-check-circle"></i></span>
                                        <span v-if="file.isUploading" class="uploading-file"><i class="fas fa-fan"></i></span>
                                        <span v-if="false === file.uploaded && false === file.isUploading" class="error-file"><i class="fas fa-exclamation-circle"></i></span>
                                    </b-col>
                                    <b-col md="2" v-if="false === file.uploaded || !isSendingTicket">
                                        <img src="../../assets/delete.png" @click="remove_file(key)" class="delete-file">
                                    </b-col>
                                </b-row>
                            </b-col>
                            <b-col md="2" hidden>
                                <input type="file" id="files" ref="files" :accept="allowedUploadExtensions" multiple @change="handle_files_upload()" />
                            </b-col>
                        </b-row>
                    </b-col>
                </b-row>
            </b-col>

        </b-container>
        <app-footer></app-footer>
    </div>
</template>

<script>
import router from '@/router';
import { ticketHelpers, fileHelpers, progressBar, dropboxHelper, readyState } from '@/_helpers';
import { mapState, mapActions } from 'vuex';
import MenuMobile from '@/components/MenuMobile.vue';
import FadeLoader from 'vue-spinner/src/FadeLoader.vue';

require('../../assets/style/ticket.css');

export default {
    name: 'TicketCreate',
    components: {
        FadeLoader
    },
    computed: {
        ...mapState('account', ['identity', 'currentPartner']),
        ...mapState('globalStore', ['status', 'salesforce', 'offers'])
    },
    data () {
        return {
            counter: 0,
            formValid: false,
            subject: 'corrections_bat__minime___30min_',
            description: '',
            files: [],
            filesNameTab: [],
            object: '',
            ticketTypes: ticketHelpers.getTicketTypes(),
            availableTypes: [],
            selectedType: null,
            allowedUploadExtensions: fileHelpers.getAllowedExtensions().join(','),
            isSendingTicket: false,
            color: '#ec008c',
            errorOccured: false,
            forceReload: 0,
        };
    },
    methods: {
        ...mapActions('globalStore', ['getSalesforceTicket', 'createSalesforceTicket', 'updateSalesforceTicket', 'uploadDropboxFile', 's3Upload']),
        check_inputs: function() {
            if (!this.object || '' === this.object
                || !this.description || '' === this.description.trim()
                || !this.selectedType || '' === this.selectedType
            ) {
                this.formValid = false;
                return false;
            }
            this.formValid = true;
            return true;
        },
        close_menu: function() {
            MenuMobile.methods.closeNav();
        },
        add_files () {
            this.$refs.files.click();
        },
        async validate_form() {
            this.isSendingTicket = true;
            let button = document.querySelector('.validate-button');
            if (true === button.disabled) {
                return;
            }
            this.toggleSubmitButton(true);
            this.formValid = this.check_inputs();
            if (!this.formValid) {
                this.toggleSubmitButton(false);
                this.isSendingTicket = false;
                return false;
            }
            this.$modal.show('sending-ticket');
            let data = {
                accountId: this.salesforce.account.Id || this.currentPartner.company,
                cms: this.getCms(),
                contactId: this.salesforce.contact.Id,
                origin: 'Formulaire',
                subject: `${this.currentPartner.customerCode} ${this.object}`,
                type: ticketHelpers.findTicketType(this.selectedType, this.status.isWebsiteOnline),
                category: ticketHelpers.findTicketCategory(this.selectedType, this.status.isWebsiteOnline),
                description: this.description,
                priority: 'normal',
            };
    
            this.$Progress.start();
            this.$Progress.pause();
    
            const newFolderPath = dropboxHelper.retrieveMostRecentBasePath();
            const message = dropboxHelper.getMultipleFoldersMessage();
            
            const folderPathFound = newFolderPath || `${this.currentPartner.customerCode} ${this.salesforce.account.Name}`;

            let percentPerFile = progressBar.getPercentagePerFile(this.files.length);
            let round = 0;
            let ticketPath = `G:${folderPathFound}`;
            
            this.createSalesforceTicket({ data })
                .then(ticketId => this.getSalesforceTicket({ticketId}))
                .then(async response => {
                    const ticketFolderName = `TICKET ${response.CaseNumber}`;
                    if (this.files.length) {
                        ticketPath = `${ticketPath}/${ticketFolderName}`;
                    }

                    let initializeFormData = new FormData();
                    for (var i = 0; i < this.files.length; i++) {
                        let file = this.files[i];
                        initializeFormData.append('files[' + i + ']', file);
                    }
                    
                    for (let i = 0; i < this.files.length; i++) {
                        let file = this.files[i];
                        file.isUploading = true;
                        file.isUploadFailed = false;
                        this.forceReload++;
                        this.$Progress.set(round);
                        
                        try {
                            const result = await this.uploadDropboxFile({
                                folderName: folderPathFound,
                                subFolder: ticketFolderName,
                                file: file,
                                message: message
                            })
                            
                            if (result.name) {
                                let filepath = result.path_display.replace(process.env.DROPBOX_FOLDER, '');
                                this.filesNameTab.push(
                                    encodeURI(`${process.env.LOCALETMOI_BASE_URL}/#/demandes/attachment${filepath}`)
                                );
                                
                                file.uploaded = true;
                                round += percentPerFile;
                                
                                this.$Progress.set(round);
                                this.$Progress.pause();
                            } else {
                                this.errorOccured = true;
                                file.uploaded = false;
                                file.isUploadFailed = true;
                            }
                        } catch (e) {
                            this.errorOccured = true;
                            file.uploaded = false;
                            file.isUploadFailed = true;
                        }
                        
                        file.isUploading = false;
                        this.forceReload++;
                    }
                    
                    if (this.errorOccured) {
                        this.$Progress.setColor('red');
                    } else {
                        this.$Progress.finish();
                    }
                    
                    return response;
                })
                .then(response => {
                    let dataToUpdate = {
                        description: `${this.description}\n\n${this.filesNameTab.join('\n')}`,
                        R_pertoire_partenaire_r_seau__c: `${ticketPath}`.replaceAll('/', '\\'),
                    };
                    return this.updateSalesforceTicket({ ticketId: response.Id, data: dataToUpdate }).then(
                        response => {
                            setTimeout(() => {
                                this.$Progress.hide();
                                this.$Progress.revertColor();
                                this.toggleSubmitButton(false);
                                this.isSendingTicket = false;
                                router.push('/demandes');
                            }, 3000)
                        }
                    );
                });
            
            if (!this.status.isDropboxEmailSent) {
                dropboxHelper.sendEmailForMultipleFoldersFound('ticket');
            }
        },
        handle_files_upload() {
            let uploadedFiles = this.$refs.files.files;
            for (var i = 0; i < uploadedFiles.length; i++) {
                this.files.push(uploadedFiles[i]);
            }
        },
        remove_file(key) {
            this.files.splice(key, 1);
        },
        getCms() {
            let cms;
            if (this.offers && this.offers.length) {
                let avalaibleOffers = this.offers.filter(offer => !/^R?ABADW/.test(offer.productCode));
                if (avalaibleOffers.length) {
                    cms = avalaibleOffers[0].cms;
                }
            }

            return cms;
        },
        toggleSubmitButton(disable) {
            const inputs = ['input', 'select', 'textarea', 'button']
                .map(item => `.create-ticket ${item}`)
                .join(',');
            document.querySelectorAll(inputs).forEach(button => button.disabled = disable);
        },
        handleTicketDescriptionError(errors) {
            this.formValid = this.check_inputs() && !errors.length;
            if (errors.length) {
                this.toggleSubmitButton(false);
                this.isSendingTicket = false;
                errors[0] = 'Veuillez compléter votre demande afin de pouvoir la soumettre (20 caractères minimum).';
                return errors[0];
            }
        }
    },
    async mounted() {
        let timeout = window.setInterval(() => {
            if (this.status.isPageLoading) {
                return;
            }
            window.clearInterval(timeout);
            this.availableTypes = ticketHelpers.getAvailableTicketTypes(this.status.isWebsiteOnline);
        }, 100);
        
        if (false === this.status.hasMostRecentFolder) {
            const currentPartner = await readyState.getCurrentPartnerState();
            const salesforce = await readyState.getSalesforceState();
            if (false === this.status.hasMostRecentFolder) {
                dropboxHelper.getMostRecentFolder(currentPartner.customerCode, salesforce.account.Name);
            }
        }
    }
};
</script>
