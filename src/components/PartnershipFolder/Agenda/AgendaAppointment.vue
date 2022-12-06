<template>
    <b-container fluid>
        <b-row class="mt-3 my-3">
            <b-col lg="6" md="8" sm="4">
                <span class="mr-3">Les RDV pris ont-ils besoin d’être validés pour être confirmés ? (par défaut ils sont validés par le manager)</span>
            </b-col>
            <b-col lg="1" md="2" sm="6">
                <ValidationProvider name="Validation rdv" :rules="{ required: false }" ref="currentPartner.agenda.shouldBeConfirmed"
                                    v-slot="{ validate, classes, errors }">
                    <b-form-radio
                        @change.native="onBlur($event, { agenda: currentPartner.agenda, type: 'bool' })"
                        type="radio"
                        name="currentPartner.agenda.shouldBeConfirmed"
                        v-model="currentPartner.agenda.shouldBeConfirmed"
                        :value="true"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                    >
                        Oui
                    </b-form-radio>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
            <b-col lg="1" md="2" sm="6">
                <ValidationProvider name="Validation rdv" :rules="{ required: false }" ref="currentPartner.agenda.shouldBeConfirmed"
                                    v-slot="{ validate, classes, errors }">
                    <b-form-radio
                        @change.native="onBlur($event, { agenda: currentPartner.agenda, type: 'bool' })"
                        type="radio"
                        name="currentPartner.agenda.shouldBeConfirmed"
                        v-model="currentPartner.agenda.shouldBeConfirmed"
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
        <b-row class="mt-3">
            <b-col sm="12" md="4">
                <label>Combien de temps à l'avance le RDV peut-il être pris ? </label>
            </b-col>
        </b-row>
        <b-row class="mt-3">
            <DurationField
                field-label="Maximum"
                entity-name="agenda"
                duration-value-field="appointmentDelay"
                duration-unit-field="appointmentType"
                v-bind:entity="currentPartner.agenda"
                v-bind:required="false"
            />
        </b-row>
    </b-container>
</template>

<script>
import { mapActions, mapState } from "vuex";
import DurationField from "../DurationField";

export default {
    name: "AgendaAppointment",
    components: { DurationField },
    computed: {
        ...mapState('account', ['identity', 'currentPartner']),
    },
    methods: {
        ...mapActions('account', ['updatePartnerPropertyFromForm']),
        onFocus(event) {
            this.previousEditedValue = event.target.value;
        },
        onBlur(event, data) {
            let provider = event ? this.$refs[event.target.name] : null;
            this.updatePartnerPropertyFromForm({
                event: event,
                provider: provider,
                data: data ? Object.assign({ previousEditedValue: this.previousEditedValue }, data) : undefined
            });
        },
    }
}
</script>
