<template>
    <b-container fluid>
        <!-- tourismInfoForm -->
        <b-row class="mb-3">
            <b-col>
                <span>Langues parlées</span>
            </b-col>
        </b-row>
        <b-row class="mb-3">
            <b-col v-for="(availableLanguage, index) in availableSpokenLanguages"
                   :key="`availableLanguage-${index}`" class="languages-grid" lg="1" md="3" sm="4">
                <ValidationProvider name="langages parlés" :rules="{ required: false }" :ref="`currentPartner.spokenLanguages[${index}]`" v-slot="{ validate, classes, errors }">
                    <b-form-checkbox-group
                        @change.native="onLanguageCheck($event, { partner: currentPartner })"
                        :name="`currentPartner.spokenLanguages[${index}]`"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                        :options="[ availableLanguage ]"
                        v-model="checkedSpokenLanguages"
                        type="checkbox"
                    ></b-form-checkbox-group>
                  <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
            <b-col v-if="otherSpokenLanguageChecked" sm="8" md="9" lg="4">
                <ValidationProvider name="Autre langage parlé" ref="currentPartner.spokenLanguages.other"
                                    v-slot="{ validate, classes, errors }">
                    <b-form-input
                        @focus="onFocus"
                        type="text"
                        @blur.native="onLanguageChange($event, { partner: currentPartner })"
                        :class="classes"
                        placeholder="Autre"
                        name="currentPartner.spokenLanguages.other"
                        v-model="otherSpokenLanguage"
                        :disabled="!identity.allowedToEdit || !otherSpokenLanguageChecked"
                        :readonly="!identity.allowedToEdit || !otherSpokenLanguageChecked"
                    ></b-form-input>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
        <b-row class="mb-3">
            <b-col>
                <span>Moyens de paiements acceptés</span>
            </b-col>
        </b-row>
        <b-row class="mb-3">
            <b-col v-for="(paymentMethod, index) in paymentMethods" :key="`paymentMethod-${index}`" lg="2" md="3" sm="4">
                <b-form-checkbox-group
                        @change.native="onPaymentMethodChange($event, { partner: currentPartner })"
                        :name="`currentPartner.paymentModes[${index}].name`"
                        :options="[ paymentMethod ]"
                        v-model="checkedPaymentMethods"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                        type="checkbox"
                ></b-form-checkbox-group>
            </b-col>
        </b-row>
        <b-row class="mt-3 mb-3" v-if="currentPartner.partnerHotelResto">
            <b-col>
                <ValidationProvider name="activités proposées" rules="min:10" ref="currentPartner.partnerHotelResto.hobbies" v-slot="{ validate, classes, errors }">
                    <label class="label">Listez les activités proposées par votre établissement</label>
                    <b-form-textarea
                        @focus="onFocus"
                        @blur="onBlur($event, { partnerHotelResto: currentPartner.partnerHotelResto})"
                        type="textarea"
                        :class="classes"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                        name="currentPartner.partnerHotelResto.hobbies"
                        v-model="currentPartner.partnerHotelResto.hobbies"
                    ></b-form-textarea>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
        <b-row class="mt-3 mb-3" v-if="currentPartner.partnerHotelResto">
            <b-col>
                <ValidationProvider name="services proposés" rules="min:10" ref="currentPartner.partnerHotelResto.services" v-slot="{ validate, classes, errors }">
                    <label class="label">Listez les services proposés par votre établissement</label>
                    <b-form-textarea
                        @focus="onFocus"
                        @blur="onBlur($event, { partnerHotelResto: currentPartner.partnerHotelResto})"
                        type="textarea"
                        :class="classes"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                        name="currentPartner.partnerHotelResto.services"
                        v-model="currentPartner.partnerHotelResto.services"
                    ></b-form-textarea>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import {mapActions, mapState} from 'vuex';
import { availableSpokenLanguages, paymentMethods } from '../../Interface/partnershipFolderDatas';

require('../../assets/style/Pfolder/partnership-folder.css');

export default {
    name: 'ToursitInformations',
    computed: {
        ...mapState('globalStore', ['paymentModes','languages']),
        ...mapState('account', ['identity', 'currentPartner'])
    },
    data() {
        return {
            availableSpokenLanguages,
            checkedLanguages: [],
            paymentMethods,
            otherSpokenLanguage: '',
            checkedPaymentMethods: [],
            checkedSpokenLanguages: [],
            otherSpokenLanguageChecked: false,
        };
    },
    methods: {
        ...mapActions('account', ['updatePartnerPropertyFromForm']),
        ...mapActions('globalStore', ['getPaymentModes', 'getLanguages']),
        onFocus(event) {
            this.previousEditedValue = event.target.value;
        },
        onBlur(event, data) {
            let provider = this.$refs[event.target.name];
            if (data.partnerHotelResto && !data.partnerHotelResto.id) {
                data.partnerHotelResto.partner = this.currentPartner['@id'];
            }
            this.updatePartnerPropertyFromForm({
                event: event,
                provider: provider[0] || provider,
                data: data ? Object.assign({ previousEditedValue: this.previousEditedValue }, data) : undefined
            });
        },
        onLanguageCheck(event, data) {
            if ('other' === event.target.value) {
                this.otherSpokenLanguageChecked = event.target.checked;
                if (!this.otherSpokenLanguage) {
                    return;
                }
            }

            this.onLanguageChange(event, data);
        },
        onLanguageChange(event, data) {
            let checkedSpokenTexts = this.checkedSpokenLanguages.map(
                checkedLanguage => {
                    let find = this.availableSpokenLanguages.find(
                        availableLanguage => availableLanguage.text === checkedLanguage
                    );
                    return find ? find.text : '';
                }
            );
            let newSpokenLanguages = [];
            this.checkedSpokenLanguages.forEach(checkedSpokenLanguage => {
                if (!checkedSpokenLanguage) {
                    return;
                }

                if ('other' === checkedSpokenLanguage) {
                    if (this.otherSpokenLanguage) {
                        let spokenLanguageFound = checkedSpokenTexts.find(
                            item => item === this.otherSpokenLanguage
                        );
                        if (!spokenLanguageFound) {
                            newSpokenLanguages.push(this.otherSpokenLanguage);
                        }
                    }
                } else {
                    newSpokenLanguages.push(checkedSpokenLanguage);
                }
            });
            data.offset = 'spokenLanguages';
            data.value = newSpokenLanguages;
            this.updatePartnerPropertyFromForm({data: data});
        },
        onPaymentMethodChange(event, data) {
            let newPaymentModes = [];
            this.checkedPaymentMethods.forEach(checkedPaymentMethod => {
                if (checkedPaymentMethod) {
                    newPaymentModes.push(
                        this.paymentModes[checkedPaymentMethod]
                        ? { id: this.paymentModes[checkedPaymentMethod]['@id'] }
                        : { name: checkedPaymentMethod }
                    );
                }
            });
            if (data.partner) {
                data.offset = 'paymentModes';
                data.value = newPaymentModes;
                this.updatePartnerPropertyFromForm({data: data});
            }
        },
    },
    mounted() {
        // Payment modes
        if (!Object.keys(this.paymentModes).length) {
            this.getPaymentModes();
        }
        this.checkedPaymentMethods = this.currentPartner.paymentModes.map(item => item.name);

        // Spoken languages
        let availableSpokenLanguageValues = this.availableSpokenLanguages.map(item => item.value);

        this.otherSpokenLanguage = this.currentPartner.spokenLanguages
            .find(item => -1 === availableSpokenLanguageValues.indexOf(item));
        this.otherSpokenLanguageChecked = !!this.otherSpokenLanguage;

        this.checkedSpokenLanguages = this.currentPartner.spokenLanguages
            .filter(item => -1 !== availableSpokenLanguageValues.indexOf(item));

        if (this.otherSpokenLanguageChecked) {
            this.checkedSpokenLanguages.push('other');
        }
    }
};
</script>
