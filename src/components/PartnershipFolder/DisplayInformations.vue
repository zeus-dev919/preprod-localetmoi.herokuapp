<template>
    <b-container fluid>
        <!-- details -->
        <b-row class="mb-3">
            <b-col>
                <span class="form-description">Coordonnées</span>
                <span class="error">(Cocher les informations à afficher)</span>
            </b-col>
        </b-row>
        <b-row>
            <b-col md="6" sm="12">
                <b-row>
                    <b-col sm="4">
                        <ValidationProvider name="checkedCompanyName" ref="currentPartner.sites[0].displayCompanyName"
                                            v-slot="{ validate, classes, errors }">
                            <label>
                                <b-form-checkbox
                                    @change.native="onBlur($event, { site: currentPartner.sites[0], type: 'bool' })"
                                    type="checkbox"
                                    name="currentPartner.sites[0].displayCompanyName"
                                    v-model="currentPartner.sites[0].displayCompanyName"
                                    :disabled="!allowedToEdit"
                                >
                                    Enseigne
                                </b-form-checkbox>
                            </label>
                            <small :class="classes">{{ errors[0] }}</small>
                        </ValidationProvider>
                    </b-col>
                    <b-col sm="8">
                        <ValidationProvider name="Enseigne"
                                            :rules="{ required: currentPartner.sites[0].displayCompanyName, requiredCheckedField: { checked: currentPartner.sites[0].displayCompanyName }, min: 3, max: 255 }"
                                            ref="salesforce.account.Name"
                                            v-slot="{ validate, classes, errors }">
                            <div class="input-text">
                                <b-form-input
                                    @focus="onFocus"
                                    @blur="onBlur($event, { account: salesforce.account })"
                                    type="text"
                                    :class="classes"
                                    name="salesforce.account.Name"
                                    v-model="salesforce.account.Name"
                                    :disabled="!identity.allowedToEdit || !currentPartner.sites[0].displayCompanyName"
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
                </b-row>
            </b-col>
        </b-row>
        <b-row>
            <b-col md="6" sm="12">
                <b-row>
                    <b-col sm="4">
                        <ValidationProvider name="checkedFirstName" ref="currentPartner.sites[0].displayFirstname"
                                            v-slot="{ validate, classes, errors }">
                            <label>
                                <b-form-checkbox
                                    @change.native="onBlur($event, { site: currentPartner.sites[0], type: 'bool' })"
                                    type="checkbox"
                                    name="currentPartner.sites[0].displayFirstname"
                                    v-model="currentPartner.sites[0].displayFirstname"
                                    :disabled="!allowedToEdit"
                                >
                                    Prénom
                                </b-form-checkbox>
                            </label>
                            <small :class="classes">{{ errors[0] }}</small>
                        </ValidationProvider>
                    </b-col>
                    <b-col sm="8">
                        <ValidationProvider name="Prénom"
                                            :rules="{ required: currentPartner.sites[0].displayFirstname, requiredCheckedField: { checked: currentPartner.sites[0].displayFirstname }, min: 2, max: 255 }"
                                            ref="salesforce.contact.FirstName"
                                            v-slot="{ validate, classes, errors }">
                            <div class="input-text">
                                <b-form-input
                                    @focus="onFocus"
                                    @blur="onBlur($event, { contact: salesforce.contact })"
                                    type="text"
                                    name="salesforce.contact.FirstName"
                                    :class="classes"
                                    v-model="salesforce.contact.FirstName"
                                    :disabled="!allowedToEdit || !currentPartner.sites[0].displayFirstname"
                                    :readonly="!allowedToEdit"
                                ></b-form-input>
                                <TextLengthMessage
                                    :value="!salesforce || salesforce.account.FirstName"
                                    maxlength="255"
                                />
                            </div>
                            <small :class="classes">{{ errors[0] }}</small>
                        </ValidationProvider>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col sm="4">
                        <ValidationProvider name="checkedLastName"
                                            ref="currentPartner.sites[0].displayLastname"
                                            v-slot="{ validate, classes, errors }">
                            <label>
                                <b-form-checkbox
                                    @change.native="onBlur($event, { site: currentPartner.sites[0], type: 'bool' })"
                                    type="checkbox"
                                    name="currentPartner.sites[0].displayLastname"
                                    v-model="currentPartner.sites[0].displayLastname"
                                    :disabled="!allowedToEdit"
                                    :readonly="!allowedToEdit"
                                >
                                    Nom
                                </b-form-checkbox>
                            </label>
                            <small :class="classes">{{ errors[0] }}</small>
                        </ValidationProvider>
                    </b-col>
                    <b-col sm="8">
                        <ValidationProvider name="Nom de famille"
                                            :rules="{ required: currentPartner.sites[0].displayLastname, requiredCheckedField: { checked: currentPartner.sites[0].displayLastname }, min: 2, max: 255 }"
                                            ref="salesforce.contact.LastName"
                                            v-slot="{ validate, classes, errors }">
                            <div class="input-text">
                                <b-form-input
                                    @focus="onFocus"
                                    @blur="onBlur($event, { contact: salesforce.contact })"
                                    type="text"
                                    name="salesforce.contact.LastName"
                                    :class="classes"
                                    v-model="salesforce.contact.LastName"
                                    :disabled="!allowedToEdit || !currentPartner.sites[0].displayLastname"
                                    :readonly="!allowedToEdit"
                                ></b-form-input>
                                <TextLengthMessage
                                    :value="!salesforce || salesforce.contact.LastName"
                                    maxlength="255"
                                />
                            </div>
                            <small :class="classes">{{ errors[0] }}</small>
                        </ValidationProvider>
                    </b-col>
                </b-row>
            </b-col>
            <b-col md="6" sm="12">
                <b-row>
                    <b-col sm="4">
                        <ValidationProvider name="checkedPhone"
                                            ref="currentPartner.sites[0].displayPhone"
                                            v-slot="{ validate, classes, errors }">
                            <label>
                                <b-form-checkbox
                                    @change.native="onBlur($event, { site: currentPartner.sites[0], type: 'bool' })"
                                    type="checkbox"
                                    name="currentPartner.sites[0].displayPhone"
                                    v-model="currentPartner.sites[0].displayPhone"
                                    :disabled="!allowedToEdit"
                                    :readonly="!allowedToEdit"
                                >
                                    Téléphone fixe
                                </b-form-checkbox>
                            </label>
                            <small :class="classes">{{ errors[0] }}</small>
                        </ValidationProvider>
                    </b-col>
                    <b-col sm="8">
                        <ValidationProvider name="Téléphone fixe"
                                            :rules="{ required: !salesforce.contact.MobilePhone, requiredCheckedField: { checked: currentPartner.sites[0].displayPhone }, expectedValidPhone: salesforce.contact.MobilePhone }"
                                            ref="salesforce.contact.Phone"
                                            v-slot="{ validate, classes, errors }">
                            <b-form-input
                                @focus="onFocus"
                                @blur="onBlur($event, { contact: salesforce.contact })"
                                type="text"
                                name="salesforce.contact.Phone"
                                :class="classes"
                                v-model="salesforce.contact.Phone"
                                :disabled="!allowedToEdit || !currentPartner.sites[0].displayPhone"
                                :readonly="!allowedToEdit"
                            ></b-form-input>
                            <small :class="classes">{{ errors[0] }}</small>
                        </ValidationProvider>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col sm="4">
                        <ValidationProvider name="checkedCellphone"
                                            ref="currentPartner.sites[0].displayCellphone"
                                            v-slot="{ validate, classes, errors }">
                            <label>
                                <b-form-checkbox
                                    @change.native="onBlur($event, { site: currentPartner.sites[0], type: 'bool' })"
                                    type="checkbox"
                                    name="currentPartner.sites[0].displayCellphone"
                                    v-model="currentPartner.sites[0].displayCellphone"
                                    :disabled="!allowedToEdit"
                                    :readonly="!allowedToEdit"
                                >
                                    Téléphone portable
                                </b-form-checkbox>
                            </label>
                            <small :class="classes">{{ errors[0] }}</small>
                        </ValidationProvider>
                    </b-col>
                    <b-col sm="8">
                        <ValidationProvider name="Téléphone portable"
                                            :rules="{ required: !salesforce.contact.Phone, requiredCheckedField: { checked: currentPartner.sites[0].displayCellphone }, expectedValidPhone: salesforce.account.Phone }"
                                            ref="salesforce.contact.MobilePhone"
                                            v-slot="{ validate, classes, errors }">
                            <b-form-input
                                @focus="onFocus"
                                @blur="onBlur($event, { contact: salesforce.contact })"
                                type="text"
                                name="salesforce.contact.MobilePhone"
                                :class="classes"
                                v-model="salesforce.contact.MobilePhone"
                                :disabled="!allowedToEdit || !currentPartner.sites[0].displayCellphone"
                                :readonly="!allowedToEdit"
                            ></b-form-input>
                            <small :class="classes">{{ errors[0] }}</small>
                        </ValidationProvider>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
        <b-row>
            <b-col md="6" sm="12">
                <b-row>
                    <b-col sm="4">
                        <ValidationProvider name="checkedAddress"
                                            ref="currentPartner.sites[0].displayAddress"
                                            v-slot="{ validate, classes, errors }">
                            <label>
                                <b-form-checkbox
                                    @change.native="onBlur($event, { site: currentPartner.sites[0], type: 'bool' })"
                                    type="checkbox"
                                    name="currentPartner.sites[0].displayAddress"
                                    v-model="currentPartner.sites[0].displayAddress"
                                    :disabled="!allowedToEdit"
                                    :readonly="!allowedToEdit"
                                >
                                    Adresse
                                </b-form-checkbox>
                            </label>
                            <small :class="classes">{{ errors[0] }}</small>
                        </ValidationProvider>
                    </b-col>
                    <b-col sm="8">
                        <ValidationProvider name="Rue"
                                            :rules="{ required: currentPartner.sites[0].displayAddress, requiredCheckedField: { checked: currentPartner.sites[0].displayAddress }, min: 3, max: 255 }"
                                            ref="salesforce.account.BillingStreet"
                                            v-slot="{ validate, classes, errors }">
                            <div class="input-text">
                                <b-form-input
                                    @focus="onFocus"
                                    @blur="onBlur($event, { account: salesforce.account })"
                                    type="text"
                                    name="salesforce.account.BillingStreet"
                                    :class="classes"
                                    v-model="salesforce.account.BillingStreet"
                                    :disabled="!allowedToEdit || !currentPartner.sites[0].displayAddress"
                                    :readonly="!allowedToEdit"
                                ></b-form-input>
                                <TextLengthMessage
                                    :value="!salesforce || salesforce.account.BillingStreet"
                                    maxlength="255"
                                />
                            </div>
                            <small :class="classes">{{ errors[0] }}</small>
                        </ValidationProvider>
                    </b-col>
                </b-row>
            </b-col>
            <b-col xl="6">
                <b-row>
                    <b-col md="2" xl="4">
                        <ValidationProvider name="checkedAddressComplement"
                                            ref="currentPartner.sites[0].displayAddressComplement"
                                            v-slot="{ validate, classes, errors }">
                            <label>
                                <b-form-checkbox
                                    @change.native="onBlur($event, { site: currentPartner.sites[0], type: 'bool' })"
                                    type="checkbox"
                                    name="currentPartner.sites[0].displayAddressComplement"
                                    v-model="currentPartner.sites[0].displayAddressComplement"
                                    :disabled="!allowedToEdit"
                                    :readonly="!allowedToEdit"
                                >
                                    Code postal / ville
                                </b-form-checkbox>
                            </label>
                            <small :class="classes">{{ errors[0] }}</small>
                        </ValidationProvider>
                    </b-col>
                    <b-col md="4" xl="8">
                        <b-row>
                            <b-col sm="4" md="4">
                                <ValidationProvider name="Code postal"
                                                    :rules="{ required: currentPartner.sites[0].displayAddressComplement, requiredCheckedField: { checked: currentPartner.sites[0].displayAddressComplement }, digits: 5 }"
                                                    ref="salesforce.account.BillingPostalCode"
                                                    v-slot="{ validate, classes, errors }">
                                    <b-form-input
                                        @focus="onFocus"
                                        @blur="onBlur($event, { account: salesforce.account })"
                                        type="text"
                                        name="salesforce.account.BillingPostalCode"
                                        :class="classes"
                                        v-model="salesforce.account.BillingPostalCode"
                                        :disabled="!allowedToEdit || !currentPartner.sites[0].displayAddressComplement"
                                        :readonly="!allowedToEdit"
                                    ></b-form-input>
                                    <small :class="classes">{{ errors[0] }}</small>
                                </ValidationProvider>
                            </b-col>
                            <b-col sm="8" md="8">
                                <ValidationProvider name="Ville"
                                                    :rules="{ required: currentPartner.sites[0].displayAddressComplement, requiredCheckedField: { checked: currentPartner.sites[0].displayAddressComplement }, max: 40 }"
                                                    ref="salesforce.account.BillingCity"
                                                    v-slot="{ validate, classes, errors }">
                                    <div class="input-text">
                                        <b-form-input
                                            @focus="onFocus"
                                            @blur="onBlur($event, { account: salesforce.account })"
                                            type="text"
                                            name="salesforce.account.BillingCity"
                                            :class="classes"
                                            v-model="salesforce.account.BillingCity"
                                            :disabled="!allowedToEdit || !currentPartner.sites[0].displayAddressComplement"
                                            :readonly="!allowedToEdit"
                                        ></b-form-input>
                                        <TextLengthMessage
                                            :value="!salesforce || salesforce.account.BillingCity"
                                            maxlength="40"
                                        />
                                    </div>
                                    <small :class="classes">{{ errors[0] }}</small>
                                </ValidationProvider>
                            </b-col>
                        </b-row>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
        <b-row class="my-3" align-v="center">
            <b-col>
                <span class="form-description">Réseaux sociaux</span>
                <span class="error">(Cocher les informations à afficher)</span>
            </b-col>
        </b-row>
        <!-- socialNetworks -->
        <b-row v-for="(item, index) in availableSocialNetworks" :key="item.name">
            <b-col sm="12" md="2">
                <ValidationProvider :name="`checkedSocialNetwork${index}`"
                                    :ref="`currentPartner.socialNetworks.${index}.display`"
                                    v-slot="{ validate, classes, errors }">
                    <b-form-checkbox
                        @change.native="onSocialNetworkCheck($event, { socialNetwork: item, type: 'bool' })"
                        type="checkbox"
                        :name="`currentPartner.socialNetworks.${index}.display`"
                        v-model="item.display"
                        :option="item.name"
                        :disabled="!allowedToEdit"
                        :readonly="!allowedToEdit"
                    >
                        {{ item.name }}
                    </b-form-checkbox>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
            <b-col sm="12" md="4">
                <ValidationProvider :name="`url ${item.name}`"
                                    :rules="{ required: !!item.display }"
                                    :ref="`currentPartner.socialNetworks.${index}.url`"
                                    v-slot="{ validate, classes, errors }">
                    <b-form-input
                        @focus="onFocus"
                        @blur="onSocialNetworkChange($event, { socialNetwork: item })"
                        type="text"
                        :class="classes"
                        :name="`currentPartner.socialNetworks.${index}.url`"
                        v-model="item.url"
                        :disabled="!allowedToEdit || !item.display"
                        :readonly="!allowedToEdit"
                        :placeholder="item.display ? 'URL requise' : ''"
                    ></b-form-input>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
        <b-row>
            <b-col sm="12" md="2">
                <b-form-checkbox
                    type="checkbox"
                    name="socialNetworks[other].display`"
                    v-model="otherSocialNetworkDisplay"
                    :disabled="!allowedToEdit"
                    :readonly="!allowedToEdit"
                >
                    Ajouter un autre site
                </b-form-checkbox>
            </b-col>
            <b-col sm="12" md="4">
                <ValidationProvider name="Autre URL"
                                    :rules="{ required: !!otherSocialNetworkDisplay, max: 255 }"
                                    ref="socialNetworks[other].name"
                                    v-slot="{ validate, classes, errors }">
                    <div class="input-text">
                        <b-form-input
                            @focus="onFocus"
                            @blur="onSocialNetworkChange($event, { socialNetwork: { name: otherSocialNetworkName, display: true } })"
                            type="text"
                            v-model="otherSocialNetworkName"
                            name="socialNetworks[other].name"
                            :placeholder="otherSocialNetworkDisplay ? 'Nom du site' : ''"
                            :disabled="!allowedToEdit || !otherSocialNetworkDisplay"
                            :readonly="!allowedToEdit"
                        ></b-form-input>
                        <TextLengthMessage
                            :value="otherSocialNetworkName"
                            maxlength="40"
                        />
                    </div>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
        <b-row class="my-3">
            <b-col>
                <span class="form-description">Horaires d'ouverture</span>
            </b-col>
        </b-row>
        <!-- schedule -->
        <b-row :class="{'mb-3': !customChoiceError}">
            <b-col>
                <ValidationProvider name="Accueil des clients" ref="currentPartner.sites.0.clientsPhysicallyWelcome"
                                    v-slot="{ validate, classes, errors }">
                    <b-form-checkbox
                        @change.native="onClientsNotWelcomeChecked($event, { site: currentPartner.sites[0], type: 'bool' })"
                        type="checkbox"
                        name="currentPartner.sites.0.clientsPhysicallyWelcome"
                        v-model="clientsNotWelcome"
                        :disabled="!allowedToEdit"
                        :readonly="!allowedToEdit"
                        label="Le professionnel n'accueille pas de clients à l'adresse de son établissement"
                    >
                        Le professionnel n'accueille pas de client à l'adresse de son établissement
                    </b-form-checkbox>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
        <b-row v-if="customChoiceError" class="mb-2">
            <b-col>
                <small class="custom-error">
                    Veuillez définir au moins une plage d'horaires ou sinon, cochez la case "Le professionnel n'accueille pas de client à l'adresse de son établissement".
                </small>
            </b-col>
        </b-row>
        <TimeRanges
            parentEntityName="partner"
            v-bind:parentEntity="currentPartner"
            v-bind:timeRanges="currentPartner.openingRanges"
            v-bind:allowedToEdit="allowedToEdit"
            v-bind:verifyFields="verifyFields"
        />
        <b-row>
            <b-col class="my-3">
                <label class="label">Remarque à propos des horaires</label>
                <ValidationProvider name="Remarque à propos des horaires" rules="min:3|max:255"
                                    ref="currentPartner.aboutOpeningRange"
                                    v-slot="{ validate, classes, errors }">
                    <div class="input-text">
                        <b-form-input
                            @focus="onFocus"
                            @blur="onBlur($event, { partner: currentPartner })"
                            type="text"
                            :class="classes"
                            name="currentPartner.aboutOpeningRange"
                            v-model="currentPartner.aboutOpeningRange"
                            :disabled="!allowedToEdit"
                            :readonly="!allowedToEdit"
                        ></b-form-input>
                        <TextLengthMessage
                            :value="!currentPartner || currentPartner.aboutOpeningRange"
                            maxlength="255"
                        />
                    </div>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
        <ExceptionnalDates
            parentEntityName="partner"
            parentEntityPath="currentPartner"
            :enableIsOpeningRange="true"
            :enableReason="false"
            :displayEntitle="true"
        />
    </b-container>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { extend } from "vee-validate";
import { socialNetworkOptions } from '../../Interface/partnershipFolderDatas';
import TimeRanges from "./TimeRanges";
import ExceptionnalDates from "./ExceptionnalDates";
import TextLengthMessage from './TextLengthMessage';
import { readyState, validateSection } from "@/_helpers";
import dpMixin from "../../mixins/dp-mixin";

require('../../assets/style/Pfolder/partnership-folder.css');

extend('expectedCheckedField', validateSection.expectedCheckedField);
extend('requiredCheckedField', validateSection.requiredCheckedField);
extend('expected', validateSection.expected);

export default {
    name: 'DisplayInformations',
    mixins: [dpMixin],
    components: { ExceptionnalDates, TimeRanges, TextLengthMessage },
    computed: {
        ...mapState('account', ['identity', 'currentPartner']),
        ...mapState('globalStore', ['salesforce']),
        clientsNotWelcome: {
            get() {
                return true !== this.currentPartner.sites[0].clientsPhysicallyWelcome;
            },
            set(val) {
                this.currentPartner.sites[0].clientsPhysicallyWelcome = false === val;
            }
        },
        allowedToEdit() {
            return this.identity.allowedToEdit;
        }
    },
    data() {
        return {
            socialNetworkOptions,
            availableSocialNetworks: [],
            checkedSocialNetworks: [],
            otherSocialNetworkDisplay: false,
            otherSocialNetworkName: '',
            previousEditedValue: null,
            customChoiceError: false
        };
    },
    methods: {
        ...mapActions('account', ['updatePartnerPropertyFromForm', 'deletePartnerPropertyFromForm']),
        onFocus(event) {
            this.previousEditedValue = event.target.value;
        },
        onBlur(event, data) {
            let provider = this.$refs[event.target.name];
            this.updatePartnerPropertyFromForm({
                event: event,
                provider: provider[0] || provider,
                data: data ? Object.assign({ previousEditedValue: this.previousEditedValue }, data) : undefined
            });
            this.verifyFields();
        },
        onClientsNotWelcomeChecked(event, data) {
            data.offset = 'clientsPhysicallyWelcome';
            data.value = this.currentPartner.sites[0].clientsPhysicallyWelcome;
            this.updatePartnerPropertyFromForm({
                data: data
            });
            this.verifyFields();
        },
        onSocialNetworkCheck(event, data) {
            this.onSocialNetworkChange(event, data);
        },
        onSocialNetworkChange(event, data) {
            if (!data.socialNetwork.display
                || (data.socialNetwork.display && '' !== data.socialNetwork.url)
            ) {
                this.persistSocialNetwork(event, data);
            }
        },
        persistSocialNetwork(event, data) {
            if (data.socialNetwork && !data.socialNetwork.id) {
                data.socialNetwork.partner = this.currentPartner['@id'];
            }
            data.payload = {
                display: data.socialNetwork.display,
                url: data.socialNetwork.url
            };
            let provider = this.$refs[event.target.name] || false;
            this.updatePartnerPropertyFromForm({
                event: event,
                provider: provider[0] || provider,
                data: data ? Object.assign({previousEditedValue: this.previousEditedValue}, data) : undefined
            }).then(() => {
                this.initializeSocialNetworks();
                this.verifyFields();
            });
        },
        initializeSocialNetworks() {
            let availableSocialNetworks = [];

            this.socialNetworkOptions.forEach(item => {
                let found = this.currentPartner.socialNetworks.find(
                    partnerSocialNetwork => partnerSocialNetwork.name && partnerSocialNetwork.name.toLowerCase() === item.value.toLowerCase()
                );
                if (found) {
                    availableSocialNetworks.push(found);
                } else {
                    availableSocialNetworks.push({
                        name: item.value
                    });
                }
            });

            this.currentPartner.socialNetworks.forEach(item => {
                let found = undefined !== item.name ? availableSocialNetworks.find(
                    availableSocialNetwork => availableSocialNetwork.name.toLowerCase() === item.name.toLowerCase()
                ) : null;
                if (undefined !== item.name && !found) {
                    availableSocialNetworks.push(item);
                }
            });

            this.availableSocialNetworks = availableSocialNetworks;
        },
        async validateFields(refs, entity) {
            if (!this.allowedToEdit) {
                return;
            }

            let timeRanges = entity.currentPartner.openingRanges.filter(openingRange => openingRange.dayOfWeek);
            let clientsPhysicallyWelcome = !entity.currentPartner.sites[0].clientsPhysicallyWelcome;
            let isValid = await validateSection.validateRequiredFields(entity, refs, ['socialNetworks', 'contact.MobilePhone', 'contact.Phone']);

            if (isValid) {
                if (!clientsPhysicallyWelcome && !timeRanges.length) {
                    const addTimeRangeButton = document.querySelector('#add-time-range');
                    if (addTimeRangeButton && !this.customChoiceError) {
                        addTimeRangeButton.click();
                    }
                    this.customChoiceError = true;
                    isValid = false;
                }

                if ((!clientsPhysicallyWelcome && timeRanges.length) || (clientsPhysicallyWelcome && !timeRanges.length)) {
                    isValid = true;
                    this.customChoiceError = false;
                }
            }

            if (isValid) {
                let isSocialNetworkValid = !entity.currentPartner.socialNetworks.length ||
                    entity.currentPartner.socialNetworks.every(socialNetwork => {
                        return !socialNetwork.display || (socialNetwork.display && !!socialNetwork.url);
                    });

                if (!isSocialNetworkValid) {
                    isValid = null;
                }
            }

            validateSection.displayColorStateOnSection('display-informations', isValid);
        },
    },
    async mounted() {
        this.initializeSocialNetworks();
        this.currentPartner.openingRanges = this.currentPartner.openingRanges.filter(item => item.dayOfWeek);
    }
}
</script>
