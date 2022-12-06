<template>
    <b-container fluid v-if="currentPartner.partnerShop">
        <!-- contentAuthoringForm -->
        <b-row>
            <b-col>
                <ValidationProvider name="Texte pour la page d'accueil" rules="min:10" ref="currentPartner.partnerShop.homepageContent" v-slot="{ validate, classes, errors }">
                    <label class="label">Texte pour la page d'accueil</label>
                    <b-form-textarea
                            @focus="onFocus"
                            @blur="onBlur($event, { partnerShop: currentPartner.partnerShop })"
                            :class="classes"
                            type="textarea"
                            v-model="currentPartner.partnerShop.homepageContent"
                            name="currentPartner.partnerShop.homepageContent"
                            :disabled="!identity.allowedToEdit"
                            :readonly="!identity.allowedToEdit"
                    ></b-form-textarea>
                    <small>{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
        <b-row class="mt-3 mb-3">
            <b-col>
                <ValidationProvider name="Présentation de la boutique" rules="min:10" ref="currentPartner.partnerShop.shopDescription" v-slot="{ validate, classes, errors }">
                    <label class="label">Présentation de la boutique</label>
                    <b-form-textarea
                            @focus="onFocus"
                            @blur="onBlur($event, { partnerShop: currentPartner.partnerShop })"
                            :class="classes"
                            type="textarea"
                            v-model="currentPartner.partnerShop.shopDescription"
                            name="currentPartner.partnerShop.shopDescription"
                            :disabled="!identity.allowedToEdit"
                            :readonly="!identity.allowedToEdit"
                    ></b-form-textarea>
                    <small>{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import {mapActions, mapState} from "vuex";

    require('../../assets/style/Pfolder/partnership-folder.css');

    export default {
        name: 'ContentAuthoring',
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
                if (data.partnerShop && !data.partnerShop.id) {
                    data.partnerShop.partner = this.currentPartner['@id'];
                }
                this.updatePartnerPropertyFromForm({
                    event: event,
                    provider: provider[0] || provider,
                    data: data ? Object.assign({ previousEditedValue: this.previousEditedValue }, data) : undefined
                });
            },
        }
    }
</script>
