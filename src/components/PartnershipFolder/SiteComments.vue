<template>
    <b-container fluid v-if="currentPartner.partnerShop">
        <b-row>
            <b-col>
                <ValidationProvider name="informations utiles" rules="required:true" ref="currentPartner.partnerShop.siteDescription" v-slot="{ validate, classes, errors }">
                    <label class="label">Informations utiles pour la réalisation du site</label>
                    <b-form-textarea
                            @focus="onFocus"
                            @blur="onBlur($event, { partnerShop: currentPartner.partnerShop })"
                            :class="classes"
                            name="currentPartner.partnerShop.siteDescription"
                            v-model="currentPartner.partnerShop.siteDescription"
                            :disabled="!identity.allowedToEdit"
                            :readonly="!identity.allowedToEdit"
                            type="textarea"
                    ></b-form-textarea>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
    require('../../assets/style/Pfolder/partnership-folder.css');

    import {mapActions, mapState} from "vuex";

    export default {
        name: 'SiteComments',
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
