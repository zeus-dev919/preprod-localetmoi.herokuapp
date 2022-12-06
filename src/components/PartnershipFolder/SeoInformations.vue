<template>
    <b-container fluid class="keyword-group">
        <b-row class="mb-3">
            <b-col>
                <span class="form-description">Mots-clés liés à l'activité</span>
            </b-col>
        </b-row>
        <!-- referencingForm -->
        <b-row class="mt-3 mb-3">
            <b-col cols="11">
                <ValidationProvider name="Mots-clés" rules="expected" ref="currentPartner.sites.0.seoKeywords"
                                    v-slot="{ validate, classes, errors }">
                    <label class="label">Quels mots saississent vos clients sur Google pour chercher votre entreprise ou
                        vos services ?
                    </label>
                    <b-form-tags
                        separator=",;"
                        id="keywords-1"
                        @input="onInputTagsChange($event, currentPartner.sites[0], 'seoKeywords')"
                        :tag-validator="validator"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                        :tag-variant="getColor"
                        size="md"
                        placeholder="Ajouter un mot clé. Valider chaque expression avec la touche Entrer."
                        :class="classes"
                        remove-on-delete
                        name="currentPartner.sites.0.seoKeywords"
                        v-model="currentPartner.sites[0].seoKeywords"
                    ></b-form-tags>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
            <b-col cols="1" align-self="center" class="text-center">
                <b-button @click="uiActions.copy2clipboard(currentPartner.sites[0].seoKeywords)" size="md"
                          class="button-copy"
                          v-if="currentPartner.sites[0].seoKeywords && currentPartner.sites[0].seoKeywords.length"
                          v-b-tooltip.hover title="Copier dans le presse-papier">
                    <i class="fas fa-copy"></i>
                </b-button>
            </b-col>
        </b-row>
        <b-row class="mt-3 mb-3">
            <b-col cols="11">
                <label class="label">Zone d'intervention (en km) </label>
                <ValidationProvider name="zone d'intervention" rules="integer|expected"
                                    ref="currentPartner.sites.0.coverageArea"
                                    v-slot="{ validate, classes, errors }">
                    <b-form-input
                        id="keywords-2"
                        type="number"
                        min="0"
                        :class="classes"
                        @blur="onBlur($event, { site: currentPartner.sites[0] })"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                        name="currentPartner.sites.0.coverageArea"
                        v-model="currentPartner.sites[0].coverageArea"
                    ></b-form-input>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
        <b-row class="mt-3 mb-3">
            <b-col cols="11">
                <ValidationProvider name="Villes et communes" ref="currentPartner.sites.0.seoCities"
                                    v-slot="{ validate, classes, errors }">
                    <label class="label">Villes et communes ciblées pour le référencement</label>
                    <b-form-tags
                        separator=",;"
                        id="keywords-3"
                        @input="onInputTagsChange($event, currentPartner.sites[0], 'seoCities')"
                        :tag-validator="validator"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                        :tag-variant="getColor"
                        size="md"
                        placeholder="Ajouter un mot clé. Valider chaque expression avec la touche Entrer."
                        :class="classes"
                        remove-on-delete
                        name="currentPartner.sites.0.seoCities"
                        v-model="currentPartner.sites[0].seoCities"
                    ></b-form-tags>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
            <b-col cols="1" align-self="center" class="text-center"
                   v-if="currentPartner.sites[0].seoCities && currentPartner.sites[0].seoCities.length >= 1">
                <b-button @click="uiActions.copy2clipboard(currentPartner.sites[0].seoCities)" size="md"
                          class="button-copy"
                          v-b-tooltip.hover title="Copier dans le presse-papier">
                    <i class="fas fa-copy"></i>
                </b-button>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { uiActions } from "@/_helpers";
import dpMixin from "../../mixins/dp-mixin";

require('../../assets/style/Pfolder/partnership-folder.css');

export default {
    name: 'SeoInformations',
    mixins: [dpMixin],
    computed: {
        ...mapState('account', ['identity', 'currentPartner']),
        getColor() {
            return this.identity.allowedToEdit ? 'local-orange' : 'local-black';
        }
    },
    data() {
        return {
            uiActions
        }
    },
    methods: {
        ...mapActions('account', ['updatePartnerPropertyFromForm']),
        onBlur(event, data) {
            this.updatePartnerPropertyFromForm({
                event: event,
                provider: this.$refs[event.target.name],
                data: data ? Object.assign({ previousEditedValue: this.previousEditedValue }, data) : undefined
            });
            this.verifyFields();
        },
        onInputTagsChange(value, site, offset) {
            let promise;
            if (site && !site.id) {
                site[offset] = value;
                promise = this.updatePartnerPropertyFromForm({
                    data: {
                        site: site
                    }
                });
            } else {
                promise = this.updatePartnerPropertyFromForm({
                    data: {
                        value: value,
                        offset: offset,
                        site: site
                    }
                });
            }

            promise.then(() => this.verifyFields());
        },
        validator(tag) {
            return tag.length > 2;
        }
    }
}
</script>
