<template>
    <b-container fluid>
        <b-row class="my-3" v-if="displayEntitle">
            <b-col>Horaires exceptionnels</b-col>
        </b-row>
        <small class="text-italic red-text">
          Attention de ne pas mettre de périodes de dates trop conséquentes. Sinon, indiquez-les dans la rubrique “Notes pour la production".
        </small>
        <b-row class="mb-3" v-for="(item, index) in exceptionalDates" :key="`exceptional-date-${timestamp}-${index}`">
            <b-col sm="12" md="3" lg="2">
                <label class="label">Date de début</label>
                <ValidationProvider name="startDate" rules="min:3|checkPeriodDates:@startDate,@endDate" :ref="`exceptionalDates[${index}].startDate`"
                                    v-slot="{ validate, classes, errors }">
                    <b-form-datepicker
                        @input="onExceptionalStartDateChange(item, index)"
                        type="date"
                        v-model="item.startDate"
                        :min="minDate"
                        :max="maxDate"
                        :class="classes"
                        :name="`exceptionalDates[${index}].startDate`"
                        :disabled="!isAllowedToEdit || isLoading[index]"
                        :readonly="!isAllowedToEdit"
                        :size="size || 'md'"
                        start-weekday="1"
                    ></b-form-datepicker>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
            <b-col sm="12" md="3" lg="2">
                <label class="label">Date de fin</label>
                <ValidationProvider name="endDate" rules="min:3|checkPeriodDates:@startDate,@endDate" :ref="`exceptionalDates[${index}].endDate`"
                                    v-slot="{ validate, classes, errors }">
                    <b-form-datepicker
                        @input="onExceptionalEndDateChange(item, index)"
                        type="date"
                        v-model="item.endDate"
                        :min="minDate"
                        :max="maxDate"
                        :class="classes"
                        :name="`exceptionalDates[${index}].endDate`"
                        :disabled="!isAllowedToEdit || isLoading[index]"
                        :readonly="!isAllowedToEdit"
                        :size="size || 'md'"
                        start-weekday="1"
                    ></b-form-datepicker>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
            <b-col sm="12" md="3" lg="2" v-if="enableReason">
                <label class="label">Motif</label>
                <ValidationProvider name="Motif" rules="min:3" :ref="`parentEntity.exceptionalDates[${index}].reason`"
                                    v-slot="{ validate, classes, errors }">
                    <b-form-input
                        @change.native="onReasonChange($event, index, item)"
                        :class="classes"
                        :name="`parentEntity.exceptionalDates[${index}].reason`"
                        :disabled="!isAllowedToEdit || !item.id || isLoading[index]"
                        :readonly="!isAllowedToEdit"
                        v-model="item.reason"
                    ></b-form-input>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
            <b-col sm="12" md="3" lg="2" v-if="enableIsOpeningRange">
                <label class="label">Ouvert - Fermé</label>
                <ValidationProvider name="Ouverture/Fermeture exceptionnelle" rules="min:3" :ref="`parentEntity.exceptionalDates[${index}].isOpeningRange`"
                                    v-slot="{ validate, classes, errors }">
                    <b-form-select
                        @change="onOpenCloseChange(item, index)"
                        :options="openCloseDate"
                        :class="classes"
                        :name="`parentEntity.exceptionalDates[${index}].isOpeningRange`"
                        :disabled="!isAllowedToEdit || isLoading[index]"
                        :readonly="!isAllowedToEdit"
                        v-model="item.isOpeningRange"
                    ></b-form-select>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
            <b-col sm="2" md="2" lg="2" v-if="isAllowedToEdit" class="remove-opening-range">
                <i v-if="!isLoading[index]" class="fas fa-trash remove-item-action" @click="onExceptionalDateRemove(item)" title="Supprimer cette plage horaire"></i>
                <i v-else class="fas fa-fan remove-item-action" title="Traitement en cours..."></i>
            </b-col>
        </b-row>
        <b-row v-if="isAllowedToEdit">
            <div class="float-left add-item-action ml-3 my-3" @click="onExceptionalDateAdd">
                <i class="fas fa-plus"></i> Ajouter des horaires exceptionnels
            </div>
        </b-row>
    </b-container>
</template>

<script>

import { extend } from 'vee-validate';
import { store } from '@/_store';
import { mapActions, mapState } from "vuex";
import { openCloseDate } from '../../Interface/partnershipFolderDatas';
import { dateHelpers, validateSection } from "@/_helpers";

extend('checkPeriodDates', validateSection.checkPeriodDates);

export default {
    name: "ExceptionnalDates",
    props: [
        'parentEntityName',
        'parentEntityPath',
        'allowedToEdit',
        'enableIsOpeningRange',
        'enableReason',
        'size',
        'displayEntitle',
        'isOpeningRange'
    ],
    computed: {
        ...mapState('account', ['identity', 'currentPartner']),
        isAllowedToEdit() {
            return (undefined !== this.allowedToEdit && this.allowedToEdit) ||
                (undefined === this.allowedToEdit && this.identity.allowedToEdit);
        },
        parentEntity() {
            let entity = this;
            this.parentEntityPath.split('.').forEach(offset => entity = entity[offset]);
            return entity;
        },
        minDate() {
            return new Date();
        },
        maxDate() {
            const date = new Date();
            date.setFullYear(date.getFullYear() + 1);
            return date;
        }

    },
    data() {
        return {
            openCloseDate,
            previousEditedValue: null,
            exceptionalDates: [],
            exceptionalOpeningRanges: [],
            isLoading: [],
            timestamp: 0,
        };
    },
    methods: {
        ...mapActions('account', ['updatePartnerPropertyFromForm', 'deletePartnerPropertyFromForm']),
        onFocus(event) {
            this.previousEditedValue = event.target.value;
        },
        onReasonChange(event, index, data) {
            if (this.previousEditedValue !== event.target.value) {
                this.isLoading[index] = true;
            }

            let openingRanges = [];
            let period = this.exceptionalDates[index];
            let startDate = new Date(period.startDate);
            let endDate = period.endDate ? new Date(period.endDate) : startDate;
            let nextDate = startDate;
            while (0 >= nextDate - endDate) {
                let openingRange = this.findOpeningRangeByDate(nextDate, period.isOpeningRange);
                openingRange.reason = data.reason;
                openingRanges.push(openingRange);
                nextDate = dateHelpers.getNextDayDate(nextDate);
            }

            Promise.all(openingRanges.map(openingRange => {
                data.openingRange = openingRange;
                data.payload = {
                    reason: openingRange.reason
                };
                this.updatePartnerPropertyFromForm({ data });
            })).finally(() => {
                this.isLoading[index] = false;
                this.refreshTimestamp();
            });
        },
        onExceptionalDateAdd() {
            this.exceptionalDates.push({
                startDate: null,
                endDate: null,
                isOpeningRange: undefined === this.isOpeningRange || this.isOpeningRange
            });
        },
        onExceptionalStartDateChange(period, index) {
            if (!period.endDate) {
                period.endDate = period.startDate;
            }

            if (!this.isPeriodDatesValid(period, index)) {
                return;
            }

            this.onExceptionalDateChange(index);
        },
        onExceptionalEndDateChange(period, index) {
            if (!period.startDate) {
                period.startDate = period.endDate;
            }

            if (!this.isPeriodDatesValid(period, index)) {
                return;
            }

            this.onExceptionalDateChange(index);
        },
        onExceptionalDateChange(index) {
            let newOpeningRanges = [];
            let parentId = this.parentEntity['@id'];
            this.isLoading[index] = true;
            this.refreshTimestamp();

            // Manage new exceptional dates to add
            this.exceptionalDates.forEach(period => {
                if (!period.startDate || !period.endDate) {
                    return;
                }

                let startDate = new Date(period.startDate);
                let endDate = period.endDate ? new Date(period.endDate) : startDate;
                let nextDate = startDate;

                while (0 >= nextDate - endDate) {
                    if (!this.findOpeningRangeByDate(nextDate, period.isOpeningRange)) {
                        const newOpeningRange = {
                            date: (new Date(nextDate)).toISOString(),
                            isOpeningRange: period.isOpeningRange
                        };
                        newOpeningRange[this.parentEntityName] = parentId;
                        newOpeningRanges.push(newOpeningRange);
                    }
                    nextDate = dateHelpers.getNextDayDate(nextDate);
                }
            });

            // Manage useless exceptional dates to remove
            let oldOpeningRanges = [];
            this.getExceptionalOpeningRanges().forEach(openingRange => {
                if (!this.isOpeningRangeSelected(openingRange)) {
                    oldOpeningRanges.push(openingRange);
                }
            });

            Promise.all([
                ...newOpeningRanges.map(
                    openingRange => this.updatePartnerPropertyFromForm({
                        data: {
                            openingRange,
                            parentEntityName: this.parentEntityName
                        },
                        showNotification: false
                    })
                ),
                ...oldOpeningRanges.map(
                    openingRange => this.deletePartnerPropertyFromForm({
                        data: {
                            openingRange,
                            parentEntityName: this.parentEntityName
                        },
                        showNotification: false
                    })
                )
            ]).then(
                () => this.onUpdateSuccessed()
            ).catch(
                err => this.onUpdateFailed(err)
            ).finally(() => {
                this.isLoading[index] = false;
                this.refreshTimestamp();
            });
        },
        onOpenCloseChange(period, index) {
            if (!this.isPeriodDatesValid(period, index)) {
                return;
            }

            let startDate = new Date(period.startDate);
            let endDate = period.endDate ? new Date(period.endDate) : startDate;
            let nextDate = startDate;
            let openingRangesToRemove = [];

            while (0 >= nextDate - endDate) {
                let openingRange = this.findOpeningRangeByDate(nextDate, !period.isOpeningRange);
                if (openingRange) {
                    openingRange.isOpeningRange = period.isOpeningRange;
                    openingRangesToRemove.push(openingRange);
                }
                nextDate = dateHelpers.getNextDayDate(nextDate);
            }

            Promise.all(openingRangesToRemove.map(openingRange => {
                this.updatePartnerPropertyFromForm({
                    data: {
                        offset: 'isOpeningRange',
                        value: openingRange.isOpeningRange,
                        openingRange,
                        parentEntityName: this.parentEntityName
                    },
                    showNotification: false
                });
            })).then(
                () => this.onUpdateSuccessed()
            ).catch(
                err => this.onUpdateFailed(err)
            ).finally(
                () => this.refreshTimestamp()
            );
        },
        onExceptionalDateRemove(period) {
            let startDate = new Date(period.startDate);
            let endDate = period.endDate ? new Date(period.endDate) : startDate;
            let nextDate = startDate;
            let openingRangesToRemove = [];

            while (0 >= nextDate - endDate) {
                let openingRange = this.findOpeningRangeByDate(nextDate, period.isOpeningRange);
                if (openingRange) {
                    openingRangesToRemove.push(openingRange);
                }
                nextDate = dateHelpers.getNextDayDate(nextDate);
            }

            Promise.all(openingRangesToRemove.map(
                openingRange => this.deletePartnerPropertyFromForm({
                    data: {
                        openingRange,
                        parentEntityName: this.parentEntityName
                    },
                    showNotification: false
                })
            )).then(
                () => this.onUpdateSuccessed()
            ).catch(
                err => this.onUpdateFailed(err)
            ).finally(
                () => this.refreshTimestamp()
            );
        },
        initializeOpeningRanges() {
            let exceptionalDates = [];
            let periodIndex = 0;
            [true, false].forEach(isOpeningRange => {
                const openingRanges = this.getExceptionalOpeningRanges(isOpeningRange);
                let nextDate = null;
                const initializePeriod = function(item) {
                    let currentDate = new Date(item.date);
                    exceptionalDates[periodIndex] = {
                        ...item,
                        startDate: currentDate,
                        endDate: currentDate,
                    };
                    nextDate = dateHelpers.getNextDayDate(currentDate);
                };

                openingRanges.forEach(item => {
                    let currentDate = new Date(item.date);
                    if (null === nextDate) {
                        // Initialize first start date with first date
                        initializePeriod(item);
                        return;
                    }

                    if (0 === currentDate - nextDate) {
                        // if the next date is this current date, so it could be the end date of this period.
                        exceptionalDates[periodIndex].endDate = item.date;
                        nextDate = dateHelpers.getNextDayDate(currentDate);
                    } else {
                        // otherwise, the current date is a start date of a new period.
                        periodIndex++;
                        initializePeriod(item);
                    }
                });

                if (exceptionalDates.length) {
                    periodIndex++;
                }
            });

            this.exceptionalDates = exceptionalDates.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
        },
        findOpeningRangeByDate(date, isOpeningRange) {
            let timestamp = new Date(date).getTime();
            return this.getExceptionalOpeningRanges().find(
                item => new Date(item.date.replace(/T.*/, '')).getTime() === timestamp
                    && item.isOpeningRange === isOpeningRange
            );
        },
        getExceptionalOpeningRanges(isOpeningRange) {
            return this.parentEntity.openingRanges
                .filter(item =>
                    !!item.date
                    && (null === isOpeningRange || undefined === isOpeningRange || isOpeningRange === item.isOpeningRange)
                )
                .sort((a, b) => new Date(a.date) - new Date(b.date))
            ;
        },
        isPeriodDatesValid(period, indexToExclude) {
            if (!period.startDate || !period.endDate) {
                return false;
            }

            let startDate = new Date(period.startDate).getTime();
            let endDate = new Date(period.endDate).getTime();
            let isOpen = period.isOpeningRange;

            if (startDate > endDate) {
                return false;
            }

            let hasConflict = this.exceptionalDates.some((item, index) => {
                // Ignore this itself item (this item is the same as the given period)
                if (index === indexToExclude) {
                    return false;
                }

                // Ignore this item => it's a not already saved new one
                if (!item.startDate || !item.endDate) {
                    return false;
                }

                let itemStartDate = new Date(item.startDate).getTime();
                let itemEndDate = new Date(item.endDate).getTime();

                return (item.isOpeningRange === isOpen && (
                    (itemStartDate <= endDate && endDate <= itemEndDate) // the given period endDate is inside this item range
                    || (itemStartDate <= startDate && startDate <= itemEndDate) // the given period startDate is inside this item range
                    || (startDate <= itemStartDate && itemEndDate <= endDate) // the given period includes this item range
                ));
            });

            if (hasConflict) {
                store.dispatch(
                    'alert/error',
                    {
                        group: 'general-error',
                        message: 'Vous avez des conflits dans la période sélectionnée.<br /><strong>Enregistrement impossible !</strong>',
                        show: true,
                        title: 'Période en chevauchement',
                        type: 'error'
                    },
                    { root: true }
                );
            }

            return !hasConflict;
        },
        isOpeningRangeSelected(openingRange) {
            const timestamp = new Date(openingRange.date.replace(/T.*/, '')).getTime();

            return this.exceptionalDates.some(period => {
                const startTimestamp = new Date(period.startDate).getTime();
                const endTimestamp = period.endDate ? new Date(period.endDate).getTime() : startTimestamp;

                return timestamp >= startTimestamp && timestamp <= endTimestamp
                    && period.isOpeningRange === openingRange.isOpeningRange;
            });
        },
        onUpdateSuccessed() {
            this.initializeOpeningRanges();
            store.dispatch(
                'alert/success',
                {
                    group: 'general-error',
                    type: 'success',
                    message: 'Donnée sauvegardée !',
                    show: true,
                    title: 'Envoyé !'
                },
                {root: true}
            );
        },
        onUpdateFailed(err) {
            console.error(err);
            store.dispatch(
                'alert/error',
                {
                    group: 'general-error',
                    message: 'Impossible de mettre à jour les informations du partenaire.',
                    show: true,
                    title: 'Erreur',
                    type: 'error'
                },
                { root: true }
            );
        },
        refreshTimestamp() {
            this.timestamp = (new Date()).getTime();
        }
    },
    mounted() {
        this.refreshTimestamp();
        this.$nextTick(() => {
            this.initializeOpeningRanges();
        });
    }
}
</script>
