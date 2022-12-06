<template>
    <b-container fluid>
        <b-row class="mb-3">
            <b-col>
                <span class="form-description">Moyens de paiement</span>
            </b-col>
        </b-row>
        <!-- shopPaymentDeliveryForm -->
        <b-row class="mb-3">
            <b-col v-for="(paymentMethod, index) in shopPaymentMethods" :key="paymentMethod.value" lg="2" md="3">
                <b-form-checkbox-group
                    @change.native="onPaymentMethodChange($event, { partner: currentPartner })"
                    :name="`currentPartner.paymentModes[${index}].name`"
                    :options="[ paymentMethod ]"
                    v-model="checkedPaymentMethods"
                    :disabled="!identity.allowedToEdit"
                    :readonly="!identity.allowedToEdit"
                    type="checkbox"
                ></b-form-checkbox-group>
            </b-col>
            <b-col sm="12" md="2" lg="2">
                <ValidationProvider name="nom de la banque" rules="min:3" ref="currentPartner.bankDescription"
                                    v-slot="{ validate, classes, errors }">
                    <b-form-input
                        @focus="onFocus"
                        @blur="onBlur($event, { partner: currentPartner })"
                        type="text"
                        :class="classes"
                        name="currentPartner.bankDescription"
                        v-model="currentPartner.bankDescription"
                        :disabled="!identity.allowedToEdit || -1 === checkedPaymentMethods.indexOf('Banque')"
                        :readonly="!identity.allowedToEdit"
                    ></b-form-input>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
        <b-row class="mb-3">
            <b-col>
                <span class="form-description">Livraison</span>
            </b-col>
        </b-row>
        <b-row class="mt-3 mb-3">
            <b-col id="payment-method" lg="2" md="3">
                <ValidationProvider name="Livraison possible"
                                    ref="currentPartner.partnerShop.deliveryAvailable"
                                    v-slot="{ validate, classes, errors }">
                    <b-form-radio-group
                        @change.native="onBlur($event, { partnerShop: currentPartner.partnerShop, type: 'bool' })"
                        name="currentPartner.partnerShop.deliveryAvailable"
                        v-model="currentPartner.partnerShop.deliveryAvailable"
                        :options="yesNoOptions"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                        type="checkbox">
                    </b-form-radio-group>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
        <b-row>
            <b-col v-for="(item, index) in shopDeliveryMethods" :key="item.value" md="2" lg="1" class="display-context">
                <b-form-checkbox-group
                    @change.native="onDeliveryMethodChange($event, { partner: currentPartner })"
                    v-model="checkedDeliveryMethods"
                    :name="`currentPartner.deliveryModes[${index}].name`"
                    :options="[ item ]"
                    :disabled="!identity.allowedToEdit"
                    :readonly="!identity.allowedToEdit"
                    type="checkbox"
                ></b-form-checkbox-group>
            </b-col>
            <b-col v-if="isOtherDeliveryMethodChecked()" sm="12" md="12" lg="4" class="display-context__input">
                <ValidationProvider name="Autre mode de livraison" rules="min:3"
                                    :ref="`currentPartner.deliveryModes[${getOtherDeliveryMethodIndex()}].name`"
                                    v-slot="{ validate, classes, errors }">
                    <label class="label">Autre(s)</label>
                    <b-form-input
                        @focus="onFocus"
                        @blur.native="onDeliveryMethodChange($event, { partner: currentPartner })"
                        type="text"
                        :class="classes"
                        :name="`currentPartner.deliveryModes[${getOtherDeliveryMethodIndex()}].name`"
                        v-model="otherDeliveryMethod.name"
                        :disabled="!identity.allowedToEdit || !isOtherDeliveryMethodChecked()"
                        :readonly="!identity.allowedToEdit || !isOtherDeliveryMethodChecked()"
                    ></b-form-input>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
        <b-row class="mt-3 mb-3">
            <b-col cols="12">
                <ValidationProvider name="Adresse de retrait" rules="min:3" ref="atShopDeliveryMode.deliveryAddress"
                                    v-slot="{ validate, classes, errors }">
                    <label class="label">Adresse de retrait</label>
                    <b-form-input
                        @focus="onFocus"
                        @blur="onAtShopDeliveryModeChange($event, { partner: currentPartner })"
                        type="text"
                        :class="classes"
                        name="atShopDeliveryMode.deliveryAddress"
                        v-model="deliveryAddress"
                        :disabled="!identity.allowedToEdit || !atShopDeliveryModeChecked"
                        :readonly="!identity.allowedToEdit"
                    ></b-form-input>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
        <b-row class="mt-3 mb-3">
            <b-col cols="12">
                <ValidationProvider name="Horaire de retrait" ref="atShopDeliveryMode.deliverySchudle"
                                    v-slot="{ validate, classes, errors }">
                    <label class="label">Horaire de retrait</label>
                    <b-form-textarea
                        @focus="onFocus"
                        @blur="onAtShopDeliveryModeChange($event, { partner: currentPartner })"
                        type="text"
                        :class="classes"
                        name="atShopDeliveryMode.deliverySchudle"
                        v-model="deliverySchudle"
                        :disabled="!identity.allowedToEdit || !atShopDeliveryModeChecked"
                        :readonly="!identity.allowedToEdit"
                    ></b-form-textarea>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
        <b-row class="my-3">
            <b-col lg="4" md="6">
                <ValidationProvider name="Temps de préparation" ref="atShopDeliveryMode.preparationTime"
                                    v-slot="{ validate, classes, errors }">
                    <label class="label">Temps de préparation (7 jours max soit 9 999 minutes)</label>
                    <div class="d-inline-flex">
                        <b-form-input
                            @focus="onFocus"
                            @blur="onAtShopDeliveryModeChange($event, { partner: currentPartner , type: 'int'})"
                            type="number"
                            :class="classes"
                            name="atShopDeliveryMode.preparationTime"
                            v-model="deliveryPreparationTime"
                            :disabled="!identity.allowedToEdit || !atShopDeliveryModeChecked"
                            :readonly="!identity.allowedToEdit"
                        ></b-form-input>
                        <span class="minutes">minutes</span>
                    </div>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>

require('../../assets/style/Pfolder/partnership-folder.css');
import { validateSection } from "@/_helpers";
import dpMixin from "../../mixins/dp-mixin";
import { mapActions, mapState } from "vuex";
import {
    shopPaymentMethods,
    shopDeliveryMethods,
    yesNoOptions
} from '../../Interface/partnershipFolderDatas';

export default {
    name: 'ShopPaymentDelivery',
    mixins: [dpMixin],
    computed: {
        ...mapState('globalStore', ['paymentModes', 'deliveryModes']),
        ...mapState('account', ['identity', 'currentPartner']),
        deliveryAddress: {
            get() {
                return this.atShopDeliveryMode ? this.atShopDeliveryMode.deliveryAddress : null;
            },
            set(val) {
                if (this.atShopDeliveryMode) {
                    this.atShopDeliveryMode.deliveryAddress = val;
                }
            }
        },
        deliverySchudle: {
            get() {
                let atShopDeliveryMode = this.findAtShopDeliveryMode();
                return atShopDeliveryMode ? atShopDeliveryMode.deliverySchudle : null;
            },
            set(val) {
                let atShopDeliveryMode = this.findAtShopDeliveryMode();
                if (atShopDeliveryMode) {
                    atShopDeliveryMode.deliverySchudle = val;
                }
            }
        },
        deliveryPreparationTime: {
            get() {
                return this.atShopDeliveryMode ? this.atShopDeliveryMode.preparationTime : null;
            },
            set(val) {
                if (this.atShopDeliveryMode) {
                    this.atShopDeliveryMode.preparationTime = val;
                }
            }
        }
    },
    data() {
        return {
            shopPaymentMethods,
            checkedPaymentMethods: [],
            shopDeliveryMethods,
            checkedDeliveryMethods: [],
            pickUpAddress: [],
            pickUpHours: [],
            yesNoOptions,
            atShopDeliveryMode: {},
            atShopDeliveryModeChecked: false,
            otherDeliveryMethod: {}
        };
    },
    methods: {
        ...mapActions('account', ['updatePartnerPropertyFromForm']),
        ...mapActions('globalStore', ['getPaymentModes']),
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
            }).then(() => this.verifyFields());
        },
        onPaymentMethodChange(event, data) {
            let newPaymentModes = [];
            this.checkedPaymentMethods.forEach(checkedPaymentMethod => {
                if (checkedPaymentMethod) {
                    newPaymentModes.push(
                        this.paymentModes[checkedPaymentMethod]
                            ? { id: this.paymentModes[checkedPaymentMethod]['@id'] }
                            : { name: checkedPaymentMethod }
                    );
                }
            });
            if (data.partner) {
                data.offset = 'paymentModes';
                data.value = newPaymentModes;
                this.updatePartnerPropertyFromForm({ data })
                    .then(() => this.verifyFields());
            }
        },
        onDeliveryMethodChange(event, data) {
            let newDeliveryMethods = [];
            this.atShopDeliveryModeChecked = false;
            this.checkedDeliveryMethods.forEach(checkedDeliveryMethod => {
                if (!checkedDeliveryMethod) {
                    return;
                }
    
                if ('Retrait en boutique' === checkedDeliveryMethod) {
                    this.atShopDeliveryModeChecked = true;
                }

                let deliveryModeFound = this.currentPartner.deliveryModes.find(
                    item => item.name === checkedDeliveryMethod
                );
    
                if ('Autre(s)' === checkedDeliveryMethod) {
                    newDeliveryMethods.push(
                        deliveryModeFound
                            ? {
                                id: deliveryModeFound['@id'],
                                name: this.otherDeliveryMethod.name || ''
                            }
                            : {
                                name: this.otherDeliveryMethod.name || ''
                            }
                    );
                } else {
                    newDeliveryMethods.push(
                        deliveryModeFound
                            ? { id: deliveryModeFound['@id'] }
                            : { name: checkedDeliveryMethod }
                    );
                }
            });
    
            if (!this.atShopDeliveryModeChecked) {
                this.atShopDeliveryMode = {};
            }

            if (data.partner) {
                data.offset = 'deliveryModes';
                data.value = newDeliveryMethods;
                this.updatePartnerPropertyFromForm({ data })
                    .then(() => this.verifyFields());
            }
        },
        onAtShopDeliveryModeChange(event, data) {
            this.onBlur(event, { deliveryMode: this.findAtShopDeliveryMode() });
        },
        findAtShopDeliveryMode() {
            return this.currentPartner.deliveryModes.find(item => 'Retrait en boutique' === item.name);
        },
        isOtherDeliveryMethodChecked() {
            return -1 !== this.checkedDeliveryMethods.indexOf('Autre(s)');
        },
        getOtherDeliveryMethodIndex() {
            if (this.isOtherDeliveryMethodChecked()) {
                return this.currentPartner.deliveryModes
                    .indexOf(deliveryMode => deliveryMode === this.getOtherTypeOfDeliveryMethod());
            }
            return -1;
        },
        isDeliveryMethodExists(deliveryName) {
            return undefined !== this.shopDeliveryMethods
                .find(deliveryOption => deliveryOption.value === deliveryName);
        },
        getOtherTypeOfDeliveryMethod() {
            return this.currentPartner.deliveryModes
                .find(deliveryMode => !this.isDeliveryMethodExists(deliveryMode));
        },
        async validateFields(refs, entity) {
            if (!this.readyState.allowedToEdit) {
                return;
            }
            
            let isValid = await validateSection.validateRequiredFields(entity, refs);
            let { paymentModes, deliveryModes, bankDescription } = entity.currentPartner;
            const otherDeliveryMode = this.otherDeliveryMethod.name;
    
            const MIN_LENGTH_REQUIRED = 3;
            
            if (isValid) {
                paymentModes = paymentModes.filter(item => item && item.name);
                if (!paymentModes.length) {
                    isValid = false;
                } else {
                    // Need to have minimum one paymentMode selected and bankDescription filled by 3 chars min
                    let paymentModesIsValid = paymentModes.some(paymentMode => paymentMode.name && 'Banque' !== paymentMode.name);
                    let isBankChecked = -1 !== paymentModes.findIndex(paymentMode => 'Banque' === paymentMode.name);
                    if (!paymentModesIsValid) {
                        if (!isBankChecked || !bankDescription || bankDescription.length < MIN_LENGTH_REQUIRED) {
                            isValid = null;
                        }
                    } else {
                        if (isBankChecked && (!bankDescription || bankDescription.length < MIN_LENGTH_REQUIRED)) {
                            isValid = null;
                        }
                    }
                }
    
                deliveryModes = this.checkedDeliveryMethods.filter(item => item);
                if (!deliveryModes.length) {
                    isValid = false;
                } else if (isValid) {
                    // Need to have minimum one deliveryMode selected and otherDeliveryMode filled by 3 chars min
                    let deliveryModeIsValid = deliveryModes.some(deliveryMode => 'Autre(s)' !== deliveryMode);
                    let isOtherDeliveryChecked = -1 !== deliveryModes.findIndex(checkedDeliveryMethod => 'Autre(s)' === checkedDeliveryMethod);
                    if (!deliveryModeIsValid) {
                        if (!isOtherDeliveryChecked || !otherDeliveryMode || otherDeliveryMode.length < MIN_LENGTH_REQUIRED) {
                            isValid = null;
                        }
                    } else {
                        if (isOtherDeliveryChecked && (!otherDeliveryMode || otherDeliveryMode.length < MIN_LENGTH_REQUIRED)) {
                            isValid = null;
                        }
                    }
                }
            }
            validateSection.displayColorStateOnSection('shop-payment-delivery', isValid);
        }
    },
    mounted() {
        if (!Object.keys(this.paymentModes).length) {
            this.getPaymentModes();
        }

        this.checkedPaymentMethods = this.currentPartner.paymentModes
            .filter(item => Object.values(item).length ? item : null)
            .map(checkedPaymentMode => checkedPaymentMode.name);
        this.checkedDeliveryMethods = this.currentPartner && this.currentPartner.deliveryModes.length ? this.currentPartner
            .deliveryModes.map(item => {
                if (item.name && !this.isDeliveryMethodExists(item.name)) {
                    this.otherDeliveryMethod = item;
                    return 'Autre(s)';
                }
                return item.name;
            }) : [];
        this.atShopDeliveryMode = this.findAtShopDeliveryMode();
        if (this.atShopDeliveryMode) {
            this.atShopDeliveryModeChecked = true;
        }
    }
}
</script>
