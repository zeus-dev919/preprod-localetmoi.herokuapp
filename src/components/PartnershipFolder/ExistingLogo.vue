<template>
    <b-container fluid>
        <b-row class="mt-3 mb-3">
            <b-col md="6">
                <label class="label">Avez-vous un logo existant à nous transmettre ?</label>
                <ValidationProvider name="logo existant" rules="oneOf:Oui,Non|required" ref="currentPartner.sites.0.hasLogo"
                                    v-slot="{ validate, classes, errors }">
                    <b-form-select
                        @change.native="onBlur($event, { site: currentPartner.sites[0] })"
                        :class="classes"
                        name="currentPartner.sites.0.hasLogo"
                        v-model="currentPartner.sites[0].hasLogo"
                        :options="hasLogoChoice"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                    ></b-form-select>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
        <b-row class="my-3" v-if="'Non' === currentPartner.sites[0].hasLogo">
            <b-col md="6">
                <label class="label">Souhaitez-vous une création de logo ?</label>
                <ValidationProvider name="Création de logo souhaitée ?" rules="required" ref="salesforce.opportunity.Cr_ation_logo__c"
                                    v-slot="{ validate, classes, errors }">
                    <b-form-select
                        :class="classes"
                        @change.native="onBlur($event, { opportunity: salesforce.opportunity })"
                        name="salesforce.opportunity.Cr_ation_logo__c"
                        v-model="salesforce.opportunity.Cr_ation_logo__c"
                        :options="yesNoOptions"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                    ></b-form-select>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
            <b-col md="12" v-if="!logoCreation" class="mt-3" :class="logoCreation ? null : 'no-logo-creation-disclaimer'">
                Si vous n'avez pas de logo, nous proposerons un lettrage, l'enseigne de votre entreprise sera écrite en texte sur votre site internet.
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import dpMixin from "../../mixins/dp-mixin";
import {mapActions, mapState} from "vuex";
import {hasLogoChoice, yesNoOptions, todoWithLogoOptions} from '../../Interface/partnershipFolderDatas';

require('../../assets/style/Pfolder/partnership-folder.css');

export default {
    name: 'ExistingLogo',
    mixins: [dpMixin],
    computed: {
        ...mapState('account', ['identity', 'currentPartner', 'opportunity']),
        ...mapState('globalStore', ['salesforce']),
        logoCreation() {
            return this.salesforce.opportunity.Cr_ation_logo__c;
        },
    },
    data() {
        return {
            hasLogoChoice,
            yesNoOptions,
            todoWithLogoOptions,
        }
    },
    methods: {
        ...mapActions('account', ['updatePartnerPropertyFromForm']),
        onFocus(event) {
            this.previousEditedValue = event.target.value;
        },
        onBlur(event, data) {
            this.updatePartnerPropertyFromForm({
                event: event,
                provider: this.$refs[event.target.name],
                data: data ? Object.assign({ previousEditedValue: this.previousEditedValue }, data) : undefined
            }).then(() => this.verifyFields());
        },
    }
}
</script>
