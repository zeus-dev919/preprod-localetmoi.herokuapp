<template>
    <b-container fluid>
        <b-row v-if="status.hasLogoCreation || (logoCreation && !isMiniOffer)">
            <b-col md="6" class="my-3">
                <label class="label">Logo existant à moderniser ?</label>
                <ValidationProvider name="logo existant"
                                    rules="oneOf:Oui,Non"
                                    ref="currentPartner.sites.0.todoWithLogo" v-slot="{ validate, classes, errors }">
                    <b-form-select
                        @change.native="onBlur($event, { site: currentPartner.sites[0] })"
                        :class="classes"
                        type="select"
                        :options="todoWithLogoOptions"
                        name="currentPartner.sites.0.todoWithLogo"
                        v-model="todoWithLogo"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                    ></b-form-select>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
            <b-col md="6" class="my-3">
                <label class="label">Marque, appellation à faire figurer</label>
                <ValidationProvider name="marque" rules="required|min:5|max:255" ref="currentPartner.sites.0.logoBrand" v-slot="{ validate, classes, errors }">
                    <div class="input-text">
                        <b-form-textarea
                            @focus="onFocus"
                            @blur="onBlur($event, { site: currentPartner.sites[0] })"
                            :class="classes"
                            type="textarea"
                            name="currentPartner.sites.0.logoBrand"
                            v-model="currentPartner.sites[0].logoBrand"
                            :disabled="!identity.allowedToEdit"
                            :readonly="!identity.allowedToEdit"
                        ></b-form-textarea>
                        <TextLengthMessage
                            :value="!currentSite || currentSite.logoBrand"
                            maxlength="255"
                        />
                    </div>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
            <b-col md="6" class="my-3" v-if="'Oui' === todoWithLogo">
                <label class="label">Donner des précisions au graphiste sur le résultat attendu</label>
                <ValidationProvider name="précisions" rules="min:5" ref="currentPartner.sites.0.logoDetails" v-slot="{ validate, classes, errors }">
                    <b-form-textarea
                        @focus="onFocus"
                        @blur="onBlur($event, { site: currentPartner.sites[0] })"
                        :class="classes"
                        type="textarea"
                        name="currentPartner.sites.0.logoDetails"
                        v-model="currentPartner.sites[0].logoDetails"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                    ></b-form-textarea>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
            <b-col md="6" class="my-3">
                <label class="label">Slogan, claim, baseline à associer</label>
                <ValidationProvider name="slogan" rules="min:5|expected" ref="currentPartner.sites.0.logoClaim" v-slot="{ validate, classes, errors }">
                    <b-form-textarea
                        @focus="onFocus"
                        @blur="onBlur($event, { site: currentPartner.sites[0] })"
                        :class="classes"
                        type="textarea"
                        name="currentPartner.sites.0.logoClaim"
                        v-model="currentPartner.sites[0].logoClaim"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                    ></b-form-textarea>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
            <b-col md="6" class="my-3">
                <label class="label">Typographie à respecter</label>
                <ValidationProvider name="typographie" rules="min:5|expected" ref="currentPartner.sites.0.logoFonts"
                                    v-slot="{ validate, classes, errors }">
                    <b-form-textarea
                        @focus="onFocus"
                        @blur="onBlur($event, { site: currentPartner.sites[0] })"
                        :class="classes"
                        type="textarea"
                        name="currentPartner.sites.0.logoFonts"
                        v-model="currentPartner.sites[0].logoFonts"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                    ></b-form-textarea>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
            <b-col md="6" class="my-3">
                <label class="label">Éléments figuratifs à intégrer (illustration symbole, ...)</label>
                <ValidationProvider name="éléments figuratifs" rules="min:5" ref="currentPartner.sites.0.logoValues"
                                    v-slot="{ validate, classes, errors }">
                    <b-form-textarea
                        @focus="onFocus"
                        @blur="onBlur($event, { site: currentPartner.sites[0] })"
                        :class="classes"
                        type="textarea"
                        name="currentPartner.sites.0.logoValues"
                        v-model="currentPartner.sites[0].logoValues"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                    ></b-form-textarea>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
            <b-col md="6" class="my-3">
                <label class="label">Couleurs souhaitées</label>
                <ValidationProvider name="couleurs souhaitées" rules="required|min:5" ref="currentPartner.sites.0.logoColors"
                                    v-slot="{ validate, classes, errors }">
                    <b-form-textarea
                        @focus="onFocus"
                        @blur="onBlur($event, { site: currentPartner.sites[0] })"
                        :class="classes"
                        type="textarea"
                        name="currentPartner.sites.0.logoColors"
                        v-model="currentPartner.sites[0].logoColors"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                    ></b-form-textarea>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
            <b-col md="6" class="my-3">
                <label class="label">Image, valeurs, à faire passer dans le logo</label>
                <ValidationProvider name="image, valeurs" rules="required|min:5" ref="currentPartner.sites.0.logoPictures"
                                    v-slot="{ validate, classes, errors }">
                    <b-form-textarea
                        @focus="onFocus"
                        @blur="onBlur($event, { site: currentPartner.sites[0] })"
                        :class="classes"
                        type="textarea"
                        name="currentPartner.sites.0.logoPictures"
                        v-model="currentPartner.sites[0].logoPictures"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                    ></b-form-textarea>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
            <b-col>
                <label class="label">Logo de référence demo.local.fr (nom + numéro)</label>
                <ValidationProvider name="Logo de référence" rules="min:5|max:255" ref="currentPartner.sites.0.referenceLogo"
                                    v-slot="{ validate, classes, errors }">
                    <div class="input-text">
                        <b-form-textarea
                            @focus="onFocus"
                            @blur="onBlur($event, { site: currentPartner.sites[0] })"
                            :class="classes"
                            type="textarea"
                            name="currentPartner.sites.0.referenceLogo"
                            v-model="currentPartner.sites[0].referenceLogo"
                            :disabled="!identity.allowedToEdit"
                            :readonly="!identity.allowedToEdit"
                        ></b-form-textarea>
                        <TextLengthMessage
                            :value="!currentSite || currentSite.referenceLogo"
                            maxlength="255"
                        />
                    </div>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
        <b-row v-else-if="!isMiniOffer">
            <b-col>
                Le partenaire ne souhaitant pas une création logo, un lettrage de l'enseigne de son entreprise sera écrite en texte sur le site internet.
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import {mapActions, mapState} from "vuex";
import {hasLogoChoice, todoWithLogoOptions} from '../../Interface/partnershipFolderDatas'
import TextLengthMessage from './TextLengthMessage';
import dpMixin from "../../mixins/dp-mixin";

require('../../assets/style/Pfolder/partnership-folder.css');

export default {
    name: 'Logo',
    components: {
        TextLengthMessage
    },
    mixins: [dpMixin],
    computed: {
        ...mapState('account', ['identity', 'currentPartner']),
        ...mapState('globalStore', ['status', 'salesforce']),
        isMiniOffer() {
            return this.status.isLocalWeb || this.status.isLocalStart;
        },
        logoCreation() {
            return this.salesforce.opportunity.Cr_ation_logo__c;
        },
    },
    data() {
        return {
            hasLogoChoice,
            todoWithLogoOptions,
            todoWithLogo: '',
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
            });
            this.verifyFields();
        }
    },
    mounted() {
        this.todoWithLogo = this.currentPartner.sites[0].todoWithLogo;
    }
}
</script>
