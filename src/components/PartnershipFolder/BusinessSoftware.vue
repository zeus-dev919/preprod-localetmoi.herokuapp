<template>
    <b-container fluid v-if="currentPartner.partnerAutoImmo">
        <!-- businessSoftwareForm -->
        <b-row>
            <b-col>
                <ValidationProvider name="logiciel métier" rules="required" ref="currentPartner.partnerAutoImmo.hasBusinessSoftware"
                                    v-slot="{ validate, classes, errors }">
                    <label class="label">Utilisez-vous un logiciel métier ?</label>
                    <b-form-select
                        @change.native="onBlur($event, { partnerAutoImmo: currentPartner.partnerAutoImmo, type: 'bool' })"
                        v-model="currentPartner.partnerAutoImmo.hasBusinessSoftware"
                        name="currentPartner.partnerAutoImmo.hasBusinessSoftware"
                        :class="classes"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                        :options="yesNoOptions"
                        value-field="value"
                        text-field="text"
                        type="select"
                    ></b-form-select>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
        <b-row class="mt-3 mb-3" v-if="currentPartner.partnerAutoImmo.hasBusinessSoftware">
            <b-col>
                <ValidationProvider name="nom du logiciel"
                                    rules="required_if:currentPartner.partnerAutoImmo.hasBusinessSoftware,Oui"
                                    ref="currentPartner.partnerAutoImmo.businessSoftwareName" v-slot="{ validate, classes, errors }">
                    <label class="label">Si oui, nom du logiciel</label>
                    <b-form-input
                        @focus="onFocus"
                        @blur="onBlur($event, { partnerAutoImmo: currentPartner.partnerAutoImmo })"
                        v-model="currentPartner.partnerAutoImmo.businessSoftwareName"
                        name="currentPartner.partnerAutoImmo.businessSoftwareName"
                        type="text"
                        :class="classes"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                    ></b-form-input>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
        <b-row class="mt-3 mb-3">
            <b-col>
                <ValidationProvider name="volume d'annonces" rules="integer" ref="currentPartner.partnerAutoImmo.adQuantity"
                                    v-slot="{ validate, classes, errors }">
                    <label class="label">Volume d'annonces</label>
                    <b-form-input
                        @focus="onFocus"
                        @change.native="onBlur($event, { partnerAutoImmo: currentPartner.partnerAutoImmo })"
                        v-model="currentPartner.partnerAutoImmo.adQuantity"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                        :class="classes"
                        name="currentPartner.partnerAutoImmo.adQuantity"
                        type="number"
                    ></b-form-input>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
        <b-row class="mt-3 mb-3 extra-informations">
            <b-col md="4">
                <a href="https://local-fr.lightning.force.com/lightning/r/Knowledge__kav/ka069000000oMbeAAE/view" target="_blank" class="external-link">Liste des
                    logiciels métiers compatibles</a>
            </b-col>
            <b-col>
                <small>S'il ne dispose pas d'un logiciel métier compatible, le professionnel
                    pourra saisir ses annonces directement sur la plateforme Ubiflow.</small>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import {mapState, mapActions} from 'vuex';
import { yesNoOptions } from '../../Interface/partnershipFolderDatas';

require('../../assets/style/Pfolder/partnership-folder.css');


export default {
    name: 'BusinessSoftware',
    computed: {
        ...mapState('account', ['identity', 'currentPartner']),
    },
    data() {
        return {
            yesNoOptions
        };
    },
    methods: {
        ...mapActions('account', ['updatePartnerPropertyFromForm']),
        onFocus(event) {
            this.previousEditedValue = event.target.value;
        },
        onBlur(event, data) {
            let provider = this.$refs[event.target.name];
            if (data.partnerAutoImmo && !data.partnerAutoImmo.id) {
                data.partnerAutoImmo.partner = this.currentPartner['@id'];
            }
            this.updatePartnerPropertyFromForm({
                event: event,
                provider: provider[0] || provider,
                data: data ? Object.assign({ previousEditedValue: this.previousEditedValue }, data) : undefined
            });
        },
    }
};
</script>
