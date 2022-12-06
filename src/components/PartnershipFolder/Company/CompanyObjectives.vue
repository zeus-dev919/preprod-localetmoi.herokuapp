<template>
    <b-container fluid>
        <!-- your objectives -->
        <b-row class="my-3">
            <b-col lg="12">
                <ValidationProvider name="Vision de l'entreprise" rules="min:3" ref="currentPartner.businessViews"
                                    v-slot="{ validate, classes, errors }">
                    <label class="label">Vision de l'entreprise dans 4/5 ans</label>
                    <b-form-textarea
                        type="textarea"
                        :class="classes"
                        @focus="onFocus"
                        @blur="onBlur($event, { partner: currentPartner })"
                        rows="3"
                        name="currentPartner.businessViews"
                        v-model="currentPartner.businessViews"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                    ></b-form-textarea>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
        <b-row class="my-3">
            <b-col>
                <ValidationProvider name="Développement de l'entreprise" rules="min:3" ref="currentPartner.businessDevelopment"
                                    v-slot="{ validate, classes, errors }">
                    <label class="label">Développement de l'entreprise</label>
                    <b-form-textarea
                        type="textarea"
                        :class="classes"
                        @focus="onFocus"
                        @blur="onBlur($event, { partner: currentPartner })"
                        rows="5"
                        name="currentPartner.businessDevelopment"
                        v-model="currentPartner.businessDevelopment"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                    ></b-form-textarea>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
        <b-row class="my-3">
            <b-col>
                <ValidationProvider name="Calcul marge" rules="numeric" ref="currentPartner.progressCheck"
                                    v-slot="{ validate, classes, errors }">
                    <label class="label">Calcul marge de progression</label>
                    <b-form-input
                        @focus="onFocus"
                        @blur="onBlur($event, { partner: currentPartner, type: 'int' })"
                        type="text"
                        :class="classes"
                        name="currentPartner.progressCheck"
                        v-model="currentPartner.progressCheck"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                    ></b-form-input>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
        <div>
            <b-row class="my-3">
                <b-col lg="4" md="5" sm="7">
                    <span class="mr-3">Capacité à gérer plus de clients</span>
                </b-col>
                <b-col lg="1" md="2" sm="2">
                    <ValidationProvider name="Manager plus de clientèle" :rules="{ required: false }" ref="currentPartner.manageMoreCustomers"
                                        v-slot="{ validate, classes, errors }">
                        <b-form-radio
                            type="radio"
                            @change.native="onBlur($event, { partner: currentPartner, type: 'bool' })"
                            name="currentPartner.manageMoreCustomers"
                            v-model="currentPartner.manageMoreCustomers"
                            :value="true"
                            :disabled="!identity.allowedToEdit"
                            :readonly="!identity.allowedToEdit"
                        >
                            Oui
                        </b-form-radio>
                        <small :class="classes">{{ errors[0] }}</small>
                    </ValidationProvider>
                </b-col>
                <b-col lg="1" md="2" sm="2">
                    <ValidationProvider name="Manager plus de clientèle" :rules="{ required: false }" ref="currentPartner.manageMoreCustomers"
                                        v-slot="{ validate, classes, errors }">
                        <b-form-radio
                            @change.native="onBlur($event, { partner: currentPartner, type: 'bool' })"
                            name="currentPartner.manageMoreCustomers"
                            v-model="currentPartner.manageMoreCustomers"
                            :value="false"
                            :disabled="!identity.allowedToEdit"
                            :readonly="!identity.allowedToEdit"
                        >
                            Non
                        </b-form-radio>
                        <small :class="classes">{{ errors[0] }}</small>
                    </ValidationProvider>
                </b-col>
            </b-row>
        </div>
    </b-container>
</template>

<script>

require('../../../assets/style/Pfolder/partnership-folder.css');

import {mapState, mapActions} from 'vuex';

export default {
    name: 'CompanyObjectives',
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
