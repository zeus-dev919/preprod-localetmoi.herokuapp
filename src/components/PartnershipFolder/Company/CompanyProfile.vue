<template>
    <b-container fluid>
        <!-- your profile -->
        <b-row class="my-3">
            <b-col lg="6" md="6" sm="12">
                <ValidationProvider name="Vos expériences" rules="min:3" ref="currentPartner.experience"
                                    v-slot="{ validate, classes, errors }">
                    <label class="label">Vos expériences</label>
                    <b-form-textarea
                        @focus="onFocus"
                        @blur="onBlur($event, { partner: currentPartner })"
                        type="textarea"
                        :class="classes"
                        name="currentPartner.experience"
                        v-model="currentPartner.experience"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                    ></b-form-textarea>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
            <b-col lg="6" md="6" sm="12">
                <ValidationProvider name="Zones géographiques" rules="min:3" ref="currentPartner.geographicalArea"
                                    v-slot="{ validate, classes, errors }">
                    <label class="label">Zones géographiques</label>
                    <b-form-textarea
                        @focus="onFocus"
                        @blur="onBlur($event, { partner: currentPartner })"
                        type="text"
                        :class="classes"
                        name="currentPartner.geographicalArea"
                        v-model="currentPartner.geographicalArea"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                    ></b-form-textarea>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
        <b-row class="my-3">
            <b-col>
                <ValidationProvider name="Prestations détaillées" rules="min:3" ref="currentPartner.serviceDetails"
                                    v-slot="{ validate, classes, errors }">
                    <label class="label">Prestations détaillées</label>
                    <b-form-input
                        @focus="onFocus"
                        @blur="onBlur($event, { partner: currentPartner })"
                        type="text"
                        :class="classes"
                        name="currentPartner.serviceDetails"
                        v-model="currentPartner.serviceDetails"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                    ></b-form-input>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
        <b-row class="my-3">
            <b-col lg="4" md="6" sm="12">
                <ValidationProvider name="Nombre de clients / chantiers" rules="numeric" ref="currentPartner.clientNumber"
                                    v-slot="{ validate, classes, errors }">
                    <label class="label">Nombre de clients / chantiers</label>
                    <b-form-input
                        @focus="onFocus"
                        @blur="onBlur($event, { partner: currentPartner, type: 'int' })"
                        type="text"
                        :class="classes"
                        name="currentPartner.clientNumber"
                        v-model="currentPartner.clientNumber"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                    ></b-form-input>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
            <b-col lg="4" md="6" sm="12">
                <ValidationProvider name="Panier moyen" rules="numeric" ref="currentPartner.averageBasket"
                                    v-slot="{ validate, classes, errors }">
                    <label class="label">Panier moyen</label>
                    <b-form-input
                        @focus="onFocus"
                        @blur="onBlur($event, { partner: currentPartner, type: 'int' })"
                        type="text"
                        :class="classes"
                        name="currentPartner.averageBasket"
                        v-model="currentPartner.averageBasket"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                    ></b-form-input>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
            <b-col lg="4" md="6" sm="12">
                <ValidationProvider name="Chiffre d'affaires" rules="numeric" ref="currentPartner.grossSales"
                                    v-slot="{ validate, classes, errors }">
                    <label class="label">Chiffre d'affaires</label>
                    <b-form-input
                        @focus="onFocus"
                        @blur="onBlur($event, { partner: currentPartner, type: 'int' })"
                        type="text"
                        :class="classes"
                        name="currentPartner.grossSales"
                        v-model="currentPartner.grossSales"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                    ></b-form-input>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
        <b-row class="my-3">
            <b-col>
                <ValidationProvider name="Points forts / Concurrence" rules="min:3" ref="currentPartner.keyPoints"
                                    v-slot="{ validate, classes, errors }">
                    <label class="label">Points forts / Concurrence</label>
                    <b-form-input
                        @focus="onFocus"
                        @blur="onBlur($event, { partner: currentPartner })"
                        type="text"
                        :class="classes"
                        name="currentPartner.keyPoints"
                        v-model="currentPartner.keyPoints"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                    ></b-form-input>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
        <b-row class="my-3">
            <b-col>
                <ValidationProvider name="Commentaires" rules="min:3" ref="currentPartner.companyComment"
                                    v-slot="{ validate, classes, errors }">
                    <label class="label">Commentaires</label>
                    <b-form-textarea
                        @focus="onFocus"
                        @blur="onBlur($event, { partner: currentPartner })"
                        type="text"
                        :class="classes"
                        name="currentPartner.companyComment"
                        v-model="currentPartner.companyComment"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                    ></b-form-textarea>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
        <b-row class="my-3">
            <b-col md="6">
                <!-- unknown field -->
                <ValidationProvider name="Concepts et objectifs" rules="min:3" ref="currentPartner.goalsStore"
                                    v-slot="{ validate, classes, errors }">
                    <label class="label">Concepts et objectifs de la boutique</label>
                    <b-form-input
                        @focus="onFocus"
                        @blur="onBlur($event, { partner: currentPartner })"
                        type="text"
                        :class="classes"
                        name="currentPartner.goalsStore"
                        v-model="currentPartner.goalsStore"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                    ></b-form-input>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
            <b-col md="6">
                <!-- unknown field -->
                <ValidationProvider name="Type de produits" rules="min:3" ref="currentPartner.productBrands"
                                    v-slot="{ validate, classes, errors }">
                    <label class="label">Type de produits et marques proposées</label>
                    <b-form-input
                        @focus="onFocus"
                        @blur="onBlur($event, { partner: currentPartner })"
                        type="text"
                        :class="classes"
                        name="currentPartner.productBrands"
                        v-model="currentPartner.productBrands"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                    ></b-form-input>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>

require('../../../assets/style/Pfolder/partnership-folder.css');

import {mapState, mapActions} from 'vuex';

export default {
    name: 'CompanyProfile',
    data() {
        return {
            previousEditedValue: null,
        }
    },
    computed: {
        ...mapState('account', ['identity', 'currentPartner']),
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
            });
        }
    }
}

</script>
