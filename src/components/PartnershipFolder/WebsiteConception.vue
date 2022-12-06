<template>
    <b-container fluid>
        <b-row class="mb-3">
            <b-col md="6">
                <b-row align-v="end">
                    <b-col md="6">
                        <ValidationProvider name="Couleur dominante" rules="expected|max:255" ref="currentPartner.sites.0.mainColor"
                                            v-slot="{ validate, classes, errors }">
                            <label class="label">Couleur dominante</label>
                            <div class="input-text">
                                <b-form-input
                                    @focus="onFocus"
                                    @change.native="onColorChange($event, { site: currentPartner.sites[0] })"
                                    type="color"
                                    :disabled="!identity.allowedToEdit"
                                    :readonly="!identity.allowedToEdit"
                                    name="currentPartner.sites.0.mainColor"
                                    v-model="currentPartner.sites[0].mainColor"
                                ></b-form-input>
                                <TextLengthMessage
                                    :value="!currentSite || currentSite.mainColor"
                                    maxlength="255"
                                />
                            </div>
                            <small :class="classes">{{ errors[0] }}</small>
                        </ValidationProvider>
                    </b-col>
                    <b-col md="4" class="mb-2">
                        <span>{{ currentPartner.sites[0].mainColor ? currentPartner.sites[0].mainColor : 'Aucune couleur sélectionnée'}}</span>
                    </b-col>
                </b-row>
            </b-col>
            <b-col md="6">
                <b-row align-v="end">
                    <b-col md="6">
                        <ValidationProvider name="Couleur secondaire" rules="max:255" ref="currentPartner.sites.0.secondaryColor"
                                            v-slot="{ validate, classes, errors }">
                            <label class="label">Couleur secondaire</label>
                            <div class="input-text">
                                <b-form-input
                                    @focus="onFocus"
                                    @change.native="onColorChange($event, { site: currentPartner.sites[0] })"
                                    type="color"
                                    :disabled="!identity.allowedToEdit"
                                    :readonly="!identity.allowedToEdit"
                                    name="currentPartner.sites.0.secondaryColor"
                                    v-model="currentPartner.sites[0].secondaryColor"
                                ></b-form-input>
                                <TextLengthMessage
                                    :value="!currentSite || currentSite.secondaryColor"
                                    maxlength="255"
                                />
                            </div>
                            <small :class="classes">{{ errors[0] }}</small>
                        </ValidationProvider>
                    </b-col>
                    <b-col md="4" class="mb-2">
                        <span>{{currentPartner.sites[0].secondaryColor ? currentPartner.sites[0].secondaryColor : 'Aucune couleur sélectionnée'}}</span>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
        <b-row class="mt-3 mb-3">
            <b-col md="6">
                <ValidationProvider name="Référence palette" rules="min:5|max:80" ref="currentPartner.sites.0.colorScheme"
                                    v-slot="{ validate, classes, errors }">
                    <label class="label">Référence palette ou code couleur</label>
                    <div class="input-text">
                        <b-form-textarea
                            @focus="onFocus"
                            @blur="onBlur($event, { site: currentPartner.sites[0] })"
                            type="textarea"
                            :class="classes"
                            :disabled="!identity.allowedToEdit"
                            :readonly="!identity.allowedToEdit"
                            name="currentPartner.sites.0.colorScheme"
                            v-model="currentPartner.sites[0].colorScheme"
                        ></b-form-textarea>
                        <TextLengthMessage
                            :value="!currentSite || currentSite.colorScheme"
                            maxlength="80"
                        />
                    </div>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
            <b-col md="6">
                <ValidationProvider name="Style de site" rules="expected|min:5|max:255" ref="currentPartner.sites.0.siteStyle"
                                    v-slot="{ validate, classes, errors }">
                    <label class="label">Style de site</label>
                    <div class="input-text">
                        <b-form-textarea
                            @focus="onFocus"
                            @blur="onBlur($event, { site: currentPartner.sites[0] })"
                            type="textarea"
                            :class="classes"
                            :disabled="!identity.allowedToEdit"
                            :readonly="!identity.allowedToEdit"
                            name="currentPartner.sites.0.siteStyle"
                            v-model="currentPartner.sites[0].siteStyle"
                        ></b-form-textarea>
                        <TextLengthMessage
                            :value="!currentSite || currentSite.siteStyle"
                            maxlength="255"
                        />
                    </div>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
        <b-row class="mt-3 mb-3">
            <b-col>
                <ValidationProvider name="Site référence" rules="expected|min:5|max:255" ref="currentPartner.sites.0.referenceDemo"
                                    v-slot="{ validate, classes, errors }">
                    <label class="label">Site référence demo.local.fr</label>
                    <div class="input-text">
                        <b-form-textarea
                            @focus="onFocus"
                            @blur="onBlur($event, { site: currentPartner.sites[0] })"
                            type="textarea"
                            :class="classes"
                            :disabled="!identity.allowedToEdit"
                            :readonly="!identity.allowedToEdit"
                            name="currentPartner.sites.0.referenceDemo"
                            v-model="currentPartner.sites[0].referenceDemo"
                        ></b-form-textarea>
                        <TextLengthMessage
                            :value="!currentSite || currentSite.referenceDemo"
                            maxlength="255"
                        />
                    </div>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
        <b-row class="mt-3 mb-3">
            <b-col>
                <ValidationProvider name="Motivation du professionnel" rules="required|min:5" ref="currentPartner.sites.0.motivation"
                                    v-slot="{ validate, classes, errors }">
                    <label class="label">Motivation du professionnel / indications pour le graphiste</label>
                    <b-form-textarea
                            @focus="onFocus"
                            v-if="identity.allowedToEdit"
                            v-autoresize
                            rows="3"
                            @blur="onBlur($event, { site: currentPartner.sites[0] })"
                            type="textarea"
                            :disabled="!identity.allowedToEdit"
                            :readonly="!identity.allowedToEdit"
                            name="currentPartner.sites.0.motivation"
                            v-model="currentPartner.sites[0].motivation"
                    ></b-form-textarea>
                    <div class="pre-line-text" v-else-if="!identity.allowedToEdit &&
                     currentPartner.sites[0].motivation &&
                     currentPartner.sites[0].motivation.length">
                        {{ currentPartner.sites[0].motivation }}
                    </div>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
        <b-row class="mt-5">
            <b-col md="6">
                <ValidationProvider name="Google Maps" ref="currentPartner.sites.0.withGoogleMap" v-slot="{ validate, classes, errors }">
                    <label>
                        <b-form-checkbox
                            @change.native="onGraphicalElementChecked({
                                site: currentPartner.sites[0],
                                type: 'bool',
                                offset: 'withGoogleMap',
                                value: currentPartner.sites[0].withGoogleMap
                            })"
                            type="checkbox"
                            :disabled="!identity.allowedToEdit"
                            :readonly="!identity.allowedToEdit"
                            name="currentPartner.sites.0.withGoogleMap"
                            v-model="withoutGoogleMap"
                        >
                        Pas de Google Maps
                        </b-form-checkbox>
                    </label>
                </ValidationProvider>
            </b-col>
            <b-col md="6">
                <ValidationProvider name="Formulaire de contact" ref="currentPartner.sites.0.withContactForm"
 v-slot="{ validate, classes, errors }">
                    <label>
                        <b-form-checkbox
                            @change.native="onGraphicalElementChecked({
                                site: currentPartner.sites[0],
                                type: 'bool',
                                offset: 'withContactForm',
                                value: currentPartner.sites[0].withContactForm
                            })"
                            type="checkbox"
                            :disabled="!identity.allowedToEdit"
                            :readonly="!identity.allowedToEdit"
                            name="currentPartner.sites.0.withContactForm"
                            v-model="withoutContactForm"
                        >
                        Pas de formulaire de contact
                        </b-form-checkbox>
                    </label>
                </ValidationProvider>
            </b-col>
        </b-row>

    </b-container>
</template>

<script>
import TextLengthMessage from './TextLengthMessage';
import autoresize from '../../directives/AutoResize';
import dpMixin from "../../mixins/dp-mixin";
import {mapActions, mapState} from "vuex";

require('../../assets/style/Pfolder/partnership-folder.css');

export default {
    components: {
        TextLengthMessage
    },
    directives: {
        autoresize
    },
    name: 'WebsiteConception',
    mixins: [dpMixin],
    data() {
        return {
            previousEditedValue: null,
        }
    },
    computed: {
        ...mapState('account', ['identity', 'currentPartner']),
        withoutGoogleMap: {
            get() {
                return true !== this.currentPartner.sites[0].withGoogleMap;
            },
            set(val) {
                this.currentPartner.sites[0].withGoogleMap = false === val;
            }
        },
        withoutContactForm: {
            get() {
                return true !== this.currentPartner.sites[0].withContactForm;
            },
            set(val) {
                this.currentPartner.sites[0].withContactForm = false === val;
            }
        }
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
            }).then(() => this.verifyFields());
        },
        onColorChange(event, data) {
            let provider = this.$refs[event.target.name];
            this.updatePartnerPropertyFromForm({
                event: event,
                provider: provider[0] || provider,
                data: data ? Object.assign({ previousEditedValue: this.previousEditedValue }, data) : undefined
            }).then(() => this.verifyFields());
        },
        onGraphicalElementChecked(data) {
            this.updatePartnerPropertyFromForm({
                data: data
            }).then(() => this.verifyFields());
        }
    }
}
</script>
