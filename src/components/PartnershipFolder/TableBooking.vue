<template>
    <b-container fluid>
        <b-row>
            <b-col>
                <b-row class="my-3">
                    <b-col>
                        <span class="form-description">Services</span>
                        <span class="text-italic text-gray">
                            (créer autant de services que le partenaire en propose. Ex : Brunch ; Midi 1 ; Midi 2 ; Soir)
                        </span>
                    </b-col>
                </b-row>
                <b-row class="pages-container" id="booking-service-tree">
                    <b-col v-if="bookingServices && bookingServices.length"
                           v-for="(bookingService, serviceIndex) in bookingServices"
                           :key="`service-${serviceTimestamp}-${serviceIndex}`"
                           lg="6" md="12" sm="12" class="page-item mb-3"
                    >
                        <b-col class="mb-2 __description p-0">
                            <span class="text-bold">Service {{ bookingService.name }}</span>
                        </b-col>
                        <i class="fas fa-fan" v-if="isServiceLoading[serviceIndex]"></i>
                        <i class="fas fa-trash" v-else-if="allowedToEdit" @click="onServiceRemove(bookingService, serviceIndex)"></i>
                        <b-col class="mb-2 __description">
                            <b-row>
                                <b-col sm="12" md="3">
                                    <label class="service__label">*Nom du service :</label>
                                </b-col>
                                <b-col sm="12" md="9">
                                    <ValidationProvider name="Nom du service"
                                                        :rules="{ min: 3, required: true, expectedUniqueValues: { values: serviceNames }}"
                                                        :ref="`currentPartner.partnerHotelResto.bookingServices.${serviceIndex}.name`"
                                                        v-slot="{ validate, classes, errors }">
                                        <b-form-input
                                            type="text"
                                            @focus="onFocus"
                                            @blur="onBookingServiceChange($event, { bookingService: bookingService }, serviceIndex)"
                                            :class="classes"
                                            :disabled="!allowedToEdit || isServiceLoading[serviceIndex]"
                                            :readonly="!allowedToEdit"
                                            :name="`currentPartner.partnerHotelResto.bookingServices.${serviceIndex}.name`"
                                            v-model="bookingService.name"
                                        ></b-form-input>
                                        <small :class="classes">{{ errors[0] }}</small>
                                    </ValidationProvider>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col sm="12" md="3">
                                    <label class="service__label">Description :</label>
                                </b-col>
                                <b-col sm="12" md="9" class="__description">
                                    <ValidationProvider name="Description" rules="min:3" :ref="`currentPartner.partnerHotelResto.bookingServices.${serviceIndex}.description`"
                                                        v-slot="{ validate, classes, errors }">
                                        <b-form-textarea
                                            type="textarea"
                                            @focus="onFocus"
                                            @blur="onBookingServiceChange($event, { bookingService: bookingService }, serviceIndex)"
                                            :class="classes"
                                            :disabled="!allowedToEdit || isServiceLoading[serviceIndex]"
                                            :readonly="!allowedToEdit"
                                            :name="`currentPartner.partnerHotelResto.bookingServices.${serviceIndex}.description`"
                                            v-model="bookingService.description"
                                        ></b-form-textarea>
                                        <small :class="classes">{{ errors[0] }}</small>
                                    </ValidationProvider>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col sm="12" md="3">
                                    <label class="service__label">*Durée moyenne d’occupation d’une table :</label>
                                </b-col>
                                <b-col sm="12" md="3" class="__description">
                                    <ValidationProvider name="Durée moyenne d’occupation d'une table" rules="required" :ref="`currentPartner.partnerHotelResto.bookingServices.${serviceIndex}.occupancyDelay`"
                                                        v-slot="{ validate, classes, errors }">
                                        <b-form-input
                                            type="time"
                                            @focus="onFocus"
                                            @blur="onBookingServiceChange($event, { bookingService: bookingService, format: 'time2sec' }, serviceIndex)"
                                            :class="classes"
                                            :disabled="!allowedToEdit || isServiceLoading[serviceIndex]"
                                            :readonly="!allowedToEdit"
                                            :name="`currentPartner.partnerHotelResto.bookingServices.${serviceIndex}.occupancyDelay`"
                                            v-model="occupancyDelays[serviceIndex]"
                                        ></b-form-input>
                                        <small :class="classes">{{ errors[0] }}</small>
                                    </ValidationProvider>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col sm="4" md="3">
                                    <label class="service__label">*Nb de couverts disponibles à la réservation en ligne</label>
                                </b-col>
                                <b-col sm="8" md="3" class="__description">
                                    <ValidationProvider name="Nb de couverts disponibles" rules="required|integer" :ref="`currentPartner.partnerHotelResto.bookingServices.${serviceIndex}.flatwareQuantity`"
                                                        v-slot="{ validate, classes, errors }">
                                        <b-form-input
                                            type="number"
                                            @focus="onFocus"
                                            @blur="onBookingServiceChange($event, { bookingService: bookingService }, serviceIndex)"
                                            :class="classes"
                                            :disabled="!allowedToEdit || isServiceLoading[serviceIndex]"
                                            :readonly="!allowedToEdit"
                                            :name="`currentPartner.partnerHotelResto.bookingServices.${serviceIndex}.flatwareQuantity`"
                                            v-model="bookingService.flatwareQuantity"
                                        ></b-form-input>
                                        <small :class="classes">{{ errors[0] }}</small>
                                    </ValidationProvider>
                                </b-col>
                                <b-col sm="4" md="3">
                                    <label class="service__label">*Nb max. de couverts par réservation en ligne</label>
                                </b-col>
                                <b-col sm="8" md="3" class="__description">
                                    <ValidationProvider name="Nb max. de couverts" rules="required|integer" :ref="`currentPartner.partnerHotelResto.bookingServices.${serviceIndex}.flatwareMaxQuantity`"
                                                        v-slot="{ validate, classes, errors }">
                                        <b-form-input
                                            type="number"
                                            @focus="onFocus"
                                            @blur="onBookingServiceChange($event, { bookingService: bookingService }, serviceIndex)"
                                            :class="classes"
                                            :disabled="!allowedToEdit || isServiceLoading[serviceIndex]"
                                            :readonly="!allowedToEdit"
                                            :name="`currentPartner.partnerHotelResto.bookingServices.${serviceIndex}.flatwareMaxQuantity`"
                                            v-model="bookingService.flatwareMaxQuantity"
                                        ></b-form-input>
                                        <small :class="classes">{{ errors[0] }}</small>
                                    </ValidationProvider>
                                </b-col>
                            </b-row>
                            <b-row class="service__entitle" v-if="bookingService.id">
                                <b-col>
                                    <label>Plages horaires du service :</label>
                                </b-col>
                            </b-row>
                            <b-row
                                v-if="bookingService.timeRanges && bookingService.timeRanges.length"
                                v-for="(bookingTimeRange, rangeIndex) in bookingServices[serviceIndex].timeRanges"
                                :key="`timerange-${serviceTimestamp}-${rangeIndex}`"
                                class="service-time-range-container"
                            >
                                <b-col>
                                    <b-row>
                                        <b-col sm="12" md="4" class="__description">
                                            <label class="label">Service saisonnier ?</label>
                                            <ValidationProvider name="Service saisonnier ?" :ref="`timeRanges.${rangeIndex}.seasonal`"
                                                                v-slot="{ validate, classes, errors }">
                                                <b-form-select
                                                    @change.native="onBookingTimeRangeChange($event, serviceIndex, rangeIndex, { bookingTimeRange: bookingTimeRange, type: 'bool' })"
                                                    v-model="bookingTimeRange.seasonal"
                                                    :name="`timeRanges.${rangeIndex}.seasonal`"
                                                    :class="classes"
                                                    :disabled="!allowedToEdit || isServiceLoading[serviceIndex]"
                                                    :readonly="!allowedToEdit"
                                                    :options="yesNoOptions"
                                                    value-field="value"
                                                    text-field="text"
                                                    type="select"
                                                ></b-form-select>
                                                <small :class="classes">{{ errors[0] }}</small>
                                            </ValidationProvider>
                                        </b-col>
                                        <b-col sm="12" md="4" class="__description" v-if="bookingTimeRange.seasonal">
                                            <label class="label">Date de début</label>
                                            <ValidationProvider name="Date de début" rules="min:3|checkPeriodDates:@startDate,@endDate" :ref="`currentPartner.partnerHotelResto.bookingServices.${serviceIndex}.bookingTimeRanges.${rangeIndex}.startDate`"
                                                                v-slot="{ validate, classes, errors }">
                                                <b-form-datepicker
                                                    type="date"
                                                    @input="onStartDateChange(bookingTimeRange, serviceIndex, rangeIndex)"
                                                    v-model="bookingTimeRange.startDate"
                                                    :min="minDate"
                                                    :max="maxDate"
                                                    :class="classes"
                                                    :name="`currentPartner.partnerHotelResto.bookingServices.${serviceIndex}.bookingTimeRanges.${rangeIndex}.startDate`"
                                                    :disabled="!allowedToEdit || isServiceLoading[serviceIndex]"
                                                    :readonly="!allowedToEdit"
                                                    size="sm"
                                                    start-weekday="1"
                                                    calendar-width="250px"
                                                ></b-form-datepicker>
                                                <small :class="classes">{{ errors[0] }}</small>
                                            </ValidationProvider>
                                        </b-col>
                                        <b-col sm="12" md="4" class="__description" v-if="bookingTimeRange.seasonal">
                                            <label class="label">Date de fin</label>
                                            <ValidationProvider name="Date de fin" rules="min:3|checkPeriodDates:@startDate,@endDate" :ref="`currentPartner.partnerHotelResto.bookingServices.${serviceIndex}.bookingTimeRanges.${rangeIndex}.endDate`"
                                                                v-slot="{ validate, classes, errors }">
                                                <b-form-datepicker
                                                    type="date"
                                                    @input="onEndDateChange(bookingTimeRange, serviceIndex, rangeIndex)"
                                                    v-model="bookingTimeRange.endDate"
                                                    :min="minDate"
                                                    :max="maxDate"
                                                    :class="classes"
                                                    :name="`currentPartner.partnerHotelResto.bookingServices.${serviceIndex}.bookingTimeRanges.${rangeIndex}.endDate`"
                                                    :disabled="!allowedToEdit || isServiceLoading[serviceIndex]"
                                                    :readonly="!allowedToEdit"
                                                    size="sm"
                                                    start-weekday="1"
                                                    calendar-width="250px"
                                                ></b-form-datepicker>
                                                <small :class="classes">{{ errors[0] }}</small>
                                            </ValidationProvider>
                                        </b-col>
                                    </b-row>
                                    <b-row>
                                        <b-col md="4" class="mt-1">
                                            <label class="service__label">Réservation après minuit ?</label>
                                        </b-col>
                                        <b-col md="3" class="__description">
                                            <ValidationProvider name="Réservation après minuit ?" :ref="`currentPartner.partnerHotelResto.bookingServices.${serviceIndex}.bookingTimeRanges.${rangeIndex}.allowAfterMidnight`"
                                                                v-slot="{ validate, classes, errors }">
                                                <b-form-select
                                                    @change.native="onBookingTimeRangeChange($event, serviceIndex, rangeIndex, { bookingTimeRange: bookingTimeRange, type: 'bool' })"
                                                    :options="yesNoOptions"
                                                    :class="classes"
                                                    :name="`currentPartner.partnerHotelResto.bookingServices.${serviceIndex}.bookingTimeRanges.${rangeIndex}.allowAfterMidnight`"
                                                    :disabled="!allowedToEdit || isServiceLoading[serviceIndex]"
                                                    :readonly="!allowedToEdit"
                                                    v-model="bookingTimeRange.allowAfterMidnight"
                                                ></b-form-select>
                                                <small :class="classes">{{ errors[0] }}</small>
                                            </ValidationProvider>
                                        </b-col>
                                    </b-row>
                                    <b-row>
                                        <b-col class="days-of-week __description" v-if="undefined !== selectedDaysOfWeek[serviceIndex]">
                                            <b-form-group>
                                                <b-form-tags size="md"
                                                             v-model="selectedDaysOfWeek[serviceIndex][rangeIndex]"
                                                             add-on-change no-outer-focus class="mb-2 selected__tags">
                                                    <template v-slot="{ tags, inputAttrs, inputHandlers, disabled, removeTag }">
                                                        <ul v-if="tags.length > 0" class="list-inline d-inline selected__days">
                                                            <li v-for="tag in tags" :key="tag" class="d-inline">
                                                                <b-form-tag
                                                                    @remove="removeTag(tag);onDayOfWeekRemove(tag, serviceIndex, rangeIndex)"
                                                                    :title="tag"
                                                                    :disabled="disabled || !allowedToEdit || isServiceLoading[serviceIndex]"
                                                                >{{ tag }}</b-form-tag>
                                                            </li>
                                                        </ul>
                                                        <b-form-select
                                                            class="selected__days--options"
                                                            v-bind="inputAttrs"
                                                            v-on="inputHandlers"
                                                            :disabled="disabled || !allowedToEdit || isServiceLoading[serviceIndex]"
                                                            :readonly="disabled || !allowedToEdit || isServiceLoading[serviceIndex]"
                                                            :options="getAvailableDaysOfWeek(serviceIndex, rangeIndex)"
                                                            @change="onDayOfWeekChange($event, serviceIndex, rangeIndex)"
                                                        >
                                                            <template #first>
                                                                <!-- This is required to prevent bugs with Safari -->
                                                                <option disabled value="">Sélectionner des jours</option>
                                                            </template>
                                                        </b-form-select>
                                                    </template>
                                                </b-form-tags>
                                            </b-form-group>
                                        </b-col>
                                        <b-col sm="6" md="2" class="time-container __description" v-if="undefined !== startTimes[serviceIndex]">
                                            <ValidationProvider mode="passive" name="Heure d'ouverture"
                                                                :rules="{ required: hasSelectedDays(serviceIndex, rangeIndex), regex: /^\d{2}:\d{2}$/ }"
                                                                :ref="`currentPartner.partnerHotelResto.bookingServices.${serviceIndex}.timeRanges.${rangeIndex}.startTime`"
                                                                v-slot="{ validate, classes, errors }">
                                                <b-form-input
                                                    @focus="onFocus($event)"
                                                    type="time"
                                                    :class="classes"
                                                    :name="`currentPartner.partnerHotelResto.bookingServices.${serviceIndex}.timeRanges.${rangeIndex}.startTime`"
                                                    @blur.native="onBookingTimeRangeChange($event, serviceIndex, rangeIndex, { bookingTimeRange: bookingTimeRange, format: 'time2sec' })"
                                                    v-model="startTimes[serviceIndex][rangeIndex]"
                                                    :disabled="!allowedToEdit || isServiceLoading[serviceIndex] || !hasSelectedDays(serviceIndex, rangeIndex)"
                                                    :readonly="!allowedToEdit"
                                                ></b-form-input>
                                                <small :class="classes">{{ errors[0] }}</small>
                                            </ValidationProvider>
                                        </b-col>
                                        <b-col sm="6" md="2" class="time-container __description" v-if="undefined !== endTimes[serviceIndex]">
                                            <ValidationProvider mode="passive" name="Heure de fermeture"
                                                                :rules="{ required: hasSelectedDays(serviceIndex, rangeIndex), regex: /^\d{2}:\d{2}$/ }"
                                                                :ref="`currentPartner.partnerHotelResto.bookingServices.${serviceIndex}.timeRanges.${rangeIndex}.endTime`"
                                                                v-slot="{ validate, classes, errors }">
                                                <b-form-input
                                                    @focus="onFocus($event)"
                                                    type="time"
                                                    :class="classes"
                                                    :name="`currentPartner.partnerHotelResto.bookingServices.${serviceIndex}.timeRanges.${rangeIndex}.endTime`"
                                                    @blur.native="onBookingTimeRangeChange($event, serviceIndex, rangeIndex, { bookingTimeRange: bookingTimeRange, format: 'time2sec' })"
                                                    v-model="endTimes[serviceIndex][rangeIndex]"
                                                    :disabled="!allowedToEdit || isServiceLoading[serviceIndex] || !hasSelectedDays(serviceIndex, rangeIndex)"
                                                    :readonly="!allowedToEdit"
                                                ></b-form-input>
                                                <small :class="classes">{{ errors[0] }}</small>
                                            </ValidationProvider>
                                        </b-col>
                                    </b-row>
                                </b-col>
                                <i class="fas fa-trash" v-if="allowedToEdit" @click="onServiceTimeRangeRemove(bookingTimeRange, serviceIndex, rangeIndex)"></i>
                            </b-row>
                            <b-row class="mb-3">
                                <div id="add-time-range"
                                     class="float-left add-item-action ml-3"
                                     :class="{ 'disabled': !allowedToEdit || isServiceLoading[serviceIndex] || !bookingService || !bookingService.id }"
                                     @click="onServiceTimeRangeAdd(serviceIndex)">
                                    <i class="fas fa-plus"></i> Ajouter des horaires
                                </div>
                            </b-row>
                        </b-col>
                    </b-col>
                    <b-col lg="6" md="12" sm="12" class="page-item sample-page mb-3" v-if="identity.allowedToEdit">
                        <b-col class="mb-2 __title px-0 py-2" @click="onBookingServiceAdd()">&nbsp;</b-col>
                        <b-col class="mb-2 __description p-0" @click="onBookingServiceAdd()">
                            <i class="fas fa-plus"></i>
                        </b-col>
                    </b-col>
                </b-row>
                <b-row class="my-3">
                    <b-col>
                        <span class="form-description">Indisponibilités</span>
                        <span class="text-italic text-gray">
                            (les réservations de table ne seront plus possible sur cette période)
                        </span>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col v-if="serviceTimestamp">
                        <ExceptionnalDates
                            parentEntityName="partnerHotelResto"
                            parentEntityPath="currentPartner.partnerHotelResto"
                            :enableIsOpeningRange="false"
                            :isOpeningRange="false"
                            :enableReason="true"
                            :allowedToEdit="allowedToEdit"
                            size="sm"
                            :displayEntitle="false"
                        />
                    </b-col>
                </b-row>
                <b-row class="my-3">
                    <b-col>
                        <span class="form-description">Liens vers des plateformes de livraison externe</span>
                        <span class="text-italic text-gray">
                            (cocher si vous souhaitez ajouter le lien vers ces différentes plateformes de livraison sur votre site)
                        </span>
                    </b-col>
                </b-row>
                <b-row class="mb-3" v-for="(deliveryMode, index) in currentDeliveryModes" :key="`booking-delivery-${deliveryTimestamp}-${index}`">
                    <b-col md="3" lg="3" class="display-context">
                        <b-form-checkbox
                            @change.native="onDeliveryModeCheck(index)"
                            v-model="checkedDeliveryModes[index]"
                            :name="`currentPartner.partnerHotelResto.deliveryModes.${index}.name`"
                            :disabled="!identity.allowedToEdit || isDeliveryModeLoading[index]"
                            :readonly="!identity.allowedToEdit"
                            type="checkbox"
                        >
                            {{ deliveryMode.name ? deliveryMode.name : restoDeliveryMethods[index].value }}
                        </b-form-checkbox>
                    </b-col>
                    <b-col md="9" lg="4" class="display-context__input" v-if="undefined !== deliveryMode">
                        <ValidationProvider name="URL"
                                            :rules="{required: !!deliveryMode.name, min: deliveryMode.name ? 3 : 0}"
                                            :ref="`currentPartner.partnerHotelResto.deliveryModes.${index}.url`"
                                            v-slot="{ validate, classes, errors }">
                            <b-form-input
                                @focus="onFocus"
                                @blur.native="onDeliveryModeChange($event, index, { deliveryMode: deliveryMode })"
                                type="text"
                                :class="classes"
                                :name="`currentPartner.partnerHotelResto.deliveryModes.${index}.url`"
                                v-model="deliveryMode.url"
                                :placeholder="restoDeliveryMethods[index] ? restoDeliveryMethods[index].text : `Lien vers votre profil ${deliveryMode.name}`"
                                :disabled="!identity.allowedToEdit || !checkedDeliveryModes[index] || isDeliveryModeLoading[index]"
                                :readonly="!identity.allowedToEdit"
                            ></b-form-input>
                            <small :class="classes">{{ errors[0] }}</small>
                        </ValidationProvider>
                    </b-col>
                    <b-col>
                        <i class="fas fa-fan" v-if="isDeliveryModeLoading[index]"></i>
                    </b-col>
                </b-row>
                <b-row class="mb-3">
                    <b-col md="3" lg="3" class="display-context">
                        <b-form-checkbox
                            v-model="checkedOtherDeliveryMode"
                            :disabled="!identity.allowedToEdit || isOtherDeliveryModeLoading"
                            :readonly="!identity.allowedToEdit"
                            type="checkbox"
                        >
                            Ajouter une autre plateforme
                        </b-form-checkbox>
                    </b-col>
                    <b-col md="9" lg="4" class="display-context__input">
                        <ValidationProvider name="Nom plateforme de livraison externe"
                                            :rules="{required: !!checkedOtherDeliveryMode, min: checkedOtherDeliveryMode ? 3 : 0}"
                                            ref="partnerHotelResto.otherDeliveryMode.name"
                                            v-slot="{ validate, classes, errors }">
                            <b-form-input
                                @focus="onFocus"
                                @blur="onOtherDeliveryModeChange($event)"
                                v-model="otherDeliveryModeName"
                                type="text"
                                :class="classes"
                                name="partnerHotelResto.otherDeliveryMode.name"
                                placeholder="Nom de la plateforme externe"
                                :disabled="!identity.allowedToEdit || !checkedOtherDeliveryMode || isOtherDeliveryModeLoading"
                                :readonly="!identity.allowedToEdit"
                            ></b-form-input>
                            <small :class="classes">{{ errors[0] }}</small>
                        </ValidationProvider>
                    </b-col>
                    <b-col>
                        <i class="fas fa-fan" v-if="isOtherDeliveryModeLoading"></i>
                    </b-col>
                </b-row>
                <b-row class="my-3">
                    <b-col>
                        <span class="form-description">Couleurs</span>
                        <span class="text-italic text-gray">
                            (cocher si vous souhaitez ajouter le lien vers ces différentes plateformes de livraison sur votre site)
                        </span>
                    </b-col>
                </b-row>
                <b-row class="mb-3">
                    <b-col class="display-context">
                        <b-form-checkbox
                            @change.native="onBlur($event, { partnerHotelResto: currentPartner.partnerHotelResto, type: 'bool' })"
                            v-model="currentPartner.partnerHotelResto.useMainColor"
                            name="currentPartner.partnerHotelResto.useMainColor"
                            :disabled="!identity.allowedToEdit"
                            :readonly="!identity.allowedToEdit"
                            type="checkbox"
                        >
                            La couleur dominante du module de réservation sera celle du site vitrine ?
                        </b-form-checkbox>
                    </b-col>
                </b-row>
                <b-row align-v="end">
                    <b-col md="6" class="display-context__input">
                      <ValidationProvider name="Couleur dominante" :rules="{expected: !currentPartner.partnerHotelResto.useMainColor, max: 255}" ref="currentPartner.partnerHotelResto.mainColor"

                                          v-slot="{ validate, classes, errors }">
                            <label class="label">Couleur dominante</label>
                            <div class="input-text">
                                <b-form-input
                                    @focus="onFocus"
                                    @change.native="onBlur($event, { partnerHotelResto: currentPartner.partnerHotelResto })"
                                    type="color"
                                    :disabled="!identity.allowedToEdit"
                                    :readonly="!identity.allowedToEdit"
                                    name="currentPartner.partnerHotelResto.mainColor"
                                    v-model="mainColor"
                                ></b-form-input>
                            </div>
                            <small :class="classes">{{ errors[0] }}</small>
                        </ValidationProvider>
                    </b-col>
                    <b-col md="4" class="mb-2">
                        <span>{{ mainColor ? mainColor : 'Aucune couleur sélectionnée'}}</span>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import TimeRanges from "./TimeRanges";
require('../../assets/style/Pfolder/partnership-folder.css');
require('../../assets/style/Pfolder/page-details.css');

import { extend } from "vee-validate";
import { store } from '@/_store';
import { mapActions, mapState } from "vuex";
import { normalizer, validateSection, readyState } from "@/_helpers";
import TextLengthMessage from './TextLengthMessage';
import ExceptionnalDates from "./ExceptionnalDates";
import dpMixin from "../../mixins/dp-mixin";
import { yesNoOptions, weekDays, restoDeliveryMethods } from '../../Interface/partnershipFolderDatas';
extend('checkPeriodDates', validateSection.checkPeriodDates);

export default {
    name: 'TableBooking',
    components: {
        TimeRanges,
        TextLengthMessage,
        ExceptionnalDates,
    },
    mixins: [dpMixin],
    data() {
        return {
            yesNoOptions,
            weekDays,
            restoDeliveryMethods,
            isDeliveryModeLoading: [],
            isOtherDeliveryModeLoading: false,
            occupancyDelays: [],
            selectedDaysOfWeek: [],
            startTimes: [],
            endTimes: [],
            serviceTimestamp: 0,
            deliveryTimestamp: 0,
            isServiceLoading: [],
            checkedDeliveryModes: [],
            checkedOtherDeliveryMode: false,
            otherDeliveryModeName: null,
            currentDeliveryModes: [],
        }
    },
    computed: {
        ...mapState('account', ['identity', 'currentPartner']),
        minDate() {
          return new Date();
        },
        maxDate() {
          const date = new Date();
          date.setFullYear(date.getFullYear() + 1);
          return date;
        },
        allowedToEdit() {
            return this.identity.allowedToEdit;
        },
        bookingServices() {
            return this.currentPartner.partnerHotelResto.bookingServices || [];
        },
        serviceNames() {
            return this.bookingServices.map(item => item.name);
        },
        mainColor: {
            get() {
                if (this.currentPartner && this.currentPartner.partnerHotelResto &&
                    this.currentPartner.partnerHotelResto.useMainColor
                ) {
                    return this.currentPartner.sites && this.currentPartner.sites.length ? this.currentPartner.sites[0].mainColor : null;
                }

                return this.currentPartner && this.currentPartner.partnerHotelResto ? this.currentPartner.partnerHotelResto.mainColor : null;
            },
            set(value) {
                this.currentPartner.partnerHotelResto.mainColor = value;
            }
        }
    },
    async mounted() {
        await readyState.getCurrentPartnerState();
        if (!this.currentPartner.partnerHotelResto.bookingServices.length) {
            this.currentPartner.partnerHotelResto.bookingServices = [
                {
                    name: 'Midi',
                },
                {
                    name: 'Soir',
                }
            ]
        }

        this.refreshCurrentBookingServices();
        this.initializeDeliveryModes();
    },
    methods: {
        ...mapActions('account', ['updatePartnerPropertyFromForm', 'deletePartnerPropertyFromForm']),
        onFocus(event) {
            this.previousEditedValue = event.target.value;
        },
        onBlur(event, data) {
            let provider = this.$refs[event.target.name];
            this.updatePartnerPropertyFromForm({
                event: event,
                provider: provider ? provider[0] || provider : null,
                data: data ? Object.assign({ previousEditedValue: this.previousEditedValue }, data) : undefined
            });
            this.verifyFields();
        },
        onBookingServiceChange(event, data, serviceIndex) {
            let provider = this.$refs[event.target.name];
            if (data.bookingService && !data.bookingService.id) {
                data.bookingService.partnerHotelResto = this.currentPartner.partnerHotelResto['@id'];
            }
            if (event) {
                if (event.target.value === this.previousEditedValue) {
                    return;
                } else {
                    this.isServiceLoading[serviceIndex] = true;
                    this.refreshServiceTimestamp();
                }
            }

            let isNewBookingService = false;
            if (data.bookingService && !data.bookingService.id) {
                isNewBookingService = true;
            }
            this.updatePartnerPropertyFromForm({
                event: event,
                provider: (provider || [])[0] || provider,
                data: data ? Object.assign({ previousEditedValue: this.previousEditedValue }, data) : undefined
            }).finally(() => {
                this.isServiceLoading[serviceIndex] = false;
                if (isNewBookingService) {
                    this.refreshServiceTimestamp();
                }
                this.verifyFields();
            });
        },
        onBookingTimeRangeChange(event, serviceIndex, rangeIndex, data) {
            let provider = event ? this.$refs[event.target.name] : null;
            if (data.bookingTimeRange && !data.bookingTimeRange.id) {
                data.bookingTimeRange.bookingService = this.bookingServices[serviceIndex]['@id'];
            }
            data.serviceIndex = serviceIndex;
            this.updatePartnerPropertyFromForm({
                event: event,
                provider: (provider || [])[0] || provider,
                data: data
            }).then(() => {
                this.refreshServiceTimestamp();
                this.verifyFields();
            })
        },
        onBookingServiceAdd() {
            if (this.bookingServices.some(bookingService => !bookingService.id)) {
                store.dispatch(
                    'alert/warn',
                    {
                        group: 'general-error',
                        message: 'Vous devez remplir le service vide.',
                        show: true,
                        title: 'Action invalide',
                        type: 'warn'
                    },
                    { root: true }
                );
                return;
            }

            this.bookingServices.push({});
            this.refreshServiceTimestamp();
            this.verifyFields();
        },
        onServiceRemove(bookingService, serviceIndex) {
            if (this.bookingServices.some(bookingService => !bookingService.id)) {
                this.bookingServices.splice(serviceIndex, 1);
                this.selectedDaysOfWeek.splice(serviceIndex, 1);
                this.startTimes.splice(serviceIndex, 1);
                this.endTimes.splice(serviceIndex, 1);
                this.refreshServiceTimestamp();
            } else {
                Promise.all(this.bookingServices[serviceIndex].timeRanges.map(
                    bookingTimeRange => this.deletePartnerPropertyFromForm({
                        data: { bookingTimeRange, serviceIndex },
                        showNotification: false,
                    })
                )).then(() => {
                    this.deletePartnerPropertyFromForm({
                        data: { bookingService }
                    }).then(() => {
                        this.refreshCurrentBookingServices();
                        this.verifyFields();
                    });
                })
            }
        },
        onServiceTimeRangeRemove(bookingTimeRange, serviceIndex, rangeIndex) {
            if (!bookingTimeRange.id) {
                this.bookingServices[serviceIndex].timeRanges.splice(rangeIndex, 1);
                this.selectedDaysOfWeek[serviceIndex].splice(rangeIndex, 1);
                this.startTimes[serviceIndex].splice(rangeIndex, 1);
                this.endTimes[serviceIndex].splice(rangeIndex, 1);
                this.refreshServiceTimestamp();
            } else {
                this.deletePartnerPropertyFromForm({
                    data: {
                        bookingTimeRange,
                        serviceIndex
                    }
                }).then(() => {
                    this.refreshCurrentBookingServices();
                    this.verifyFields();
                });
            }
        },
        onServiceTimeRangeAdd(serviceIndex) {
            if (!this.allowedToEdit ||
                this.isServiceLoading[serviceIndex] ||
                !this.bookingServices.length ||
                !this.bookingServices[serviceIndex] ||
                !this.bookingServices[serviceIndex].id
            ) {
                return;
            }

            const timeRanges = ((this.bookingServices || [])[serviceIndex] || {}).timeRanges || [];
            if (timeRanges.some(item => !item.id)) {
                store.dispatch(
                    'alert/warn',
                    {
                        group: 'general-error',
                        message: 'Vous devez remplir la plage horaire vide.',
                        show: true,
                        title: 'Action invalide',
                        type: 'warn'
                    },
                    { root: true }
                );
                return;
            }

            const rangeIndex = timeRanges.length;
            this.initializeTimeRange(serviceIndex, rangeIndex);

            if (!this.selectedDaysOfWeek[serviceIndex]) {
                this.selectedDaysOfWeek[serviceIndex] = [];
                this.startTimes[serviceIndex] = [];
                this.endTimes[serviceIndex] = [];
            }
            if (!this.selectedDaysOfWeek[serviceIndex][rangeIndex]) {
                this.selectedDaysOfWeek[serviceIndex][rangeIndex] = [];
            }

            this.refreshServiceTimestamp();
        },
        onDayOfWeekChange(day, serviceIndex, rangeIndex) {
            this.initializeTimeRange(serviceIndex, rangeIndex);
            const bookingTimeRange = this.bookingServices[serviceIndex].timeRanges[rangeIndex];
            if (!bookingTimeRange.weekDays) {
                bookingTimeRange.weekDays = [];
            }
            bookingTimeRange.weekDays.push(
                this.weekDays.find(item => item.text === day).value
            );
            this.onBookingTimeRangeChange(null, serviceIndex, rangeIndex, {
                bookingTimeRange,
                payload: {
                    weekDays: bookingTimeRange.weekDays
                }
            });
        },
        onDayOfWeekRemove(day, serviceIndex, rangeIndex) {
            if (!this.hasSelectedDays(serviceIndex, rangeIndex)) {
                return;
            }
            const bookingTimeRange = this.bookingServices[serviceIndex].timeRanges[rangeIndex];
            let weekDays = bookingTimeRange.weekDays;
            weekDays.splice(weekDays.indexOf(this.weekDays.find(item => item.text === day).value), 1);
            bookingTimeRange.weekDays = weekDays;
            this.onBookingTimeRangeChange(null, serviceIndex, rangeIndex, {
                bookingTimeRange,
                payload: {
                    weekDays: bookingTimeRange.weekDays
                }
            });
        },
        onStartDateChange(bookingTimeRange, serviceIndex, rangeIndex) {
            if (!bookingTimeRange.endDate) {
                bookingTimeRange.endDate = bookingTimeRange.startDate;
            }
            this.onDateChange(bookingTimeRange, serviceIndex, rangeIndex);
        },
        onEndDateChange(bookingTimeRange, serviceIndex, rangeIndex) {
            if (!bookingTimeRange.startDate) {
                bookingTimeRange.startDate = bookingTimeRange.endDate;
            }
            this.onDateChange(bookingTimeRange, serviceIndex, rangeIndex);
        },
        onDateChange(bookingTimeRange, serviceIndex, rangeIndex) {
            if (!this.isDateRangeValid(bookingTimeRange)) {
                return;
            }
            this.onBookingTimeRangeChange(null, serviceIndex, rangeIndex, {
                bookingTimeRange,
                payload: {
                    startDate: (new Date(bookingTimeRange.startDate)).toISOString(),
                    endDate: (new Date(bookingTimeRange.endDate)).toISOString(),
                }
            });
        },
        isDateRangeValid(timeRange) {
            if (!timeRange.startDate || !timeRange.endDate) {
                return false;
            }

            let startDate = new Date(timeRange.startDate).getTime();
            let endDate = new Date(timeRange.endDate).getTime();

            return startDate <= endDate;
        },
        getAvailableDaysOfWeek(serviceIndex, rangeIndex) {
            const weekDays = this.hasSelectedDays(serviceIndex, rangeIndex)
                ? this.bookingServices[serviceIndex].timeRanges[rangeIndex].weekDays
                : [];

            return this.weekDays
                .filter(item => -1 === weekDays.indexOf(item.value))
                .map(item => item.text);
        },
        refreshServiceTimestamp() {
            this.serviceTimestamp = (new Date()).getTime();
        },
        refreshDeliveryTimestamp() {
            this.deliveryTimestamp = (new Date()).getTime();
        },
        hasSelectedDays(serviceIndex, rangeIndex) {
            return this.selectedDaysOfWeek &&
                this.selectedDaysOfWeek[serviceIndex] &&
                this.selectedDaysOfWeek[serviceIndex][rangeIndex] &&
                this.selectedDaysOfWeek[serviceIndex][rangeIndex].length > 0;
        },
        refreshCurrentBookingServices() {
            let occupancyDelays = [];
            let startTimes = [];
            let endTimes = [];
            let selectedDaysOfWeek = [];

            (this.bookingServices || []).forEach((bookingService, serviceIndex) => {
                if (undefined !== bookingService.occupancyDelay) {
                    occupancyDelays[serviceIndex] = normalizer.secondsToStrTime(bookingService.occupancyDelay);
                }
                if (!startTimes[serviceIndex]) {
                    startTimes[serviceIndex] = [];
                }
                if (!endTimes[serviceIndex]) {
                    endTimes[serviceIndex] = [];
                }
                if (!selectedDaysOfWeek[serviceIndex]) {
                    selectedDaysOfWeek[serviceIndex] = [];
                }
                (bookingService.timeRanges || []).forEach((timeRange, rangeIndex) => {
                    if (undefined !== timeRange.startTime) {
                        startTimes[serviceIndex][rangeIndex] = normalizer.secondsToStrTime(timeRange.startTime);
                    }
                    if (undefined !== timeRange.endTime) {
                        endTimes[serviceIndex][rangeIndex] = normalizer.secondsToStrTime(timeRange.endTime);
                    }
                    if (undefined !== timeRange.weekDays) {
                        selectedDaysOfWeek[serviceIndex][rangeIndex] = this.weekDays
                            .filter(item => -1 !== timeRange.weekDays.indexOf(item.value))
                            .map(item => item.text);
                    }
                })
            });

            this.occupancyDelays = occupancyDelays;
            this.startTimes = startTimes;
            this.endTimes = endTimes;
            this.selectedDaysOfWeek = selectedDaysOfWeek;

            this.refreshServiceTimestamp();
        },
        initializeBookingService(serviceIndex) {
            if (!this.bookingServices) {
                this.bookingServices = [];
            }
            if (!this.bookingServices[serviceIndex]) {
                this.bookingServices[serviceIndex] = {};
            }
        },
        initializeTimeRange(serviceIndex, rangeIndex) {
            this.initializeBookingService(serviceIndex);
            if (!this.bookingServices[serviceIndex].timeRanges) {
                this.bookingServices[serviceIndex].timeRanges = [];
            }
            if (!this.bookingServices[serviceIndex].timeRanges[rangeIndex]) {
                this.bookingServices[serviceIndex].timeRanges[rangeIndex] = {
                    allowAfterMidnight: false
                };
            }
        },
        onDeliveryModeCheck(index) {
            let deliveryModeChecked = this.checkedDeliveryModes[index];
            let deliveryMode = this.currentDeliveryModes[index];
            let promise = Promise.resolve();

            this.isDeliveryModeLoading[index] = true;
            this.refreshDeliveryTimestamp();
            if (deliveryModeChecked && !deliveryMode.id) {
                deliveryMode = {
                    partnerHotelResto: this.currentPartner.partnerHotelResto['@id'],
                    name: this.restoDeliveryMethods[index].value,
                };
                promise = this.updatePartnerPropertyFromForm({
                    data: {
                        deliveryMode,
                        parentEntityName: 'partnerHotelResto',
                    }
                })
            } else if (!deliveryModeChecked && deliveryMode.id) {
                promise = this.deletePartnerPropertyFromForm({
                    data: {
                        deliveryMode,
                        parentEntityName: 'partnerHotelResto',
                    }
                })
            }

            promise.finally(() => {
                this.initializeDeliveryModes();
                this.verifyFields();
                this.isDeliveryModeLoading[index] = false;
                this.refreshDeliveryTimestamp();
            });
        },
        onDeliveryModeChange(event, index, data) {
            let deliveryModeChecked = this.checkedDeliveryModes[index];
            if (!deliveryModeChecked) {
                return;
            }
            if (data) {
                data.parentEntityName = 'partnerHotelResto';
            }
            let provider = this.$refs[event.target.name];
            this.updatePartnerPropertyFromForm({
                event,
                provider: (provider || [])[0] || provider,
                data: data ? Object.assign({ previousEditedValue: this.previousEditedValue }, data) : undefined
            }).then(() => this.verifyFields());
        },
        onOtherDeliveryModeChange(event) {
            if (this.previousEditedValue === this.otherDeliveryModeName) {
                return;
            }

            this.isOtherDeliveryModeLoading = true;
            let deliveryMode = {
                partnerHotelResto: this.currentPartner.partnerHotelResto['@id'],
                name: this.otherDeliveryModeName,
            };
            this.updatePartnerPropertyFromForm({
                data: {
                    deliveryMode,
                    parentEntityName: 'partnerHotelResto',
                }
            }).then(() => {
                this.checkedOtherDeliveryMode = false;
                this.otherDeliveryModeName = null;
            }).finally(() => {
                this.initializeDeliveryModes();
                this.verifyFields();
                this.isOtherDeliveryModeLoading = false;
                this.refreshDeliveryTimestamp();
            });
        },
        initializeDeliveryModes() {
            const deliveryModes = this.currentPartner.partnerHotelResto.deliveryModes || [];
            const currentDeliveryModes = [];
            const checkedDeliveryModes = [];

            // check registered delivery modes from restoDeliveryMethods
            this.restoDeliveryMethods.forEach((item, index) => {
                const found = deliveryModes.find(deliveryMode => deliveryMode.name === item.value);
                currentDeliveryModes[index] = found || {};
                checkedDeliveryModes[index] = !!found;
            });

            // check other registered delivery modes
            deliveryModes.forEach(deliveryMode => {
                const found = currentDeliveryModes.find(item => item.id === deliveryMode.id);
                if (!found) {
                    currentDeliveryModes.push(deliveryMode);
                    checkedDeliveryModes.push(true);
                }
            });

            this.currentDeliveryModes = currentDeliveryModes;
            this.checkedDeliveryModes = checkedDeliveryModes;
        },
        async validateFields(refs, entity) {
            if (!this.readyState.allowedToEdit) {
                return;
            }

            let isValid = await validateSection.validateRequiredFields(entity, refs, [ 'deliveryModes', 'timeRanges' ]);
            if (isValid) {
                isValid = this.currentPartner.partnerHotelResto.deliveryModes.every(deliveryMode => !!deliveryMode.url);
            }

            validateSection.displayColorStateOnSection('table-booking', isValid);
        },
    }
}
</script>
