<template>
    <b-container fluid v-if="currentPartner.partnerShop">
        <!-- migrationForm -->
        <b-row class="mb-2">
            <b-col>
                <ValidationProvider name="migrations" rules="" ref="currentPartner.partnerShop.migrationChoice"
                                    v-slot="{ validate, classes, errors }">
                    <b-form-radio-group
                        @change.native="onBlur($event, { partnerShop: currentPartner.partnerShop })"
                        type="radio"
                        name="currentPartner.partnerShop.migrationChoice"
                        v-model="currentPartner.partnerShop.migrationChoice"
                        :options="hasPrestashopChoice"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                    >
                    </b-form-radio-group>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import {hasPrestashopChoice} from '../../Interface/partnershipFolderDatas';
import {mapActions, mapState} from "vuex";

require('../../assets/style/Pfolder/partnership-folder.css');

export default {
    name: 'Migration',
    data() {
        return {
            hasPrestashopChoice,
        }
    },
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
                provider: provider,
                data: data ? Object.assign({ previousEditedValue: this.previousEditedValue }, data) : undefined
            });
        },
    },
}
</script>
