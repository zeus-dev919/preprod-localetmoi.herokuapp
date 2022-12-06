<template>
    <b-container fluid>
        <b-row>
            <b-col sm="12" md="4" class="website-template" v-for="template in availableSiteModels" :key="template.name">
                <ValidationProvider name="modèle de site" rules="required" ref="currentPartner.sites.0.siteModel"
                                    v-slot="{ validate, classes, errors }">
                    <b-form-radio
                        @change.native="onBlur($event, { site: currentPartner.sites[0] })"
                        v-model="currentPartner.sites[0].siteModel"
                        :value="template.name"
                        name="currentPartner.sites.0.siteModel"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                        type="radio"
                        class="website-template __item"
                    ></b-form-radio>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
                <b-col md="5">
                    <a :href="template.url" target="_blank">
                        <img :src="require(`../../assets/partnership-file/${template.visual}`)" :alt="template.name">
                    </a>
                    <h1 class="text-center website-template __title">{{ template.name }}</h1>
                </b-col>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
require('../../assets/style/Pfolder/partnership-folder.css');

import dpMixin from "../../mixins/dp-mixin";
import { mapActions, mapState } from "vuex";
import {
    templatesBoutique,
    templatesImmo,
    templatesAuto,
    templatesHotel,
    templatesResto
} from '../../Interface/websiteTemplates';

export default {
    name: 'WebsiteTemplate',
    mixins: [dpMixin],
    computed: {
        ...mapState('account', ['identity', 'currentPartner']),
        ...mapState('globalStore', ['status']),
    },
    data() {
        return {
            templatesBoutique,
            templatesImmo,
            templatesAuto,
            templatesHotel,
            templatesResto,
            availableSiteModels: [],
        }
    },
    methods: {
        ...mapActions('account', ['updatePartnerPropertyFromForm']),
        onBlur(event, data) {
            let provider = this.$refs[event.target.name];
            this.updatePartnerPropertyFromForm({
                event: event,
                provider: provider[0] || provider,
                data: data ? Object.assign({ previousEditedValue: this.previousEditedValue }, data) : undefined
            });
            this.verifyFields();
        },
        getSiteModels() {
            switch (true) {
                case this.status['isLocalResto']:
                    return templatesResto;
                case this.status['isLocalHotel']:
                    return templatesHotel;
                case this.status['isLocalAuto'] || this.status['isLocalAutoPlus']:
                    return templatesAuto;
                case this.status['isLocalImmo'] || this.status['isLocalImmoPlus']:
                    return templatesImmo;
                default:
                    return [];
            }
        }
    },
    mounted() {
        this.availableSiteModels = this.getSiteModels();
    },
}
</script>
