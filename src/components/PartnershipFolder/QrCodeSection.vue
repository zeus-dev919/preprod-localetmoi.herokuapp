<template>
    <b-container fluid>
        <b-row class="mb-3">
            <b-col sm="5">
                <label class="label">Souhaitez-vous que l'on crée un QR Code pour permettre à vos clients de consulter votre carte en ligne ?</label>
                <ValidationProvider name="QrCode option" rules="" ref="salesforce.opportunity.QR_Code__c"
                                    v-slot="{ validate, classes, errors }">
                    <b-form-select
                        @change.native="onBlur($event, { opportunity: salesforce.opportunity, type: 'bool' })"
                        @focus="onFocus"
                        :class="classes"
                        name="salesforce.opportunity.QR_Code__c"
                        v-model="isQRCodeActive"
                        :options="yesNoOptions"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                    ></b-form-select>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
        <b-row v-if="isQRCodeActive">
            <b-col md="3" sm="6" class="ml-3">
                <b-row>
                    <span>
                        À quelle date pensez-vous nous communiquer votre carte ?
                    </span>
                </b-row>
                <b-row>
                    <span class="sub-text">(Sensibiliser sur la qualité des éléments à transmettre)</span>
                </b-row>
            </b-col>
            <b-col md="3" sm="6">
                <ValidationProvider name="Date de transmission de la carte"
                                    ref="currentPartner.partnerHotelResto.cardSendDate"
                                    v-slot="{ validate, classes, errors }">
                    <b-form-input
                        @focus="onFocus"
                        @blur.native="onBlur($event, { partnerHotelResto: currentPartner.partnerHotelResto })"
                        v-model="cardSendDate"
                        name="currentPartner.partnerHotelResto.cardSendDate"
                        :class="classes"
                        type="date"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                    ></b-form-input>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { yesNoOptions } from '../../Interface/partnershipFolderDatas'
import { dateHelpers, validateSection } from '../../_helpers';
import dpMixin from "../../mixins/dp-mixin";

require('../../assets/style/Pfolder/partnership-folder.css');

export default {
    name: 'QrCodeSection',
    mixins: [dpMixin],
    computed: {
        ...mapState('account', ['identity', 'currentPartner']),
        ...mapState('globalStore', ['status', 'salesforce']),
        isQRCodeActive: {
            set(value) {
                this.qrCodeActive = value;
                this.salesforce.opportunity.QR_Code__c = value;
            },
            get() {
                return this.qrCodeActive;
            }
        },
        cardSendDate: {
            get() {
                return this.currentPartner.partnerHotelResto.cardSendDate
                    ? dateHelpers.dateToStringForInput(this.currentPartner.partnerHotelResto.cardSendDate)
                    : null;
            },
            set(value) {
                return this.currentPartner.partnerHotelResto.cardSendDate = value;
            }
        },
    },
    data() {
        return {
            yesNoOptions,
            qrCodeActive: null
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
        validateFields(refs, entity) {
            if (!this.identity.allowedToEdit) {
                return;
            }

            let isValid = 'reset';
            if (this.isQRCodeActive) {
                isValid = !!this.cardSendDate ? true : null;
            }

            this.validateDisplayColor(isValid);
        },
        validateDisplayColor(isValid) {
            return validateSection.displayColorStateOnSection('qr-code-section', isValid);
        }
    },
    mounted() {
        this.qrCodeActive = this.status.isQrcodeEnabled;
    }
}
</script>
