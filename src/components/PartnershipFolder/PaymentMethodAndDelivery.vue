<template>
    <b-container fluid>
        <b-row v-if="status.isLocalRestoBoutique" class="mb-3">
            <b-col sm="6">
                <label class="label">Proposez-vous de la vente de plats à emporter ?</label>
                <ValidationProvider name="Delivery option" rules="" ref="salesforce.opportunity.Click_Collect__c"
                                    v-slot="{ validate, classes, errors }">
                    <b-form-select
                        @change.native="onBlur($event, { opportunity: salesforce.opportunity, type: 'bool' })"
                        @focus="onFocus"
                        :class="classes"
                        name="salesforce.opportunity.Click_Collect__c"
                        v-model="isClickAndCollectActive"
                        :options="yesNoOptions"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                    ></b-form-select>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
        <b-row v-if="!status.isLocalRestoBoutique || (status.isLocalRestoBoutique && clickAndCollectActive)">
            <b-col sm="12">
                <b-row>
                    <b-col class="mb-3">
                <span class="form-description">
                    Moyens de paiement
                    <i v-if="isClickAndCollectOffer" class="far fa-question-circle custom-tooltip" v-b-tooltip.hover
                       title="Les 2 options peuvent être sélectionnées."></i>
                </span>
                    </b-col>
                </b-row>
                <!-- paymentShippingForm -->
                <b-row>
                    <b-col v-for="(paymentMethod, index) in boutiquePaymentMeth" :key="paymentMethod.value" lg="3" md="5"
                           sm="6">
                        <ValidationProvider name="Moyens de paiement" :rules="{ required: !checkedPaymentMethods.length }"
                                            :ref="`currentPartner.paymentModes.${index}.name`"
                                            v-slot="{ validate, classes, errors }">
                            <b-form-checkbox-group
                                @change.native="onPaymentMethodChange($event, { partner: currentPartner })"
                                :name="`currentPartner.paymentModes.${index}.name`"
                                :options="[ paymentMethod ]"
                                v-model="checkedPaymentMethods"
                                :disabled="!identity.allowedToEdit"
                                :readonly="!identity.allowedToEdit"
                                type="checkbox"
                            ></b-form-checkbox-group>
                            <small :class="classes">{{ errors[0] }}</small>
                        </ValidationProvider>
                    </b-col>
                </b-row>
                <b-row class="mt-3 mb-2" v-if="isClickAndCollectOffer && isOnlinePaymentMethodIsChecked">
                    <b-col>
                        <span>Avez-vous un moyen de paiement en ligne ?</span>
                    </b-col>
                </b-row>
                <b-row v-if="isClickAndCollectOffer && isOnlinePaymentMethodIsChecked">
                    <b-col>
                        <ValidationProvider name="Avez-vous un compte Stripe ?"
                                            :rules="{ required: undefined === currentPartner.partnerBoutique.paymentType }"
                                            ref="currentPartner.partnerBoutique.paymentType"
                                            v-slot="{ validate, classes, errors }">
                            <b-form-radio-group
                                @change.native="onBlur($event, { partnerBoutique: currentPartner.partnerBoutique })"
                                v-model="paymentType"
                                :options="tedsPaymentTypes"
                                :disabled="!identity.allowedToEdit"
                                :readonly="!identity.allowedToEdit"
                                name="currentPartner.partnerBoutique.paymentType"
                                type="radio"
                            ></b-form-radio-group>
                            <small :class="classes">{{ errors[0] }}</small>
                        </ValidationProvider>
                    </b-col>
                </b-row>
                <b-row class="mb-4 extra-informations" v-if="isClickAndCollectOffer && isOnlinePaymentMethodIsChecked">
                    <b-col>
                        <small v-if="'Stripe' === paymentType || 'Viva Wallet' === paymentType">
                            <span>Vous n'avez pas de compte {{ 'Stripe' === paymentType ? 'Stripe' : 'Viva Wallet' }} ? Suivez notre guide complet</span>
                            <a :href="'Stripe' === paymentType ? stripeURL : vivaWalletURL" target="_blank">
                                <span class="external-link"> (ici) </span>
                            </a>
                            pour vous aider à le créer.
                        </small>
                        <small v-if="'Aucun' === paymentType">
                            <span class="warning-text">Attention : </span>
                            Si vous souhaitez activer le paiement en ligne, un compte Stripe ou Vivawallet est nécessaire pour activer le paiement en ligne.
                        </small>
                    </b-col>
                </b-row>
                <b-row class="mb-4" v-if="isClickAndCollectOffer && !isClient && isOnlinePaymentMethodIsChecked">
                    <b-col>
                        Note pour le CPW :
                        <br/>
                        Si le partenaire n'a pas de compte, lui envoyer la procédure par mail, s'il en a un lui envoyer un mail
                        pour lui demander de nous les transmettre (il nous faudra la clé privée et la clé publique)
                    </b-col>
                </b-row>
                <b-row class="mb-3" v-if="isClickAndCollectOffer">
                    <b-col>
                <span class="form-description">
                    Horaires de retrait
                </span>
                    </b-col>
                </b-row>
                <b-row class="mb-4" v-if="isClickAndCollectOffer">
                    <b-col lg="2" md="12">
                        Plages d'ouverture :
                    </b-col>
                    <b-col lg="10" md="12">
                        <TimeRanges
                            parentEntityName="partnerBoutique"
                            v-bind:parentEntity="currentPartner.partnerBoutique"
                            v-bind:timeRanges="currentPartner.partnerBoutique.openingRanges"
                            v-bind:allowedToEdit="identity.allowedToEdit"
                            v-bind:useCheckBox="false"
                            v-bind:openCloseEnabled="true"
                            v-bind:verifyFields="verifyFields"
                            v-bind:updateTimeRanges="updateTimeRanges"
                        />
                    </b-col>
                </b-row>
                <b-row class="mb-4" v-if="isClickAndCollectOffer">
                    <b-col lg="2" md="6">
                        Durée du créneau de retrait
                        <i class="far fa-question-circle custom-tooltip" v-b-tooltip.hover
                           title="Comment s'organisent les créneaux de retrait (exemples: toutes les 30 minutes, toutes les heures...)."></i>
                    </b-col>
                    <b-col lg="2" md="6">
                        <ValidationProvider mode="passive" name="Durée du créneau"
                                            :rules="{ required: true, regex: /^\d{2}:\d{2}$/ }"
                                            ref="currentPartner.partnerBoutique.pickUpTime"
                                            v-slot="{ validate, classes, errors }">
                            <b-form-input
                                @focus="onFocus($event);"
                                @blur="onBlur($event, { partnerBoutique: currentPartner.partnerBoutique, format: 'time2sec' })"
                                type="time"
                                :class="classes"
                                name="currentPartner.partnerBoutique.pickUpTime"
                                v-model="pickUpTime"
                                :disabled="!identity.allowedToEdit"
                                :readonly="!identity.allowedToEdit"
                            ></b-form-input>
                            <small :class="classes">{{ errors[0] }}</small>
                        </ValidationProvider>
                    </b-col>
                </b-row>
                <b-row v-if="isOldLocalBoutique">
                    <b-col class="mb-3">
                        <span class="form-description">Livraison</span>
                    </b-col>
                </b-row>
                <b-row class="mb-4" v-if="isOldLocalBoutique">
                    <b-col v-for="(item, index) in boutiqueDeliveryMeth" :key="item.value" lg="3" md="5" sm="6">
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
                </b-row>
                <div class="d-flex flex-row flex-wrap mb-4" v-if="isOldLocalBoutique && atHomeDeliveryMode">
                    <div class="pr-3">
                        <span>Pour la livraison à domicile, veuillez préciser :</span>
                    </div>
                    <div class="px-3">
                        <b-row md="12" v-for="(item, index) in homeDelivery" :key="item.value">
                            <ValidationProvider name="méthode livraison" :ref="`atHomeDeliveryMode[${index}].shippingMethods`"
                                                v-slot="{ validate, classes, errors }">
                                <b-form-checkbox-group
                                    @change.native="onShippingMethodChange($event, { deliveryMode: atHomeDeliveryMode })"
                                    v-model="checkedShippingMethods"
                                    :name="`atHomeDeliveryMode[${index}].shippingMethods`"
                                    :options="[ item ]"
                                    :disabled="!identity.allowedToEdit"
                                    :readonly="!identity.allowedToEdit"
                                    type="checkbox">
                                </b-form-checkbox-group>
                                <small :class="classes">{{ errors[0] }}</small>
                            </ValidationProvider>
                        </b-row>
                    </div>
                    <div class="pl-3 flex-fill">
                        <ValidationProvider name="zone de livraison" ref="atHomeDeliveryMode.deliveryArea"
                                            v-slot="{ validate, classes, errors }">
                            <label class="label">Zone de livraison (en km, toute la France, étranger)</label>
                            <b-form-input
                                @focus="onFocus"
                                @blur="onBlur($event, { deliveryMode: atHomeDeliveryMode, type: 'int' })"
                                v-model="atHomeDeliveryMode.deliveryArea"
                                name="atHomeDeliveryMode.deliveryArea"
                                :class="classes"
                                :disabled="!identity.allowedToEdit"
                                :readonly="!identity.allowedToEdit"
                                type="number"
                            ></b-form-input>
                            <small :class="classes">{{ errors[0] }}</small>
                        </ValidationProvider>
                        <ValidationProvider name="frais de livraison" rules="oneOf:Au poids,Au panier"
                                            ref="atHomeDeliveryMode.deliveryType"
                                            v-slot="{ validate, classes, errors }">
                            <label class="label">Frais de livraison définis</label>
                            <b-form-select
                                @change.native="onBlur($event, { deliveryMode: atHomeDeliveryMode })"
                                :class="classes"
                                :disabled="!identity.allowedToEdit"
                                :readonly="!identity.allowedToEdit"
                                type="select"
                                v-model="atHomeDeliveryMode.deliveryType"
                                name="atHomeDeliveryMode.deliveryType"
                                :options="transporterOptions"
                            ></b-form-select>
                            <small :class="classes">{{ errors[0] }}</small>
                        </ValidationProvider>
                    </div>
                </div>
                <div class="d-flex flex-row flex-wrap mb-4" v-if="isOldLocalBoutique">
                    <div class="pr-4">
                        <span>La zone de livraison :</span>
                    </div>
                    <div class="flex-fill pl-4">
                        <b-row>
                            <ValidationProvider name="livraison en France" ref="currentPartner.franceDelivery"
                                                v-slot="{ validate, classes, errors }">
                                <b-form-checkbox
                                    @change.native="onBlur($event, { partner: currentPartner, type: 'bool' })"
                                    v-model="currentPartner.franceDelivery"
                                    name="currentPartner.franceDelivery"
                                    :disabled="!identity.allowedToEdit"
                                    :readonly="!identity.allowedToEdit"
                                    type="checkbox">
                                    Livraison en France
                                </b-form-checkbox>
                                <small :class="classes">{{ errors[0] }}</small>
                            </ValidationProvider>
                        </b-row>
                        <b-row>
                            <ValidationProvider name="livraison à l'étranger" ref="currentPartner.abroadDelivery"
                                                v-slot="{ validate, classes, errors }">
                                <b-form-checkbox
                                    @change.native="onBlur($event, { partner: currentPartner, type: 'bool' })"
                                    v-model="currentPartner.abroadDelivery"
                                    name="currentPartner.abroadDelivery"
                                    :disabled="!identity.allowedToEdit"
                                    :readonly="!identity.allowedToEdit"
                                    type="checkbox">
                                    Livraison à l'étranger
                                </b-form-checkbox>
                                <small :class="classes">{{ errors[0] }}</small>
                            </ValidationProvider>
                        </b-row>
                    </div>
                </div>
                <b-row class="mt-3 mb-2" v-if="isClickAndCollectOffer">
                    <b-col>
                        <span class="form-description">Livraison</span>
                    </b-col>
                </b-row>
                <div v-if="isClickAndCollectOffer" class="mb-4">
                    <b-row class="mb-2 mt-1">
                        <b-col md="3" sm="3">
                            <span>Proposez-vous la livraison à domicile ?</span>
                        </b-col>
                        <b-col md="3" sm="3">
                            <b-row>
                                <b-col md="6" sm="12">
                                    <ValidationProvider ref="currentPartner.partnerBoutique.hasHomeDeliveryOption"
                                                        v-slot="{ validate, classes, errors }"
                                                        :rules="{ required: undefined === currentPartner.partnerBoutique.hasHomeDeliveryOption }"
                                                        name="Proposez-vous la livraison à domicile">
                                        <b-form-radio
                                            v-model="currentPartner.partnerBoutique.hasHomeDeliveryOption"
                                            :disabled="!identity.allowedToEdit"
                                            :readonly="!identity.allowedToEdit"
                                            :value="true"
                                            name="currentPartner.partnerBoutique.hasHomeDeliveryOption"
                                            type="radio"
                                            @change.native="onBlur($event, { partnerBoutique: currentPartner.partnerBoutique, type: 'bool' })"
                                        >
                                            Oui
                                        </b-form-radio>
                                        <small :class="classes">{{ errors[0] }}</small>
                                    </ValidationProvider>
                                </b-col>
                                <b-col md="6" sm="12">
                                    <ValidationProvider ref="currentPartner.partnerBoutique.hasHomeDeliveryOption"
                                                        v-slot="{ validate, classes, errors }"
                                                        :rules="{ required: undefined === currentPartner.partnerBoutique.hasHomeDeliveryOption }"
                                                        name="Proposez-vous la livraison à domicile">
                                        <b-form-radio
                                            v-model="currentPartner.partnerBoutique.hasHomeDeliveryOption"
                                            :disabled="!identity.allowedToEdit"
                                            :readonly="!identity.allowedToEdit"
                                            :value="false"
                                            name="currentPartner.partnerBoutique.hasHomeDeliveryOption"
                                            type="radio"
                                            @change.native="onBlur($event, { partnerBoutique: currentPartner.partnerBoutique, type: 'bool' })"
                                        >
                                            Non
                                        </b-form-radio>
                                        <small :class="classes">{{ errors[0] }}</small>
                                    </ValidationProvider>
                                </b-col>
                            </b-row>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col class="mb-2 mt-3" v-if="currentPartner.partnerBoutique.hasHomeDeliveryOption">
                            <ValidationProvider ref="currentPartner.deliveryMode.name"
                                                v-slot="{ validate, classes, errors }"
                                                name="Mode de livraison souhaité">
                                <label class="label">Mode de livraison souhaité :</label>
                                <b-form-radio-group
                                    @change.native="onBlur($event, { deliveryMode: selectedDeliveryMode })"
                                    v-model="selectedDeliveryMode.name"
                                    :options="tedsDeliveryModes"
                                    :disabled="!identity.allowedToEdit"
                                    :readonly="!identity.allowedToEdit"
                                    name="currentPartner.deliveryMode.name"
                                    type="radio"
                                    md="2"
                                >
                                </b-form-radio-group>
                                <small :class="classes">{{ errors[0] }}</small>
                            </ValidationProvider>
                        </b-col>
                    </b-row>
                    <b-row v-if="'Boxtal' === selectedDeliveryMode.name" class="ml-2">
                        <small>
                            <span>
                                Vous n'avez pas de compte Boxtal ? Suivez notre guide complet <a :href="boxtalURL" target="_blank">(ici)</a> pour vous aider à le créer.
                            </span>
                        </small>
                    </b-row>
                    <b-row v-if="currentPartner.partnerBoutique.hasHomeDeliveryOption && selectedDeliveryMode.name">
                        <b-col class="mb-2 mt-3">
                            <ValidationProvider name="Informations complémentaires de livraison"
                                                ref="currentPartner.deliveryMode.deliveryComment"
                                                rules="max:1000"
                                                v-slot="{ validate, classes, errors }">
                                <label class="label">Informations complémentaires de livraison (facultatif)</label>
                                <div class="input-text">
                                    <b-form-textarea
                                        @focus="onFocus"
                                        @blur.native="onBlur($event, { deliveryMode: selectedDeliveryMode })"
                                        v-model="selectedDeliveryMode.deliveryComment"
                                        name="currentPartner.deliveryMode.deliveryComment"
                                        :class="classes"
                                        :disabled="!identity.allowedToEdit"
                                        :readonly="!identity.allowedToEdit"
                                        rows="4"
                                    ></b-form-textarea>
                                    <TextLengthMessage
                                        :value="!selectedDeliveryMode || selectedDeliveryMode.deliveryComment"
                                        maxlength="1000"
                                    />
                                </div>
                                <small :class="classes">{{ errors[0] }}</small>
                            </ValidationProvider>
                        </b-col>
                    </b-row>
                    <b-row v-if="currentPartner.partnerBoutique.hasHomeDeliveryOption &&
                                 selectedDeliveryMode.name &&
                                 isNotUniqOrBoxtalDeliveryMode">
                        <b-col class="mb-2 mt-3">
                            Détail des tarifs :
                        </b-col>
                    </b-row>
                    <b-row v-if="currentPartner.partnerBoutique.hasHomeDeliveryOption && selectedDeliveryMode.name">
                        <b-col class="mb-2 mt-3" v-if="isNotUniqOrBoxtalDeliveryMode">
                            <ValidationProvider name="Montant de vos frais de port unique"
                                                ref="currentPartner.partnerBoutique.uniqueShippingFees"
                                                v-slot="{ validate, classes, errors }">
                                <label class="label">Montant de vos frais de port unique</label>
                                <b-form-input
                                    @focus="onFocus"
                                    @blur.native="onBlur($event, { partnerBoutique: currentPartner.partnerBoutique, type: 'float' })"
                                    v-model="currentPartner.partnerBoutique.uniqueShippingFees"
                                    name="currentPartner.partnerBoutique.uniqueShippingFees"
                                    :class="classes"
                                    :disabled="!identity.allowedToEdit"
                                    :readonly="!identity.allowedToEdit"
                                ></b-form-input>
                                <small :class="classes">{{ errors[0] }}</small>
                            </ValidationProvider>
                        </b-col>
                        <b-col class="mb-2 mt-3 ml-3 fee-details-container" v-if="isNotUniqOrBoxtalDeliveryMode">
                            <b-row v-for="(feeDetail, index) in selectedDeliveryMode.feeDetails" :key="`feeDetail-${index}`" class="fee-details-row">
                                <b-col md="12">
                                    <div class="float-left pt-2">De</div>
                                    <div class="float-left col-xl-1 col-md-2 col-sm-3 col-4">
                                        <ValidationProvider name="Valeur min de frais de livraison"
                                                            :ref="`feeDetail.${index}.minValue`"
                                                            v-slot="{ validate, classes, errors }">
                                            <b-form-input
                                                @focus="onFocus"
                                                @blur.native="onBlur($event, { feeDetail: feeDetail, type: 'float' }, 'minValue')"
                                                v-model="feeDetail.minValue"
                                                :name="`feeDetail.${index}.minValue`"
                                                :class="classes"
                                                :disabled="!identity.allowedToEdit"
                                                :readonly="!identity.allowedToEdit || isFeeDetailUpdating"
                                                type="number"
                                                md="1"
                                            ></b-form-input>
                                            <small :class="classes">{{ errors[0] }}</small>
                                        </ValidationProvider>
                                    </div>
                                    <div class="float-left pt-2">{{ feeDetailUnit }} à</div>
                                    <div class="float-left col-xl-1 col-md-2 col-sm-3 col-4">
                                        <ValidationProvider name="Valeur max de frais de livraison"
                                                            :ref="`feeDetail.${index}.maxValue`"
                                                            v-slot="{ validate, classes, errors }">
                                            <b-form-input
                                                @focus="onFocus"
                                                @blur.native="onBlur($event, { feeDetail: feeDetail, type: 'float' }, 'maxValue')"
                                                v-model="feeDetail.maxValue"
                                                :name="`feeDetail.${index}.maxValue`"
                                                :class="classes"
                                                :disabled="!identity.allowedToEdit"
                                                :readonly="!identity.allowedToEdit || isFeeDetailUpdating"
                                                type="number"
                                                md="1"
                                            ></b-form-input>
                                        </ValidationProvider>
                                    </div>
                                    <div class="float-left pt-2">{{ feeDetailUnit }}, frais de livraison à :</div>
                                    <div class="float-left col-xl-1 col-md-2 col-sm-3 col-4">
                                        <ValidationProvider name="Montant de frais de livraison"
                                                            :ref="`feeDetail.${index}.deliveryFees`"
                                                            v-slot="{ validate, classes, errors }">
                                            <b-form-input
                                                @focus="onFocus"
                                                @blur.native="onBlur($event, { feeDetail: feeDetail, type: 'float' }, 'deliveryFees')"
                                                v-model="feeDetail.deliveryFees"
                                                :name="`feeDetail.${index}.deliveryFees`"
                                                :class="classes"
                                                :disabled="!identity.allowedToEdit || isFeeDetailUpdating"
                                                :readonly="!identity.allowedToEdit"
                                                type="number"
                                                md="1"
                                            ></b-form-input>
                                            <small :class="classes">{{ errors[0] }}</small>
                                        </ValidationProvider>
                                    </div>
                                    <div class="float-left pt-2">€</div>
                                    <div class="float-left col-1" v-if="selectedDeliveryMode.feeDetails.length > 1 || !hasEmptyFeeDetail()">
                                        <i class="fas remove-item-action"
                                           :class="{'fa-fan': isFeeDetailUpdating, 'fa-trash': !isFeeDetailUpdating}"
                                           @click="onFeeDetailRemove(feeDetail, index)"
                                           title="Supprimer cette tranche"></i>
                                    </div>
                                </b-col>
                            </b-row>
                        </b-col>
                    </b-row>
                    <b-row v-if="currentPartner.partnerBoutique.hasHomeDeliveryOption && selectedDeliveryMode.name">
                        <b-col class="mb-2 mt-3" v-if="isNotUniqOrBoxtalDeliveryMode">
                            La livraison ne sera pas disponible pour les colis au-delà de
                            <strong> {{ maxRange }} {{ feeDetailUnit }}</strong>
                            <span v-if="'Tarif au km' === selectedDeliveryMode.name"> par rapport à la boutique</span>.
                        </b-col>
                    </b-row>
                    <b-row v-if="currentPartner.partnerBoutique.hasHomeDeliveryOption && selectedDeliveryMode.name && isNotUniqOrBoxtalDeliveryMode">
                        <b-col class="mb-2 mt-3" v-if="!this.hasEmptyFeeDetail()">
                    <span class="float-left add-item-action ml-3" @click="onDeliveryModeRangeAdd">
                        <i class="fas fa-plus"></i> Ajouter une tranche
                    </span>
                        </b-col>
                    </b-row>
                </div>
                <b-row v-if="currentPartner.partnerBoutique">
                    <b-col class="mb-3">
                        <span class="form-description">Commande</span>
                    </b-col>
                </b-row>
                <b-row class="mb-4" v-if="isOldLocalBoutique && currentPartner.partnerBoutique">
                    <b-col md="6">
                        <ValidationProvider name="temps de préparation" rules="integer"
                                            ref="currentPartner.partnerBoutique.preparationDelay"
                                            v-slot="{ validate, classes, errors }">
                            <label class="label">Temps de préparation entre chaque commande (en minutes)</label>
                            <b-form-textarea
                                @focus="onFocus"
                                @blur="onBlur($event, { partnerBoutique: currentPartner.partnerBoutique, type: 'int' })"
                                v-model="currentPartner.partnerBoutique.preparationDelay"
                                name="currentPartner.partnerBoutique.preparationDelay"
                                :class="classes"
                                :disabled="!identity.allowedToEdit"
                                :readonly="!identity.allowedToEdit"
                                type="number"
                            ></b-form-textarea>
                            <small :class="classes">{{ errors[0] }}</small>
                        </ValidationProvider>
                    </b-col>
                    <b-col md="6">
                        <ValidationProvider name="Délai avant commande" rules="integer"
                                            ref="currentPartner.partnerBoutique.beforeOrderDelay"
                                            v-slot="{ validate, classes, errors }">
                            <label class="label">Délai avant commande (en minutes)</label>
                            <b-form-textarea
                                @focus="onFocus"
                                @blur="onBlur($event, { partnerBoutique: currentPartner.partnerBoutique, type: 'int' })"
                                v-model="currentPartner.partnerBoutique.beforeOrderDelay"
                                name="currentPartner.partnerBoutique.beforeOrderDelay"
                                :class="classes"
                                :disabled="!identity.allowedToEdit"
                                :readonly="!identity.allowedToEdit"
                                type="number"
                            ></b-form-textarea>
                            <small :class="classes">{{ errors[0] }}</small>
                        </ValidationProvider>
                    </b-col>
                </b-row>
                <b-row class="mb-4" v-if="isOldLocalBoutique && currentPartner.partnerBoutique">
                    <b-col md="6" v-if="currentPartner.partnerBoutique">
                        <ValidationProvider name="maximum de commandes" rules="integer"
                                            ref="currentPartner.partnerBoutique.simultaneousOrders"
                                            v-slot="{ validate, classes, errors }">
                            <label class="label">Maximum de commandes honorées en même temps</label>
                            <b-form-textarea
                                @focus="onFocus"
                                @blur="onBlur($event, { partnerBoutique: currentPartner.partnerBoutique, type: 'int' })"
                                v-model="currentPartner.partnerBoutique.simultaneousOrders"
                                name="currentPartner.partnerBoutique.simultaneousOrders"
                                :class="classes"
                                :disabled="!identity.allowedToEdit"
                                :readonly="!identity.allowedToEdit"
                                type="number"
                            ></b-form-textarea>
                            <small :class="classes">{{ errors[0] }}</small>
                        </ValidationProvider>
                    </b-col>
                    <b-col>
                        <ValidationProvider name="précisions de livraison" rules="min:3"
                                            ref="currentPartner.partnerBoutique.deliveryDetails"
                                            v-slot="{ validate, classes, errors }">
                            <label class="label">Précisions sur votre offre de livraison et les tarifs
                                associés</label>
                            <b-form-textarea
                                @focus="onFocus"
                                @blur="onBlur($event, { partnerBoutique: currentPartner.partnerBoutique })"
                                v-model="currentPartner.partnerBoutique.deliveryDetails"
                                name="currentPartner.partnerBoutique.deliveryDetails"
                                :class="classes"
                                :disabled="!identity.allowedToEdit"
                                :readonly="!identity.allowedToEdit"
                                type="textarea"
                            ></b-form-textarea>
                            <small :class="classes">{{ errors[0] }}</small>
                        </ValidationProvider>
                    </b-col>
                </b-row>
                <b-row class="mb-4" v-if="isOldLocalBoutique && currentPartner.partnerBoutique">
                    <b-col>
                        <small>Si les informations de paiement et de livraison ne sont pas précisées,
                            l'option Click&Collect sera ajoutée par défaut.</small>
                    </b-col>
                </b-row>
                <b-row class="mb-4" v-if="isClickAndCollectOffer">
                    <b-col md="6" sm="12">
                        <b-row>
                            <b-col md="12" class="my-0">
                                <label class="label">Proposez-vous une option cadeau gratuite ?</label>
                            </b-col>
                            <b-col md="2" class="mt-0">
                                <ValidationProvider name="Option cadeau"
                                                    :rules="{ required: undefined === currentPartner.partnerBoutique.freeGift }"
                                                    ref="currentPartner.partnerBoutique.freeGift"
                                                    v-slot="{ validate, classes, errors }">
                                    <b-form-radio
                                        @change.native="onBlur($event, { partnerBoutique: currentPartner.partnerBoutique, type: 'bool' })"
                                        type="radio"
                                        name="currentPartner.partnerBoutique.freeGift"
                                        v-model="currentPartner.partnerBoutique.freeGift"
                                        :value="true"
                                        :disabled="!identity.allowedToEdit"
                                        :readonly="!identity.allowedToEdit"
                                    >
                                        Oui
                                    </b-form-radio>
                                    <small :class="classes">{{ errors[0] }}</small>
                                </ValidationProvider>
                            </b-col>
                            <b-col md="2">
                                <ValidationProvider name="Option cadeau"
                                                    :rules="{ required: undefined === currentPartner.partnerBoutique.freeGift }"
                                                    ref="currentPartner.partnerBoutique.freeGift"
                                                    v-slot="{ validate, classes, errors }">
                                    <b-form-radio
                                        @change.native="onBlur($event, { partnerBoutique: currentPartner.partnerBoutique, type: 'bool' })"
                                        type="radio"
                                        name="currentPartner.partnerBoutique.freeGift"
                                        v-model="currentPartner.partnerBoutique.freeGift"
                                        :value="false"
                                        :disabled="!identity.allowedToEdit"
                                        :readonly="!identity.allowedToEdit"
                                    >
                                        Non
                                    </b-form-radio>
                                    <small :class="classes">{{ errors[0] }}</small>
                                </ValidationProvider>
                            </b-col>
                        </b-row>
                    </b-col>
                </b-row>
                <b-row class="mb-4" v-if="currentPartner.partnerBoutique">
                    <b-col md="6" sm="12">
                        <ValidationProvider name="Temps de préparation" rules="integer"
                                            ref="currentPartner.partnerBoutique.preparationDelay"
                                            v-slot="{ validate, classes, errors }">
                            <label class="label">Temps de préparation entre chaque commande (en minutes)</label>
                            <b-form-input
                                @focus="onFocus"
                                @blur="onBlur($event, { partnerBoutique: currentPartner.partnerBoutique, type: 'int' })"
                                v-model="currentPartner.partnerBoutique.preparationDelay"
                                name="currentPartner.partnerBoutique.preparationDelay"
                                :class="classes"
                                :disabled="!identity.allowedToEdit"
                                :readonly="!identity.allowedToEdit"
                                type="number"
                            ></b-form-input>
                            <small :class="classes">{{ errors[0] }}</small>
                        </ValidationProvider>
                    </b-col>
                    <b-col md="6" sm="12">
                        <ValidationProvider name="Nombre maximum de personnes par créneau de retrait"
                                            rules="expected"
                                            ref="currentPartner.partnerBoutique.maximumAllowedPersons"
                                            v-slot="{ validate, classes, errors }">
                            <label class="label">Nombre maximum de personnes par créneau de retrait</label>
                            <b-input
                                @focus="onFocus"
                                @blur="onBlur($event, { partnerBoutique: currentPartner.partnerBoutique, type: 'int' })"
                                type="number"
                                :class="classes"
                                name="currentPartner.partnerBoutique.maximumAllowedPersons"
                                v-model="currentPartner.partnerBoutique.maximumAllowedPersons"
                                :disabled="!identity.allowedToEdit"
                                :readonly="!identity.allowedToEdit"
                            >
                            </b-input>
                            <small :class="classes">{{ errors[0] }}</small>
                        </ValidationProvider>
                    </b-col>
                </b-row>
                <b-row class="mb-4" v-if="isClickAndCollectOffer">
                    <b-col md="6" sm="12">
                        <b-row>
                            <b-col md="5" class="pr-0">
                                <label class="label">Sélectionnez le / les taux de TVA applicables sur vos articles</label>
                            </b-col>
                            <b-col md="7" class="pl-0">
                                <a class="redirect-link"
                                   href="https://www.service-public.fr/professionnels-entreprises/vosdroits/F23567" target="_blank">
                                    <img alt="" src="../../assets/link-button.svg"/>
                                    <span class="text">INFOS TVA</span>
                                </a>
                            </b-col>
                        </b-row>
                        <b-form-group>
                            <b-form-tags v-model="selectedVats" size="md"
                                         add-on-change no-outer-focus class="mb-2 selected__tags">
                                <template v-slot="{ tags, inputAttrs, inputHandlers, disabled, removeTag }">
                                    <ul v-if="tags.length > 0" class="list-inline d-inline selected__tags">
                                        <li v-for="tag in tags" :key="tag" class="d-inline">
                                            <b-form-tag
                                                @remove="removeTag(tag);onRemoveVat(tag, { partnerBoutique: currentPartner.partnerBoutique}, 'vat')"
                                                :title="tag"
                                                :disabled="!identity.allowedToEdit"
                                            >{{ tag }}</b-form-tag>
                                        </li>
                                    </ul>
                                    <b-form-select
                                        class="selected__vats--options"
                                        v-bind="inputAttrs"
                                        v-on="inputHandlers"
                                        :disabled="!identity.allowedToEdit"
                                        :readonly="!identity.allowedToEdit"
                                        :options="vatOptionsList"
                                        @change="onVatListChange($event, { partnerBoutique: currentPartner.partnerBoutique}, 'vat')"
                                    >
                                        <template #first>
                                            <!-- This is required to prevent bugs with Safari -->
                                            <option disabled value="">Sélectionner des TVA</option>
                                        </template>
                                    </b-form-select>
                                </template>
                            </b-form-tags>
                        </b-form-group>
                    </b-col>
                    <b-col md="6" sm="12">
                        <ValidationProvider name="Adresse différente"
                                            ref="currentPartner.partnerBoutique.differentPickUpAddress"
                                            v-slot="{ validate, classes, errors }">
                            <label class="label">Adresse de retrait différente de celle de votre entreprise</label>
                            <b-form-input
                                @focus="onFocus"
                                @blur.native="onBlur($event, { partnerBoutique: currentPartner.partnerBoutique })"
                                v-model="currentPartner.partnerBoutique.differentPickUpAddress"
                                name="currentPartner.partnerBoutique.differentPickUpAddress"
                                :class="classes"
                                :disabled="!identity.allowedToEdit"
                                :readonly="!identity.allowedToEdit"
                                type="text"
                            ></b-form-input>
                            <small :class="classes">{{ errors[0] }}</small>
                        </ValidationProvider>
                    </b-col>
                </b-row>
                <b-row class="mb-4" v-if="isClickAndCollectOffer">
                    <b-col md="6" sm="12">
                        <ValidationProvider name="Date de transmission des éléments"
                                            ref="currentPartner.partnerBoutique.fileTransferDate"
                                            v-slot="{ validate, classes, errors }">
                            <label class="label">À quelle date allez-vous nous transmettre vos produits (Photos + fichier
                                Excel)</label>
                            <b-form-input
                                @focus="onFocus"
                                @blur.native="onBlur($event, { partnerBoutique: currentPartner.partnerBoutique })"
                                v-model="transferDate"
                                name="currentPartner.partnerBoutique.fileTransferDate"
                                :class="classes"
                                :disabled="!identity.allowedToEdit"
                                :readonly="!identity.allowedToEdit"
                                type="date"
                            ></b-form-input>
                            <small :class="classes">{{ errors[0] }}</small>
                        </ValidationProvider>
                    </b-col>
                    <b-col md="6" sm="12">
                        <ValidationProvider name="Quantité de produit"
                                            rules="expected"
                                            ref="currentPartner.partnerBoutique.inStoreProductQuantity"
                                            v-slot="{ validate, classes, errors }">
                            <label class="label">Combien de produits pensez-vous à terme ajouter sur votre boutique ?</label>
                            <b-form-input
                                @focus="onFocus"
                                @blur.native="onBlur($event, { partnerBoutique: currentPartner.partnerBoutique, type: 'int' })"
                                v-model="currentPartner.partnerBoutique.inStoreProductQuantity"
                                name="currentPartner.partnerBoutique.inStoreProductQuantity"
                                :class="classes"
                                :disabled="!identity.allowedToEdit"
                                :readonly="!identity.allowedToEdit"
                                type="number"
                            ></b-form-input>
                            <small :class="classes">{{ errors[0] }}</small>
                        </ValidationProvider>
                    </b-col>
                </b-row>
                <b-row v-if="isClickAndCollectOffer">
                    <b-col class="mb-3">
                        <span class="form-description">Couleurs</span>
                    </b-col>
                </b-row>
                <b-row class="mb-3" v-if="isClickAndCollectOffer">
                    <b-col>
                <span>
                    La boutique ne peut comporter qu’une couleur principale
                    <i class="far fa-question-circle custom-tooltip" v-b-tooltip.hover
                       title="Décochez la checkbox pour choisir une autre couleur dans le sélecteur ci-dessous"></i>
                </span>
                    </b-col>
                </b-row>
                <b-row class="mb-3" v-if="isClickAndCollectOffer">
                    <b-col>
                        <ValidationProvider name="Garder la couleur initiale" ref="currentPartner.partnerBoutique.keepMainColor"
                                            v-slot="{ validate, classes, errors }">
                            <b-form-checkbox
                                @change.native="onBlur($event, { partnerBoutique: currentPartner.partnerBoutique, type: 'bool' })"
                                v-model="currentPartner.partnerBoutique.keepMainColor"
                                name="currentPartner.partnerBoutique.keepMainColor"
                                :disabled="!identity.allowedToEdit"
                                :readonly="!identity.allowedToEdit"
                                type="checkbox">
                                La couleur dominante sera celle du site vitrine ?
                            </b-form-checkbox>
                            <small :class="classes">{{ errors[0] }}</small>
                        </ValidationProvider>
                    </b-col>
                </b-row>
                <b-row align-v="end" class="mb-3" v-if="isClickAndCollectOffer">
                    <b-col md="4">
                        <ValidationProvider name="Couleur dominante" ref="currentPartner.partnerBoutique.newMainColor"
                                            v-slot="{ validate, classes, errors }">
                            <label class="label">Couleur dominante</label>
                            <b-form-input
                                @focus="onFocus"
                                @change.native="onBlur($event, { partnerBoutique: currentPartner.partnerBoutique })"
                                type="color"
                                :disabled="!identity.allowedToEdit"
                                :readonly="!identity.allowedToEdit"
                                name="currentPartner.partnerBoutique.newMainColor"
                                v-model="newMainColor"
                            ></b-form-input>
                            <small :class="classes">{{ errors[0] }}</small>
                        </ValidationProvider>
                    </b-col>
                    <b-col md="4" class="mb-2">
                        <span>{{ currentPartner.partnerBoutique.newMainColor ? currentPartner.partnerBoutique.newMainColor : 'Aucune couleur sélectionnée'}}</span>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>

require('../../assets/style/Pfolder/partnership-folder.css');
import {mapActions, mapState} from "vuex";
import {
    boutiqueDeliveryMeth,
    homeDelivery,
    transporterOptions,
    availableVats,
    weekDays,
    newBoutiquePaymentMeth,
    oldBoutiquePaymentMeth,
    tedsPaymentTypes,
    tedsDeliveryModes,
    yesNoOptions,
} from '../../Interface/partnershipFolderDatas';
import { readyState, dateHelpers, normalizer, validateSection } from "@/_helpers";
import dpMixin from "../../mixins/dp-mixin";
import TimeRanges from "./TimeRanges";
import TextLengthMessage from './TextLengthMessage';

export default {
    name: 'PaymentMethodAndDelivery',
    mixins: [dpMixin],
    components: {
        TimeRanges,
        TextLengthMessage,
    },
    computed: {
        ...mapState('globalStore', ['status', 'paymentModes', 'deliveryModes', 'salesforce']),
        ...mapState('account', ['identity', 'currentPartner']),
        pickUpTime: {
            get() {
                return normalizer.secondsToStrTime(this.currentPartner.partnerBoutique.pickUpTime);
            },
            set(val) {
                this.currentPartner.partnerBoutique.pickUpTime = normalizer.strTimeToSeconds(val);
            }
        },
        transferDate: {
            get() {
                return this.currentPartner.partnerBoutique.fileTransferDate
                    ? dateHelpers.dateToStringForInput(this.currentPartner.partnerBoutique.fileTransferDate)
                    : null;
            },
            set(value) {
                return this.currentPartner.partnerBoutique.fileTransferDate = value;
            }
        },
        isClickAndCollectOffer() {
            return (this.status.isNewLocalBoutique || this.status.isLocalRestoBoutique) && this.currentPartner.partnerBoutique;
        },
        isOldLocalBoutique() {
            return this.status.isOldLocalBoutique;
        },
        boutiquePaymentMeth() {
            if (this.isOldLocalBoutique) {
                return this.oldBoutiquePaymentMeth;
            } else if (this.isClickAndCollectOffer) {
                return this.newBoutiquePaymentMeth;
            }
        },
        newMainColor: {
            get() {
                if (this.isClickAndCollectOffer && this.currentPartner.partnerBoutique.keepMainColor) {
                    this.currentPartner.partnerBoutique.newMainColor = this.currentPartner.sites[0].mainColor;
                    return this.currentPartner.partnerBoutique.newMainColor;
                } else {
                    if (this.currentPartner.partnerBoutique.newMainColor &&
                        this.currentPartner.sites[0].mainColor !== this.currentPartner.partnerBoutique.newMainColor) {
                        return this.currentPartner.partnerBoutique.newMainColor;
                    }

                    return this.currentPartner.partnerBoutique.newMainColor = null;
                }
            },
            set(val) {
                if (!this.currentPartner.partnerBoutique.keepMainColor) {
                    return this.currentPartner.partnerBoutique.newMainColor = null;
                }
                this.currentPartner.partnerBoutique.newMainColor = val;

                return this.currentPartner.partnerBoutique.newMainColor;
            }
        },
        vatOptionsList() {
            return this.availableVats.filter(vat => this.selectedVats && !this.selectedVats.includes(vat.value));
        },
        feeDetailUnit() {
            return this.selectedDeliveryMode && this.isNotUniqOrBoxtalDeliveryMode
                ? this.unitsByDeliveryType[this.selectedDeliveryMode.name] || ''
                : '';
        },
        maxRange() {
            if (!this.selectedDeliveryMode
                || !this.selectedDeliveryMode.feeDetails
                || !this.selectedDeliveryMode.feeDetails.length
            ) {
                return null;
            }

            return this.selectedDeliveryMode.feeDetails.map(a => a.maxValue).sort((a, b) => b - a)[0];
        },
        paymentType: {
            get() {
                return this.currentPartner.partnerBoutique.paymentType;
            },
            set(value) {
                this.currentPartner.partnerBoutique.paymentType = value;
            }
        },
        isClickAndCollectActive: {
            set(value) {
                this.clickAndCollectActive = value;
                this.salesforce.opportunity.Click_Collect__c = value;
            },
            get() {
                return this.clickAndCollectActive;
            }
        },
        isNotUniqOrBoxtalDeliveryMode() {
            return !this.selectedDeliveryMode ||
                ('Tarif unique' !== this.selectedDeliveryMode.name &&
                    'Boxtal' !== this.selectedDeliveryMode.name);
        },
        isOnlinePaymentMethodIsChecked() {
            return this.checkedPaymentMethods.some(checkedPaymentMethod => 'En ligne' === checkedPaymentMethod);
        }
    },
    data() {
        return {
            yesNoOptions,
            clickAndCollectActive: null,
            boutiqueDeliveryMeth,
            newBoutiquePaymentMeth,
            oldBoutiquePaymentMeth,
            tedsPaymentTypes,
            tedsDeliveryModes,
            transporterOptions,
            homeDelivery,
            availableVats,
            weekDays,
            isFeeDetailUpdating: false,
            allowDeliveryAtHome: false,
            checkedDeliveryMethods: [],
            checkedTedsDeliveryMode: null,
            selectedDeliveryMode: {},
            checkedPaymentMethods: [],
            checkedShippingMethods: [],
            atHomeDeliveryMode: null,
            openingRanges: [],
            morningOpeningRanges: [],
            selectedDays: [],
            boutiqueTimeRanges: undefined,
            selectedVats: [],
            unitsByDeliveryType: {
                'Tarif au km': 'km',
                'Poids au colis': 'kg',
                'Valeur du colis': '€',
            },
            stripeURL: process.env.STRIPE_TUTORIAL_URL,
            vivaWalletURL: process.env.VIVA_WALLET_TUTORIAL_URL,
            boxtalURL: process.env.BOXTAL_TUTORIAL_URL,
        }
    },
    methods: {
        ...mapActions('account', ['updatePartnerPropertyFromForm', 'deletePartnerPropertyFromForm']),
        ...mapActions('globalStore', ['getPaymentModes']),
        onFocus(event) {
            this.previousEditedValue = event.target.value;
        },
        onBlur(event, data, offset) {
            let provider = this.$refs[event.target.name];
            if (data.partnerBoutique && !data.partnerBoutique.id) {
                data.partnerBoutique.partner = this.currentPartner['@id'];
            }
            if (data.deliveryMode && !data.deliveryMode.id) {
                data.deliveryMode.partners = [
                    this.currentPartner['@id']
                ];
            }
            if (data.feeDetail) {
                if (offset && ['minValue', 'maxValue', 'deliveryFees'].indexOf(offset) >= 0) {
                    data.feeDetail[offset] = normalizer.floatNormalizer(event.target.value);
                }
                if (!data.feeDetail.id) {
                    this.isFeeDetailUpdating = true;
                    data.feeDetail.deliveryMode = this.selectedDeliveryMode['@id'];
                }
            }

            this.updatePartnerPropertyFromForm({
                event: event,
                provider: provider[0] || provider,
                data: data ? Object.assign({ previousEditedValue: this.previousEditedValue }, data) : undefined
            }).then(response => {
                if (data.deliveryMode && !data.deliveryMode.id) {
                    this.selectedDeliveryMode = response[0];
                }
                this.verifyFields();
            }).finally(() => this.isFeeDetailUpdating = false);
        },
        onVatListChange(value, data, offset) {
            const vatList = data.partnerBoutique.vat || [];
            if (value && !vatList.includes(value)) {
                vatList.push(value);
            }
            data.value = vatList;
            data.offset = offset;
            this.updatePartnerAndVerifyFields(data);
        },
        onRemoveVat(value, data, offset) {
            const vatList = data.partnerBoutique.vat || [];
            const index = vatList.indexOf(value);
            if (!value || -1 === index) {
                return;
            }
            vatList.splice(index, 1);
            data.value = vatList;
            data.offset = offset;
            this.updatePartnerAndVerifyFields(data);
        },
        onShippingMethodChange(event, data) {
            data.offset = 'shippingMethods';
            data.value = this.checkedShippingMethods;
            this.updatePartnerAndVerifyFields(data);
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
                this.updatePartnerAndVerifyFields(data);
            }
        },
        onDeliveryMethodChange(event, data) {
            if (event.target.value && 'à domicile' === event.target.value.toLowerCase()) {
                this.allowDeliveryAtHome = event.target.checked;
                if (this.allowDeliveryAtHome) {
                    let atHomeDeliveryMode = this.findAtHomeDeliveryMode();
                    if (!atHomeDeliveryMode) {
                        atHomeDeliveryMode = {
                            name: 'À domicile',
                            partner: this.currentPartner['@id']
                        };
                        this.currentPartner.deliveryModes.push(atHomeDeliveryMode);
                        this.atHomeDeliveryMode = atHomeDeliveryMode;
                    }
                } else {
                    this.atHomeDeliveryMode = null;
                }
            }

            let newDeliveryMethods = [];
            this.checkedDeliveryMethods.forEach(checkedDeliveryMethod => {
                if (!checkedDeliveryMethod) {
                    return;
                }

                let deliveryModeFound = this.currentPartner.deliveryModes.find(
                    item => item.name && item.name.toLowerCase() === checkedDeliveryMethod.toLowerCase()
                );

                if (deliveryModeFound) {
                    if (deliveryModeFound['@id']) {
                        newDeliveryMethods.push({id: deliveryModeFound['@id']});
                    } else {
                        newDeliveryMethods.push(deliveryModeFound);
                    }
                } else {
                    newDeliveryMethods.push({name: checkedDeliveryMethod,});
                }
            });

            if (data.partner) {
                data.offset = 'deliveryModes';
                data.value = newDeliveryMethods;
                this.updatePartnerAndVerifyFields(data);
            }
        },
        onDeliveryModeRangeAdd() {
            if (!this.hasEmptyFeeDetail()) {
                this.selectedDeliveryMode.feeDetails.push({});
            }
        },
        hasEmptyFeeDetail() {
            if (!this.selectedDeliveryMode.feeDetails || !this.selectedDeliveryMode.feeDetails.length) {
                return false;
            }

            let lastFeeDetail = this.selectedDeliveryMode.feeDetails[this.selectedDeliveryMode.feeDetails.length - 1];

            return !lastFeeDetail || !lastFeeDetail.id;
        },
        onFeeDetailRemove(feeDetail, index) {
            if (!feeDetail.id) {
                this.selectedDeliveryMode.feeDetails.splice(index, 1);
                return;
            }
            this.deletePartnerPropertyFromForm({ data: { feeDetail } });
        },
        findAtHomeDeliveryMode(offset) {
            if (!this.currentPartner.deliveryModes.length) {
                return null;
            }

            let found = this.currentPartner.deliveryModes.find(item => 'À domicile' === item.name);

            return found && offset && found[offset] ? found[offset] : found;
        },
        async validateFields(refs, entity) {
            if (!this.readyState.allowedToEdit) {
                return;
            }

            if (this.status.isLocalRestoBoutique && !this.clickAndCollectActive) {
                return this.validateDisplayColor('reset');
            }

            let isValid = await validateSection.validateRequiredFields(entity, refs);

            if (isValid && this.boutiqueTimeRanges) {
                if (Array.isArray(this.boutiqueTimeRanges)) {
                    isValid = this.boutiqueTimeRanges.length > 0 ? true : null;
                }
            }

            if (isValid && !this.boutiqueTimeRanges) {
                isValid = entity.currentPartner &&
                entity.currentPartner.partnerBoutique &&
                entity.currentPartner.partnerBoutique.openingRanges &&
                entity.currentPartner.partnerBoutique.openingRanges.length > 0 ? true : null;
            }

            if ((!entity.currentPartner ||
                    !entity.currentPartner.partnerBoutique ||
                    !entity.currentPartner.partnerBoutique.openingRanges ||
                    !entity.currentPartner.partnerBoutique.openingRanges.length) &&
                !this.boutiqueTimeRanges
            ) {
                isValid = null;
            }

            this.validateDisplayColor(isValid);
        },
        updateTimeRanges(timeRanges) {
            this.boutiqueTimeRanges = timeRanges;
        },
        validateDisplayColor(isValid) {
            return validateSection.displayColorStateOnSection('payment-method-and-delivery', isValid);
        }
    },
    async mounted() {
        if (!Object.keys(this.paymentModes).length) {
            this.getPaymentModes();
        }
        const currentPartner = await readyState.getCurrentPartnerState();

        this.checkedPaymentMethods = (currentPartner.paymentModes || [])
            .map(item => item.name)
            .filter(item => item);

        if (this.isOldLocalBoutique) {
            this.checkedDeliveryMethods = currentPartner.deliveryModes.map(item => item.name);
            this.atHomeDeliveryMode = this.findAtHomeDeliveryMode();
            if (this.atHomeDeliveryMode) {
                this.allowDeliveryAtHome = true;
                this.checkedShippingMethods = this.atHomeDeliveryMode.shippingMethods;
            }
        }

        if (this.isClickAndCollectOffer) {
            if (currentPartner.deliveryModes && currentPartner.deliveryModes.length) {
                this.selectedDeliveryMode = currentPartner.deliveryModes[0];
            } else {
                this.selectedDeliveryMode = {};
            }
        }

        if (currentPartner &&
            currentPartner.partnerBoutique &&
            !currentPartner.partnerBoutique.newMainColor &&
            !currentPartner.partnerBoutique.keepMainColor
        ) {
            currentPartner.partnerBoutique.newMainColor = null;
        }

        this.selectedVats = currentPartner.partnerBoutique && currentPartner.partnerBoutique.vat ? currentPartner.partnerBoutique.vat : [];
        readyState.getSalesforceState()
            .then(salesforceData => {
                    this.isClickAndCollectActive = salesforceData.opportunity.Click_Collect__c;
                }
            );
    },
}
</script>
