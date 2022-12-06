<template>
    <b-container fluid class="keyword-group">
        <b-row>
            <b-col class="mb-2">
                <span>La prise de brief complète sera faite à la mise en place de la campagne
                        lors d'un rendez-vous téléphonique avec le traffic manager.
                </span>
            </b-col>
        </b-row>
        <b-row class="my-3">
            <b-col :cols="currentPartner.campaignKeywords && currentPartner.campaignKeywords.length >= 1 ? 11 : 12">
                <ValidationProvider name="Mots-clés prédéfinis"
                                    rules="expected"
                                    ref="currentPartner.campaignKeywords"
                                    v-slot="{ validate, classes, errors }"
                >
                    <label class="label">Mots-clés prédéfinis</label>
                    <b-form-tags
                        separator=",;"
                        id="campaign-keywords"
                        @input="onTagsChange($event, { partner: currentPartner }, 'campaignKeywords')"
                        :disabled="!allowedToEdit"
                        :readonly="!allowedToEdit"
                        :tag-variant="getColor"
                        size="md"
                        remove-on-delete
                        name="currentPartner.campaignKeywords"
                        v-model="currentPartner.campaignKeywords"
                    ></b-form-tags>
                </ValidationProvider>
            </b-col>
            <b-col cols="1" align-self="center" class="text-center">
                <b-button @click="uiActions.copy2clipboard(currentPartner.campaignKeywords)" size="md" class="button-copy" v-if="currentPartner.campaignKeywords && currentPartner.campaignKeywords.length >= 1"
                          v-b-tooltip.hover title="Copier dans le presse-papier">
                    <i class="fas fa-copy"></i>
                </b-button>
            </b-col>
        </b-row>
        <b-row class="my-3">
            <b-col :cols="currentPartner.campaignLocalities && currentPartner.campaignLocalities.length >= 1 ? 11 : 12">
                <ValidationProvider name="Localités"
                                    rules="expected"
                                    ref="currentPartner.campaignLocalities"
                                    v-slot="{ validate, classes, errors }"
                >
                    <b-form-group label-for="campaign-localities">
                        <label class="label">Localités</label>
                        <b-form-tags
                            separator=",;"
                            input-id="campaign-localities"
                            @input="onCampaignLocalitiesChange($event, { partner: currentPartner }, 'campaignLocalities')"
                            :disabled="!allowedToEdit"
                            :readonly="!allowedToEdit"
                            :tag-variant="getColor"
                            size="md"
                            remove-on-delete
                            name="currentPartner.campaignLocalities"
                            v-model="campaignLocalities"
                            :state="campaignLocalitiesState"
                            :input-attrs="{ 'aria-describedby': 'tags-validation-help' }"
                        ></b-form-tags>
                        <small :class="classes">{{ errors[0] }}</small>
                        <template #description v-if="campaignLocalitiesState">
                            <div id="tags-validation-help" v-if="!campaignLocalities || !campaignLocalities.length || campaignLocalities.length <= 20">
                                Saisissez jusqu'à 20 localités au maximum.
                            </div>
                            <div id="tags-validation-help" v-else>
                                Vous avez saisi {{ campaignLocalities.length }}/20 localités.
                            </div>
                        </template>
                        <template #invalid-feedback v-else>
                            Vous ne pouvez pas enregister plus de 20 localités.
                        </template>
                    </b-form-group>
                </ValidationProvider>
            </b-col>
            <b-col cols="1" align-self="center" class="text-center">
                <b-button @click="uiActions.copy2clipboard(currentPartner.campaignLocalities)" size="md" class="button-copy" v-if="currentPartner.campaignLocalities && currentPartner.campaignLocalities.length >= 1"
                          v-b-tooltip.hover title="Copier dans le presse-papier">
                    <i class="fas fa-copy"></i>
                </b-button>
            </b-col>
        </b-row>
        <b-row class="my-3">
            <b-col md="7">
                <label class="label">Horaires de diffusion</label>
                <b-row class="my-3">
                    <TimeRanges
                        parentEntityName="partner"
                        :parentEntity="currentPartner"
                        :isCampaign="true"
                        :timeRanges="currentPartner.openingRanges"
                        :allowedToEdit="identity.allowedToEdit"
                    />
                </b-row>
            </b-col>
            <b-col md="5">
                <ValidationProvider name="Commentaires" ref="currentPartner.campaignComment" v-slot="{ validate, classes, errors }">
                    <label class="label">Commentaires</label>
                    <b-form-textarea
                        @focus="onFocus"
                        @blur="onBlur($event, { partner: currentPartner })"
                        :class="classes"
                        name="currentPartner.campaignComment"
                        v-model="currentPartner.campaignComment"
                        :disabled="!allowedToEdit"
                        :readonly="!allowedToEdit"
                        type="textarea"
                    ></b-form-textarea>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
        <b-row class="mt-4 mb-3">
            <b-col sm="6">
                <span>Pour une campagne local sur-mesure, choisir le mois et le thème de la campagne :</span>
            </b-col>
            <b-col sm="6" v-if="adplorerLink">
                <a class="redirect-link"
                   :href="adplorerLink" target="_blank">
                    <img alt="" src="../../assets/link-button.svg"/>
                    <span class="text">Résultat estimation Adplorer</span>
                </a>
            </b-col>
        </b-row>
        <b-row v-for="(item, index) in campaignOptions" :key="item.value" class="mb-3">
            <b-col sm="12" md="2" class="local-campaign__months">
                <ValidationProvider name="Mois selectionné" :ref="`currentPartner.campaignOptions.${index}.month`" v-slot="{ validate, classes, errors }">
                    <b-form-checkbox
                            @change.native="onCheckboxChange($event, { campaignOption: item, type: 'bool' })"
                            :name="`currentPartner.campaignOptions.${index}.month`"
                            v-model="checkedCampaigns[index]"
                            :label="item.label"
                            type="checkbox"
                            :disabled="!allowedToEdit"
                            :readonly="!allowedToEdit"
                    >
                        {{ localCampaignControls[item.month].label }}
                    </b-form-checkbox>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
            <b-col sm="12" md="10">
                <ValidationProvider name="sujet"
                                    :rules="{ required: checkedCampaigns[index], requiredCheckedField: checkedCampaigns[index] }"
                                    :ref="`currentPartner.campaignOptions.${index}.subject`"
                                    v-slot="{ validate, classes, errors }"
                >
                    <b-form-textarea
                            @focus="onFocus"
                            @blur="onCampaignChange($event, { campaignOption: item })"
                            v-model="item.subject"
                            :class="classes"
                            :name="`currentPartner.campaignOptions.${index}.subject`"
                            type="textarea"
                            :disabled="!allowedToEdit || !checkedCampaigns[index]"
                            :readonly="!allowedToEdit"
                    ></b-form-textarea>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
require('../../assets/style/Pfolder/partnership-folder.css');

import { localCampaignControls } from '../../Interface/partnershipFolderDatas';
import { uiActions, validateSection } from '@/_helpers';
import { mapActions, mapState } from 'vuex';
import { extend } from 'vee-validate';
import TimeRanges from './TimeRanges';

extend('requiredCheckedField', validateSection.expectedCheckedField);

export default {
    name: 'AdwordCampaignCustom',
    components: {
        TimeRanges,
    },
    computed: {
        ...mapState('account', ['identity', 'currentPartner']),
        ...mapState('globalStore', ['adplorer']),
        allowedToEdit() {
            return this.identity.allowedToEdit;
        },
        getColor() {
            return this.identity.allowedToEdit ? 'local-orange' : 'local-black';
        },
        campaignLocalities: {
            get() {
                return this.currentPartner.campaignLocalities;
            },
            set(val) {
                this.currentPartner.campaignLocalities = val;
            }
        },
        campaignLocalitiesState() {
            return this.campaignLocalities && this.campaignLocalities.length <= this.maxCampaignLocalities;
        },
        adplorerLink() {
            if (Object.keys(this.adplorer).every(key => !this.adplorer[key])) {
                return null;
            }

            return `${process.env.ADPLORER_NEW_CAMPAIGN_URL}/${this.adplorer.companyId}/Order/${this.adplorer.orderId}/Step/6`;
        }
    },
    data: () => ({
        localCampaignControls,
        uiActions,
        previousEditedValue: null,
        campaignOptions: Object.assign([], localCampaignControls),
        checkedCampaigns: [],
        maxCampaignLocalities: 20,
    }),
    methods: {
        ...mapActions('account', ['updatePartnerPropertyFromForm', 'deletePartnerPropertyFromForm']),
        onFocus(event) {
            this.previousEditedValue = event.target.value;
        },
        onBlur(event, data) {
            let provider = event.target ? this.$refs[event.target.name] : null;
            this.updatePartnerPropertyFromForm({
                event: event,
                provider: provider ? (provider[0] || provider) : undefined,
                data: data ? Object.assign({ previousEditedValue: this.previousEditedValue }, data) : undefined
            });
        },
        onTagsChange(value, data, offset) {
            data.value = value;
            data.offset = offset;
            this.updatePartnerPropertyFromForm({
                data: data
            });
        },
        onCampaignLocalitiesChange(value, data, offset) {
            if (value && value.length > this.maxCampaignLocalities) {
                return;
            }
            this.onTagsChange(value, data, offset);
        },
        onCampaignChange(event, data) {
            if (!data.campaignOption) {
                return;
            }
            let campaignFound = this.findCampaignForMonth(data.campaignOption.month);

            if (!campaignFound) {
                delete data.campaignOption['id'];
                data.campaignOption.partner = this.currentPartner['@id'];
            } else if (!data.campaignOption.id) {
                campaignFound.subject = data.campaignOption.subject;
                data.campaignOption = campaignFound;
            }
            this.onBlur(event, data);
        },
        onCheckboxChange(event, data) {
            let campaignFound = data.campaignOption ? this.findCampaignForMonth(data.campaignOption.month) : null;
            if (!event.target.checked && campaignFound) {
                this.deletePartnerPropertyFromForm({ data: data }).then(this.loadCampaigns);
            }
        },
        loadCampaigns() {
            localCampaignControls.forEach((localCampaignControl, index) => {
                let campaignFound = this.findCampaignForMonth(localCampaignControl.month);
                this.campaignOptions[index] = campaignFound ? campaignFound : localCampaignControl;
                this.checkedCampaigns[index] = !!campaignFound;
            });
        },
        findCampaignForMonth(month) {
            return this.currentPartner.campaignOptions.find(campaign => campaign && parseInt(month) === parseInt(campaign.month));
        }
    },
    beforeMount() {
        this.loadCampaigns();
    },
}
</script>
