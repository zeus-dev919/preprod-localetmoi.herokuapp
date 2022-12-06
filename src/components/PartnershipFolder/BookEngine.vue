<template>
    <b-container fluid>
        <!-- bookEngineForm -->
        <b-row>
            <ValidationProvider name="liste moteur de réservation" rules="expected"
                                ref="currentPartner.bookEngines.0.engine"
                                v-slot="{ validate, classes, errors }">
                <b-col>
                    <label>Vous disposez déjà d'un moteur de réservation parmi la liste
                        suivante</label>
                    <b-form-select
                        @change.native="onSelectBookEngine($event, { bookEngine: currentPartner.bookEngines[0] })"
                        v-model="currentPartner.bookEngines[0].engine"
                        :options="availableOptions"
                        name="currentPartner.bookEngines.0.engine"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                        type="select"
                    ></b-form-select>
                    <small :class="classes">{{ errors[0] }}</small>
                </b-col>
            </ValidationProvider>
        </b-row>
        <b-row class="mt-3 mb-3">
            <b-col>
                <ValidationProvider name="nom du moteur de réservation"
                                    :rules="{ required: false, min: 3 }"
                                    ref="currentPartner.bookEngines.0.name"
                                    v-slot="{ validate, classes, errors }">
                    <label>Vous avez un autre moteur de réservation, indiquez son nom</label>
                    <b-form-input
                        @focus="onFocus"
                        @change.native="onBlur($event, { bookEngine: currentPartner.bookEngines[0] })"
                        v-model="currentPartner.bookEngines[0].name"
                        name="currentPartner.bookEngines.0.name"
                        :class="classes"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                        type="text"
                    ></b-form-input>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
        <b-row class="mt-3 mb-3">
            <b-col>
                <ValidationProvider name="autre moteur de réservation" rules="min:3"
                                    ref="currentPartner.bookEngines.0.url"
                                    v-slot="{ validate, classes, errors }">
                    <label>Vous avez un autre moteur de réservation, indiquez le lien vers celui-ci :</label>
                    <b-form-input
                        @focus="onFocus"
                        @blur="onBlur($event, { bookEngine: currentPartner.bookEngines[0] })"
                        :class="classes"
                        type="text"
                        name="currentPartner.bookEngines.0.url"
                        v-model="currentPartner.bookEngines[0].url"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                    ></b-form-input>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
        <b-row class="mt-3 mb-3">
            <b-col>
                <span>
                    Indiquez toutes les informations utiles liées au compte client du moteur
                    de réservation :
                </span>
            </b-col>
        </b-row>
        <b-row>
            <b-col lg="3" md="4" sm="6">
                <ValidationProvider name="Identifiant" rules="min:3" ref="currentPartner.bookEngines.0.username"
                                    v-slot="{ validate, classes, errors }">
                    <label class="label">Identifiant</label>
                    <b-form-input
                        @focus="onFocus"
                        @blur="onBlur($event, { bookEngine: currentPartner.bookEngines[0] })"
                        :class="classes"
                        type="text"
                        name="currentPartner.bookEngines.0.username"
                        v-model="currentPartner.bookEngines[0].username"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                    ></b-form-input>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
            <b-col lg="3" md="4" sm="6">
                <ValidationProvider name="Numéro client" rules="min:3" ref="currentPartner.bookEngines.0.customerCode"
                                    v-slot="{ validate, classes, errors }">
                    <label class="label">Numéro client</label>
                    <b-form-input
                        @focus="onFocus"
                        @blur="onBlur($event, { bookEngine: currentPartner.bookEngines[0] })"
                        :class="classes"
                        type="text"
                        name="currentPartner.bookEngines.0.customerCode"
                        v-model="currentPartner.bookEngines[0].customerCode"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                    ></b-form-input>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
            <b-col lg="3" md="4" sm="6">
                <ValidationProvider name="Hôtel ID" rules="min:3" ref="currentPartner.bookEngines.0.hotelId"
                                    v-slot="{ validate, classes, errors }">
                    <label class="label">Hôtel ID</label>
                    <b-form-input
                        @focus="onFocus"
                        @blur="onBlur($event, { bookEngine: currentPartner.bookEngines[0] })"
                        :class="classes"
                        type="text"
                        name="currentPartner.bookEngines.0.hotelId"
                        v-model="currentPartner.bookEngines[0].hotelId"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                    ></b-form-input>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
            <b-col lg="3" md="4" sm="6">
                <ValidationProvider name="Channel Code" rules="min:3" ref="currentPartner.bookEngines.0.channelCode"
                                    v-slot="{ validate, classes, errors }">
                    <label class="label">Channel Code</label>
                    <b-form-input
                        @focus="onFocus"
                        @blur="onBlur($event, { bookEngine: currentPartner.bookEngines[0] })"
                        :class="classes"
                        type="text"
                        name="currentPartner.bookEngines.0.channelCode"
                        v-model="currentPartner.bookEngines[0].channelCode"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                    ></b-form-input>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <ValidationProvider name="Autre" rules="min:3" ref="currentPartner.bookEngines.0.comment"
                                    v-slot="{ validate, classes, errors }">
                    <label class="label">Autre</label>
                    <b-form-input
                        @focus="onFocus"
                        @blur="onBlur($event, { bookEngine: currentPartner.bookEngines[0] })"
                        :class="classes"
                        type="text"
                        name="currentPartner.bookEngines.0.comment"
                        v-model="currentPartner.bookEngines[0].comment"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                    ></b-form-input>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
        <b-row class="mt-3 mb-3" v-if="currentPartner.partnerHotelResto">
            <b-col>
                <ValidationProvider name="vous n'avez pas de moteur de réservation"
                                    ref="currentPartner.partnerHotelResto.bookEngineAction"
                                    v-slot="{ validate, classes, errors }">
                    <label>Vous n'avez pas de moteur de réservation, que souhaitez-vous faire ?</label>
                    <b-form-select
                        @change.native="onBlur($event, { partnerHotelResto: currentPartner.partnerHotelResto })"
                        :class="classes"
                        type="select"
                        name="currentPartner.partnerHotelResto.bookEngineAction"
                        v-model="currentPartner.partnerHotelResto.bookEngineAction"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                        :options="noEngineOptions"
                    ></b-form-select>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import dpMixin from "../../mixins/dp-mixin";

require('../../assets/style/Pfolder/partnership-folder.css');

import { hotelEngineOptions, restoEngineOptions, noEngineOptions } from '../../Interface/partnershipFolderDatas'
import { readyState, validateSection } from "@/_helpers";
import { mapActions, mapState } from "vuex";

export default {
    name: 'BookEngine',
    mixins: [dpMixin],
    computed: {
        ...mapState('account', ['identity', 'currentPartner']),
        ...mapState('globalStore', ['status'])
    },
    data() {
        return {
            hotelEngineOptions,
            restoEngineOptions,
            noEngineOptions,
            availableOptions: null
        }
    },
    async mounted() {
        if (this.status.isLocalHotel) {
            this.availableOptions = hotelEngineOptions;
        }
        
        if (this.status.isLocalResto) {
            this.availableOptions = restoEngineOptions;
        }
    },
    methods: {
        ...mapActions('account', ['updatePartnerPropertyFromForm']),
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
            }).then(() => this.verifyFields());
        },
        onSelectBookEngine(event, data) {
            this.updatePartnerPropertyFromForm({
                event: event,
                data: data ? Object.assign({ previousEditedValue: this.previousEditedValue }, data) : undefined
            }).then(() => this.verifyFields());
        }
    }
}
</script>
