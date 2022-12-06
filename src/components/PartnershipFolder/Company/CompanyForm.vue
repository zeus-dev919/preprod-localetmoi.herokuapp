<template>
    <b-container fluid>
        <!-- your company -->
        <b-row class="my-3">
            <b-col lg="4" md="6" sm="12">
                <ValidationProvider name="Enseigne" rules="required|min:3|max:255" ref="salesforce.account.Name"
                                    v-slot="{ validate, classes, errors }">
                    <label class="label">Enseigne</label>
                    <div class="input-text">
                        <b-form-input
                            @focus="onFocus"
                            @blur="onBlur($event, { account: salesforce.account })"
                            type="text"
                            :class="classes"
                            name="salesforce.account.Name"
                            v-model="salesforce.account.Name"
                            :disabled="!identity.allowedToEdit"
                            :readonly="!identity.allowedToEdit"
                        ></b-form-input>
                        <TextLengthMessage
                            :value="!salesforce || salesforce.account.Name"
                            maxlength="255"
                        />
                    </div>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
            <b-col lg="4" md="6" sm="12">
                <label class="label">Raison sociale</label>
                <div class="input-text">
                    <b-form-input
                        @focus="onFocus"
                        type="text"
                        name="salesforce.account.Raison_sociale__c"
                        v-model="salesforce.account.Raison_sociale__c"
                        disabled
                    ></b-form-input>
                </div>
            </b-col>
            <b-col lg="4" md="6" sm="12">
                <label class="label">Forme de la société</label>
                <b-form-select
                    type="select"
                    v-model="salesforce.account.Ownership"
                    :options="companyFormList"
                    disabled
                    name="salesforce.account.Ownership">
                </b-form-select>
            </b-col>
            <b-col lg="4" md="6" sm="12">
                <ValidationProvider name="Code APE" rules="required" ref="salesforce.account.Code_Ape__c"
                                    v-slot="{ validate, classes, errors }">
                    <label class="label">Code APE</label>
                    <b-form-select
                        type="select"
                        @change.native="onBlur($event, { account: salesforce.account })"
                        name="salesforce.account.Code_Ape__c"
                        v-model="salesforce.account.Code_Ape__c"
                        :options="apeCodeList"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                    ></b-form-select>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
            <b-col lg="4" md="6" sm="12">
                <ValidationProvider name="Secteur d'activité" rules="required" ref="salesforce.account.Industry"
                                    v-slot="{ validate, classes, errors }">
                    <label class="label">Secteur d'activité</label>
                    <b-form-select
                        type="select"
                        @change.native="onBlur($event, { account: salesforce.account })"
                        name="salesforce.account.Industry"
                        v-model="salesforce.account.Industry"
                        :options="industries"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                    ></b-form-select>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
            <b-col lg="4" md="6" sm="12">
                <ValidationProvider name="Siret" rules="required|min:14|siretValidation"
                                    ref="salesforce.account.Siren__c"
                                    v-slot="{ validate, classes, errors }">
                    <label class="label">Siret</label>
                    <b-form-input
                        @focus="onFocus"
                        @blur="onSiretBlur($event, { account: salesforce.account })"
                        type="text"
                        :class="classes"
                        name="salesforce.account.Siren__c"
                        v-model="salesforceSiret"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                    ></b-form-input>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
        <b-row class="my-3">
            <b-col lg="4" md="6" sm="12">
                <ValidationProvider name="Adresse" rules="required|min:3|max:255" ref="salesforce.account.BillingStreet"
                                    v-slot="{ validate, classes, errors }">
                    <label class="label">Adresse</label>
                    <div class="input-text">
                        <b-form-input
                            @focus="onFocus"
                            @blur="onBlur($event, { account: salesforce.account })"
                            type="text"
                            :class="classes"
                            name="salesforce.account.BillingStreet"
                            v-model="salesforce.account.BillingStreet"
                            :disabled="!identity.allowedToEdit"
                            :readonly="!identity.allowedToEdit"
                        ></b-form-input>
                        <TextLengthMessage
                            :value="!salesforce || salesforce.account.BillingStreet"
                            maxlength="255"
                        />
                    </div>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
            <b-col lg="4" md="6" sm="12">
                <ValidationProvider name="Code postal" rules="required|integer|max:20"
                                    ref="salesforce.account.BillingPostalCode"
                                    v-slot="{ validate, classes, errors }">
                    <label class="label">Code postal</label>
                    <div class="input-text">
                        <b-form-input
                            @focus="onFocus"
                            @blur="onBlur($event, { account: salesforce.account })"
                            type="number"
                            :class="classes"
                            name="salesforce.account.BillingPostalCode"
                            v-model="salesforce.account.BillingPostalCode"
                            :disabled="!identity.allowedToEdit"
                            :readonly="!identity.allowedToEdit"
                        ></b-form-input>
                        <TextLengthMessage
                            :value="!salesforce || salesforce.account.BillingPostalCode"
                            maxlength="20"
                        />
                    </div>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
            <b-col lg="4" md="6" sm="12">
                <ValidationProvider name="Ville" rules="required|min:3|max:40" ref="salesforce.account.BillingCity"
                                    v-slot="{ validate, classes, errors }">
                    <label class="label">Ville</label>
                    <div class="input-text">
                        <b-form-input
                            @focus="onFocus"
                            @blur="onBlur($event, { account: salesforce.account })"
                            type="text"
                            :class="classes"
                            name="salesforce.account.BillingCity"
                            v-model="salesforce.account.BillingCity"
                            :disabled="!identity.allowedToEdit"
                            :readonly="!identity.allowedToEdit"
                        >
                        </b-form-input>
                        <TextLengthMessage
                            :value="!salesforce || salesforce.account.BillingCity"
                            maxlength="40"
                        />
                    </div>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
        <b-row class="my-3">
            <b-col lg="4" md="6" sm="12">
                <ValidationProvider name="Prénom" rules="required|min:2|max:255" ref="salesforce.contact.FirstName"
                                    v-slot="{ validate, classes, errors }">
                    <label class="label">Prénom</label>
                    <div class="input-text">
                        <b-form-input
                            @focus="onFocus"
                            @blur="onBlur($event, { contact: salesforce.contact })"
                            type="text"
                            :class="classes"
                            name="salesforce.contact.FirstName"
                            v-model="salesforce.contact.FirstName"
                            :disabled="!identity.allowedToEdit"
                            :readonly="!identity.allowedToEdit"
                        ></b-form-input>
                        <TextLengthMessage
                            :value="!salesforce || salesforce.contact.FirstName"
                            maxlength="255"
                        />
                    </div>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
            <b-col lg="4" md="6" sm="12">
                <ValidationProvider name="Nom" rules="required|min:2|max:255" ref="salesforce.contact.LastName"
                                    v-slot="{ validate, classes, errors }">
                    <label class="label">Nom</label>
                    <div class="input-text">
                        <b-form-input
                            @focus="onFocus"
                            @blur="onBlur($event, { contact: salesforce.contact })"
                            type="text"
                            :class="classes"
                            name="salesforce.contact.LastName"
                            v-model="salesforce.contact.LastName"
                            :disabled="!identity.allowedToEdit"
                            :readonly="!identity.allowedToEdit"
                        ></b-form-input>
                        <TextLengthMessage
                            :value="!salesforce || salesforce.contact.LastName"
                            maxlength="255"
                        />
                    </div>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
            <b-col lg="4" md="6" sm="12">
                <ValidationProvider name="Date de naissance" rules="min:3" ref="salesforce.contact.Birthdate"
                                    v-slot="{ validate, classes, errors }">
                    <label class="label">Date de naissance</label>
                    <b-form-input
                        @focus="onFocus"
                        @blur="onBlur($event, { contact: salesforce.contact })"
                        type="date"
                        :class="classes"
                        name="salesforce.contact.Birthdate"
                        v-model="salesforce.contact.Birthdate"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                        placeholder="Aucune date sélectionnée"
                    ></b-form-input>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
            <b-col lg="4" md="6" sm="12">
                <ValidationProvider name="Email" rules="required|min:8|max:255|email" ref="salesforce.contact.Email"
                                    v-slot="{ validate, classes, errors }">
                    <label class="label">Email</label>
                    <div class="input-text">
                        <b-form-input
                            @focus="onFocus"
                            @blur="onBlur($event, { contact: salesforce.contact })"
                            type="email"
                            :class="classes"
                            name="salesforce.contact.Email"
                            v-model="salesforce.contact.Email"
                            :disabled="!identity.allowedToEdit"
                            :readonly="!identity.allowedToEdit"
                        ></b-form-input>
                        <TextLengthMessage
                            :value="!salesforce || salesforce.contact.Email"
                            maxlength="255"
                        />
                    </div>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
            <b-col lg="4" md="6" sm="12">
                <ValidationProvider name="Téléphone" :rules="{ expectedValidPhone: salesforce.account.Phone }" ref="salesforce.account.Phone"
                                    v-slot="{ validate, classes, errors, failedRules }">
                    <label class="label">Téléphone</label>
                    <b-form-input
                        @focus="onFocus"
                        @blur="onBlur($event, { account: salesforce.account })"
                        type="tel"
                        :class="classes"
                        name="salesforce.account.Phone"
                        v-model="salesforce.account.Phone"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                    ></b-form-input>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
            <b-col lg="4" md="6" sm="12">
                <ValidationProvider name="Date de création" rules="min:3"
                                    ref="salesforce.account.Date_de_cr_ation__c"
                                    v-slot="{ validate, classes, errors }">
                    <label class="label">Date de création</label>
                    <b-form-input
                        @focus="onFocus"
                        @blur="onBlur($event, { account: salesforce.account })"
                        type="date"
                        :class="classes"
                        name="salesforce.account.Date_de_cr_ation__c"
                        v-model="salesforce.account.Date_de_cr_ation__c"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                        placeholder="Aucune date sélectionnée"
                    ></b-form-input>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import { siretValidation, validateSection } from "../../../_helpers";

require('../../../assets/style/Pfolder/partnership-folder.css');

import TextLengthMessage from '../TextLengthMessage';
import { mapState, mapActions } from 'vuex';
import { companyFormList } from '../../../Interface/companyFormList';
import { apeCodeList } from '../../../Interface/apeCode';
import { industries } from '../../../Interface/industries';
import { extend } from "vee-validate";
import dpMixin from '../../../mixins/dp-mixin';

// Custom validator for Siret number
extend('siretValidation', {
    validate(value) {
        return siretValidation.validateSiret(value);
    },
    message: 'Le numéro siret est invalide'
});

export default {
    name: 'CompanyForm',
    mixins: [
        dpMixin
    ],
    components: {
        TextLengthMessage
    },
    data() {
        return {
            companyFormList,
            apeCodeList,
            industries,
            previousEditedValue: null,
        }
    },
    computed: {
        ...mapState('account', ['identity', 'currentPartner']),
        ...mapState('globalStore', ['salesforce', 'status']),
        salesforceSiret: {
            get() {
                if (null === this.salesforce.account.Siren__c || null === this.salesforce.account.Nic__c) {
                    return null;
                } else {
                    return this.salesforce.account.Siren__c + this.salesforce.account.Nic__c;
                }
            },
            set(value) {
                if (value) {
                    this.salesforce.account.Siren__c = value.substring(0, 9);
                    this.salesforce.account.Nic__c = value.substring(9);
                }
            }
        }
    },
    methods: {
        ...mapActions('account', ['updatePartnerPropertyFromForm']),
        onFocus(event) {
            this.previousEditedValue = event.target.value;
        },
        onBlur(event, data) {
            let provider = this.$refs[event.target.name];
            this.updatePartnerPropertyFromForm({
                event: event,
                provider: provider[0] || provider,
                data: data ? Object.assign({ previousEditedValue: this.previousEditedValue }, data) : undefined
            }).then(() => this.verifyFields());
        },
        onSiretBlur(event, data) {
            data.payload = {
                Siren__c: this.salesforce.account.Siren__c,
                Nic__c: this.salesforce.account.Nic__c
            };
            this.onBlur(event, data);
        },
        async validateFields(refs, entity) {
            if (!this.readyState.allowedToEdit) {
                return;
            }

            let isValid = await validateSection.validateRequiredFields(entity, refs, 'Siren__c');
            if (isValid) {
                isValid = !!this.salesforceSiret && siretValidation.validateSiret(this.salesforceSiret);
                if (!isValid) {
                    await this.$refs['salesforce.account.Siren__c'].validate();
                }
            }
            
            validateSection.displayColorStateOnSection('company-form', isValid);
        },
    }
}
</script>
