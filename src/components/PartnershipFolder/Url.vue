<template>
    <b-container fluid>
        <!-- form -->
        <b-row class="mb-4">
            <b-col lg="4" md="6">
                <ValidationProvider name="URL souhaitée"
                                    :rules="{ required: !currentSite.oldDomain || (!currentSite.domain && !currentSite.needTransfer), min: currentSite.needTransfer ? 0 : 3, max: 255 }"
                                    ref="currentPartner.sites.0.domain"
                                    v-slot="{ validate, classes, errors }">
                    <label class="label">URL souhaitée</label>
                    <div class="input-text">
                        <b-input-group>
                            <b-input-group-append>
                                <b-input-group-text class="pr-0 domain-prefix">
                                    https://www.
                                </b-input-group-text>
                            </b-input-group-append>
                            <div class="input-text-field">
                                <b-form-input
                                    v-model="currentSite.domain"
                                    :class="false === isDomainAvailable ? 'is-invalid' : classes"
                                    class="pl-1"
                                    :disabled="!identity.allowedToEdit"
                                    :readonly="!identity.allowedToEdit"
                                    name="currentPartner.sites.0.domain"
                                    type="text"
                                    @blur="onBlur($event, { site: currentSite }, 'domain')"
                                    @focus="onFocus"
                                ></b-form-input>
                                <TextLengthMessage
                                    :value="!currentSite || currentSite.domain"
                                    maxlength="255"
                                />
                            </div>
                        </b-input-group>
                    </div>
                    <vue-progress-bar id="domain-progress" v-if="isDomainProgressBarActive"/>
                    <small
                        v-if="false === isDomainAvailable"
                        class="is-invalid"
                    >
                        Le nom de domaine n'est pas disponible
                    </small>
                    <small
                        v-if="isDomainAvailable && showIsAvailable"
                        :class="classes"
                    >
                        Le nom de domaine est disponible
                    </small>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
            <b-col lg="4" md="6">
                <ValidationProvider name="URL existante"
                                    :rules="{ required: !currentPartner.sites[0].domain || !!currentPartner.sites[0].oldDomain, min: 3, max: 255 }"
                                    ref="currentPartner.sites.0.oldDomain"
                                    v-slot="{ validate, classes, errors }">
                    <label class="label">URL existante</label>
                    <div class="input-text">
                        <b-form-input
                            type="text"
                            @focus="onFocus"
                            @blur="onBlur($event, { site: currentPartner.sites[0] })"
                            name="currentPartner.sites.0.oldDomain"
                            :class="classes"
                            :disabled="!identity.allowedToEdit"
                            :readonly="!identity.allowedToEdit"
                            v-model="currentPartner.sites[0].oldDomain"
                        ></b-form-input>
                        <TextLengthMessage
                            :value="!currentSite || currentSite.oldDomain"
                            maxlength="255"
                        />
                    </div>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
            <b-col lg="4" md="6">
                <ValidationProvider name="URL à transférer" ref="currentPartner.sites.0.needTransfer"
                                    v-slot="{ validate, classes, errors }">
                    <b-form-checkbox
                        type="checkbox"
                        @focus="onFocus"
                        @change.native="onNeedTransferChange($event, { site: currentPartner.sites[0], type: 'bool' })"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                        name="currentPartner.sites.0.needTransfer"
                        v-model="currentPartner.sites[0].needTransfer"
                    >
                    URL à transférer
                    </b-form-checkbox>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
        <div v-if="currentPartner.sites[0].needTransfer">
            <b-row class="mb-4">
                <b-col md="1">
                    <label>Registrar</label>
                </b-col>
                <b-col md="2">
                    <ValidationProvider name="registrar" rules="" ref="currentPartner.sites.0.registrar"
                                        v-slot="{ validate, classes, errors }">
                        <b-form-radio-group
                            type="radio"
                            v-model="currentPartner.sites[0].registrar"
                            name="currentPartner.sites.0.registrar"
                            @focus="onFocus"
                            @change.native="onBlur($event, { site: currentPartner.sites[0], type: 'bool' })"
                        >
                            <b-form-radio :value="true">OVH</b-form-radio>
                            <b-form-radio :value="false">Autre</b-form-radio>
                        </b-form-radio-group>
                    </ValidationProvider>
                </b-col>
                <b-col v-if="false === currentPartner.sites[0].registrar" md="3">
                    <ValidationProvider name="Autre registrar" rules="" ref="currentPartner.sites.0.otherRegistrar"
                                        v-slot="{ validate, classes, errors }">
                        <b-form-input
                            v-model="currentPartner.sites[0].otherRegistrar"
                            name="currentPartner.sites.0.otherRegistrar"
                            type="text"
                            @blur="onBlur($event, { site: currentPartner.sites[0] })"
                            @focus="onFocus"
                        />
                    </ValidationProvider>
                </b-col>
                <b-col md="6">
                    Pour connaître votre registrar
                    <a class="ml-2 redirect-link" :href="registrarUrl" target="_blank">
                        <img alt="" src="../../assets/link-button.svg"/>
                        <span class="text">CLIQUEZ ICI</span>
                    </a>
                </b-col>
            </b-row>
            <b-row class="mb-4">
                <b-col>
                    <label>Adresses mails associées</label>
                    <b-row>
                        <b-col md="1">
                            <ValidationProvider name="Autre registrar" rules="" ref="currentPartner.sites.0.registrarEmail"
                                                v-slot="{ validate, classes, errors }">
                                <b-form-radio-group
                                    v-model="currentPartner.sites[0].registrarEmail"
                                    name="currentPartner.sites.0.registrarEmail"
                                    type="radio"
                                    @change.native="onBlur($event, { site: currentPartner.sites[0], type: 'bool' })"
                                    @focus="onFocus"
                                    stacked
                                >
                                    <b-form-radio :value="true">Oui</b-form-radio>
                                    <b-form-radio :value="false">Non</b-form-radio>
                                </b-form-radio-group>
                            </ValidationProvider>
                        </b-col>
                        <b-col v-if="currentPartner.sites[0].registrarEmail" md="4">
                            <ValidationProvider name="Autre registrar" rules="" ref="currentPartner.sites.0.associatedEmails"
                                                v-slot="{ validate, classes, errors }">
                                <b-form-tags
                                    @input="onTagsChange($event, { site: currentPartner.sites[0] }, 'associatedEmails')"
                                    :tag-validator="validator"
                                    :disabled="!identity.allowedToEdit"
                                    :readonly="!identity.allowedToEdit"
                                    tag-variant="local-orange"
                                    size="md"
                                    placeholder="Ajouter un mail. Valider à chaque fois avec la touche Entrer."
                                    :class="classes"
                                    remove-on-delete
                                    name="currentPartner.sites.0.associatedEmails"
                                    v-model="currentPartner.sites[0].associatedEmails"
                                    invalid-tag-text="L'email saisie n'est pas valide"
                                ></b-form-tags>
                                <small :class="classes">{{ errors[0] }}</small>
                            </ValidationProvider>
                        </b-col>
                    </b-row>
                </b-col>
            </b-row>
            <b-row class="mb-4">
                <b-col>
                    <p>Avez-vous un paramétrage spécifique pour vos emails ?</p>
                    <p>(Exemple : cas d’adresses mails gérées chez Google ou Office 365, offre exchange, ou tout autre
                        spécificité sur vos offres mails...)</p>
                    <b-row class="mb-4">
                        <b-col md="3">
                            <ValidationProvider name="Autre registrar" rules="" ref="currentPartner.sites.0.specificParameters"
                                                v-slot="{ validate, classes, errors }">
                                <b-form-radio-group
                                    v-model="currentPartner.sites[0].specificParameters"
                                    name="currentPartner.sites.0.specificParameters"
                                    type="radio"
                                    @change.native="onBlur($event, { site: currentPartner.sites[0], type: 'bool' })"
                                    @focus="onFocus"
                                    stacked
                                >
                                    <b-form-radio :value="true">Oui</b-form-radio>
                                    <b-form-radio :value="false">Non</b-form-radio>
                                </b-form-radio-group>
                            </ValidationProvider>
                        </b-col>
                    </b-row>
                    <b-row v-if="currentPartner.sites[0].specificParameters">
                        <b-col>
                            <label>Sélectionnez votre service de messagerie</label>
                            <b-row>
                                <b-col md="2">
                                    <ValidationProvider name="Paramétrage spécifique" rules="" ref="currentPartner.sites.0.specificParameterDetails"
                                                        v-slot="{ validate, classes, errors }">
                                        <b-form-radio-group
                                            v-model="checkedParameter"
                                            name="currentPartner.sites.0.specificParameterDetails"
                                            :options="specificParameterChoices"
                                            type="radio"
                                            @change.native="onBlur($event, { site: currentPartner.sites[0] })"
                                            @focus="onFocus"
                                            stacked
                                        >
                                        </b-form-radio-group>
                                    </ValidationProvider>
                                </b-col>
                                <b-col v-if="'Autre' === checkedParameter" class="align-end" md="3">
                                    <ValidationProvider name="Autre paramétrage"
                                                        v-slot="{ validate, classes, errors }">
                                        <b-form-input
                                            v-model="otherSpecifics"
                                            name="currentPartner.sites.0.specificParameterDetails"
                                            type="text"
                                            @blur="onBlur($event, { site: currentPartner.sites[0] }, 'specificParameterOther')"
                                            @focus="onFocus"
                                        />
                                    </ValidationProvider>
                                </b-col>
                            </b-row>
                        </b-col>
                    </b-row>
                </b-col>
            </b-row>
        </div>
    </b-container>
</template>

<script>
import dpMixin from "../../mixins/dp-mixin";
import { mapActions, mapState } from "vuex";
import { store } from '@/_store';
import { validateSection, normalizer } from "@/_helpers";
import { ovhService } from "@/_services";
import { specificParameterChoices, registrarLevelsMapping } from "../../Interface/partnershipFolderDatas";
import TextLengthMessage from './TextLengthMessage';

require('../../assets/style/Pfolder/partnership-folder.css');

export default {
    name: 'Url',
    mixins: [dpMixin],
    components: {
        TextLengthMessage
    },
    data() {
        return {
            specificParameterChoices,
            registrarLevelsMapping,
            otherSpecificParams: null,
            checkedParameter: null,
            registrarUrl: process.env.REGISTRAR_URL,
            isDomainAvailable: null,
            showIsAvailable: false,
            mappingFields: {
                oldDomain: 'URL_transferer__c',
                needTransfer: 'NDD_transf_rer__c',
                registrar: 'Registrar__c',
                otherRegistrar: 'Registrar__c',
                registrarEmail: 'Adresses_Mail_liees_coche__c',
                associatedEmails: 'Adresses_Mail_liees__c',
                specificParameters: 'Offres_sp_cifiques_exchange__c',
                specificParameterDetails: 'Offres_sp_cifiques_autre__c',
                specificParameterOther: 'Offres_sp_cifiques_autre__c',
            },
            isDomainProgressBarActive: false,
        };
    },
    computed: {
        ...mapState('account', ['identity', 'currentPartner']),
        ...mapState('globalStore', ['salesforce']),
        otherSpecifics: {
            get() {
                return this.otherSpecificParams;
            },
            set(value) {
                this.otherSpecificParams = value;
            }
        }
    },
    methods: {
        ...mapActions('account', ['updatePartnerPropertyFromForm']),
        onFocus(event) {
            this.previousEditedValue = event.target.value;
        },
        onBlur(event, data, offset = null) {
            if (offset && 'domain' === offset) {
                if (!this.currentSite ||
                    (!this.currentSite.domain && !this.currentSite.needTransfer) ||
                    this.previousEditedValue === this.currentSite.domain
                ) {
                    return;
                }

                if (!this.currentSite.domain) {
                    return this.updateAndVerifyFields(event, data, offset);
                }
                this.isDomainAvailable = null;
                this.isDomainProgressBarActive = true;
                this.$Progress.start();
                this.checkDomainAvailability()
                    .then(isAvailable => {
                        if (isAvailable) {
                            this.showIsAvailable = true;
                            setTimeout(() => {
                                this.showIsAvailable = false;
                            }, 60000);
                            this.updateAndVerifyFields(event, data);
                        }
                    }).catch((error) => {
                        this.$Progress.fail();
                        console.error(error);
                        store.dispatch('alert/error', {
                            group: 'auth-error',
                            message: 'Une erreur s\'est produite lors de la vérification du nom de domain',
                            show: true,
                            title: 'Erreur d\'API',
                            type: 'error'
                        }, {root: true});
                    }).finally(() => {
                        this.$Progress.finish();
                        this.isDomainProgressBarActive = false;
                    });
            } else {
                this.updateAndVerifyFields(event, data, offset);
            }
        },
        updateAndVerifyFields(event, data, offset) {
            let provider = this.$refs[event.target.name];
            this.updatePartnerPropertyFromForm({
                event: event,
                provider: provider[0] || provider,
                data: data ? Object.assign({ previousEditedValue: this.previousEditedValue }, data) : undefined
            });
            this.updateRegistrarTask(event, data, offset);
            this.verifyFields();
        },
        onTagsChange(value, data, offset) {
            data.value = value;
            data.offset = offset;
            this.updatePartnerPropertyFromForm({ data });
            this.updateRegistrarTask(event, data, offset);
        },
        onNeedTransferChange(event, data) {
            this.onBlur(event, data);
            this.updatePartnerPropertyFromForm({
                data: {
                    opportunity: this.salesforce.opportunity,
                    offset: 'Domaine_transf_rer__c',
                    value: event.target.checked,
                },
                showNotification: false
            });
        },
        async validateFields(refs, entity) {
            if (!this.readyState.allowedToEdit) {
                return;
            }
            let isValid = true;

            const { oldDomain, domain } = entity.currentPartner.sites[0];
            if (!oldDomain && !domain) {
                await refs['currentPartner.sites.0.domain'].validate();
                await refs['currentPartner.sites.0.oldDomain'].validate();
                isValid = false;
            }

            validateSection.displayColorStateOnSection('url', isValid);
        },
        validator(tag) {
            return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(tag);
        },
        isOtherParametersChecked() {
            if (!(this.currentPartner && this.currentPartner.sites.length)) {
                return; 
            }

            const specificParams = this.currentPartner.sites[0].specificParameterDetails;
            return specificParams && !this.specificParameterChoices
                .some(specificParameterChoice => specificParameterChoice.value === specificParams);
        },
        checkDomainAvailability() {
            return ovhService
                .checkDomainAvailability(this.currentSite.domain)
                .then(response => {
                    this.isDomainAvailable = response && response.available;
                    return this.isDomainAvailable;
                })
        },
        updateRegistrarTask(event, data, offset) {
            if (!this.salesforce || !this.salesforce.taskTracking || !this.salesforce.taskTracking.Id) {
                return;
            }

            offset = offset || event.target.name.split('.').slice(-1)[0];
            const fieldname = this.mappingFields[offset];
            if (!fieldname) {
                return;
            }

            let dataToUpdate = {
                taskTracking: this.salesforce.taskTracking,
                offset: fieldname,
            };
            let value = event.target.value;

            switch (offset) {
                case 'registrar':
                    const isOvh = normalizer.booleanNormalizer(value);
                    value = isOvh ? 'OVH' : this.currentPartner.sites[0].otherRegistrar;
                    delete data.type;
                    break;
                case 'registrarEmail':
                    let hasRegistrarEmail = normalizer.booleanNormalizer(value);
                    if (hasRegistrarEmail) {
                        this.updatePartnerPropertyFromForm({
                            data: {
                                taskTracking: this.salesforce.taskTracking,
                                offset: this.mappingFields.associatedEmails,
                                value: this.currentPartner.sites[0].associatedEmails.join(', '),
                                showNotification: false,
                            },
                            showNotification: false
                        });
                    }
                    break;
                case 'associatedEmails':
                    value = this.currentPartner.sites[0].associatedEmails.join(', ');
                    break;
                case 'needTransfer':
                    if (event.target.checked) {
                        this.updatePartnerPropertyFromForm({
                            data: {
                                taskTracking: this.salesforce.taskTracking,
                                offset: this.mappingFields.oldDomain,
                                value: this.currentPartner.sites[0].oldDomain,
                            },
                            showNotification: false
                        });
                    }
                    break;
                case 'specificParameters':
                    const hasSpecificParameters = normalizer.booleanNormalizer(value);
                    this.updatePartnerPropertyFromForm({
                        data: {
                            taskTracking: this.salesforce.taskTracking,
                            offset: this.mappingFields.specificParameterDetails,
                            value: hasSpecificParameters ? this.currentPartner.sites[0].specificParameterDetails : null,
                        },
                        showNotification: false
                    });
                    break;
                case 'specificParameterDetails':
                    const isOtherSpecificParameters = 'Autre' === value;
                    this.updatePartnerPropertyFromForm({
                        data: {
                            taskTracking: this.salesforce.taskTracking,
                            offset: this.mappingFields.specificParameterOther,
                            value: isOtherSpecificParameters ? null : value,
                        },
                        showNotification: false
                    });
                    return;
            }

            if (data.type) {
                dataToUpdate.type = data.type;
                if ('bool' === data.type) {
                    if ('checkbox' === event.target.type) {
                        value = event.target.checked;
                    }
                    value = normalizer.booleanNormalizer(value);
                }
            }

            if (['registrar', 'registrarEmail', 'specificParameters'].includes(offset)) {
                let { registrar, registrarEmail, specificParameters } = this.currentPartner.sites[0];
                registrar = registrar ? 'OVH' : 'other';
                const level = this.registrarLevelsMapping.findIndex((expectedValues) => {
                    return (undefined === expectedValues.registrar || ('OVH' === expectedValues.registrar) === ('OVH' === registrar)) &&
                        (undefined === expectedValues.registrarEmail || expectedValues.registrarEmail === registrarEmail) &&
                        (expectedValues.specificParameters === specificParameters)
                }) + 1;
                if (level > 0) {
                    dataToUpdate.payload = {
                        Niveau_de_Transfert__c: `Niveau ${level}`
                    };
                    dataToUpdate.payload[fieldname] = value;
                }
            }
            dataToUpdate.value = value;

            this.updatePartnerPropertyFromForm({
                data: dataToUpdate,
                showNotification: false,
            })
        }
    },
    mounted() {
        if (this.currentPartner && this.currentPartner.sites.length) {
            if (this.isOtherParametersChecked()) {
                this.checkedParameter = 'Autre';
                this.otherSpecificParams = this.currentPartner.sites[0].specificParameterDetails;
            } else {
                this.checkedParameter = this.currentPartner.sites[0].specificParameterDetails;
            }
        }
    }
}
</script>
