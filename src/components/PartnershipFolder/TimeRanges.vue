<template>
    <b-container fluid>
        <b-row class="mb-3" v-if="useCheckBox">
            <b-form-checkbox-group
                @change="onDayOfWeekChecked($event)"
                :disabled="!allowedToEdit || isTimeRangeUpdating"
                :readonly="!allowedToEdit"
                :options="weekDays"
                v-model="checkedDaysOfWeek"
                type="checkbox"
            ></b-form-checkbox-group>
        </b-row>

        <b-row class="my-3 mt-2 time-ranges-container" :class="customClassName" lg="12" v-for="(openingRangeDays, index) in selectedDaysOfWeek" :key="index">
            <b-col v-if="!useCheckBox" sm="12" :md="breakpointLayout(parentEntityName, 12, 4)" class="time-ranges-decoration">
                <b-form-group>
                    <b-form-tags v-model="selectedDaysOfWeek[index]" size="md"
                                 add-on-change no-outer-focus class="mb-2 selected__tags">
                        <template v-slot="{ tags, inputAttrs, inputHandlers, disabled, removeTag }">
                            <ul v-if="tags.length > 0" class="list-inline d-inline selected__days">
                                <li v-for="tag in tags" :key="tag" class="d-inline">
                                    <b-form-tag
                                        @remove="removeTag(tag);onDayOfWeekRemove(tag,index)"
                                        :title="tag"
                                        :disabled="disabled || !allowedToEdit || isTimeRangeUpdating"
                                    >{{ tag }}</b-form-tag>
                                </li>
                            </ul>
                            <b-form-select
                                class="selected__days--options"
                                v-bind="inputAttrs"
                                v-on="inputHandlers"
                                :disabled="disabled || !allowedToEdit || isTimeRangeUpdating || 0 === getAvailableDaysOfWeek(index).length"
                                :readonly="disabled || !allowedToEdit"
                                :options="getAvailableDaysOfWeek(index)"
                                @change="onOpeningRangeDayChange($event, index)"
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
            <b-col sm="5" md="3"
                   :class="!allowedToEdit || {'days-selected': !!selectedDaysOfWeek[index].length && !useCheckBox, 'days-not-selected': !selectedDaysOfWeek[index].length && !useCheckBox}">
                <ValidationProvider mode="passive" name="Heure d'ouverture"
                                    :rules="{ required: selectedDaysOfWeek[index].length > 0, regex: /^\d{2}:\d{2}$/ }" :ref="`timeRanges[${index}].startTime`"
                                    v-slot="{ validate, classes, errors }">
                    <b-form-input
                        @focus="onFocus($event, index);loadCurrentRange(index)"
                        type="time"
                        :class="classes"
                        :name="`timeRanges[${index}].startTime`"
                        @blur="onOpeningRangeTimeChange(startTimes[index], index)"
                        v-model="startTimes[index]"
                        :disabled="!allowedToEdit || isTimeRangeUpdating || !selectedDaysOfWeek[index].length || (useCheckBox && !checkedDaysOfWeek.length)"
                        :readonly="!allowedToEdit"
                    ></b-form-input>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
            <b-col sm="5" md="3"
                   :class="!allowedToEdit || {'days-selected': !!selectedDaysOfWeek[index].length && !useCheckBox, 'days-not-selected': !selectedDaysOfWeek[index].length && !useCheckBox}">
                <ValidationProvider mode="passive" name="Heure de fermeture"
                                    :rules="{ required: selectedDaysOfWeek[index].length > 0, regex: /^\d{2}:\d{2}$/ }" :ref="`timeRanges[${index}].endTime`"
                                    v-slot="{ validate, classes, errors }">
                    <b-form-input
                        @focus="onFocus($event, index);loadCurrentRange(index)"
                        type="time"
                        :class="classes"
                        :name="`timeRanges[${index}].endTime`"
                        v-model="endTimes[index]"
                        @blur="onOpeningRangeTimeChange(endTimes[index], index)"
                        :disabled="!allowedToEdit || isTimeRangeUpdating || !selectedDaysOfWeek[index].length || (useCheckBox && !checkedDaysOfWeek.length)"
                        :readonly="!allowedToEdit"
                    ></b-form-input>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
            <b-col v-if="openCloseEnabled" sm="5" md="2"
                   :class="!allowedToEdit || {'days-selected': !!selectedDaysOfWeek[index].length && !useCheckBox, 'days-not-selected': !selectedDaysOfWeek[index].length && !useCheckBox}">
                <b-form-select
                    @change="onOpenCloseChange(index)"
                    :options="openCloseDate"
                    :name="`timeRanges[${index}].isOpeningRange`"
                    :disabled="!allowedToEdit || isTimeRangeUpdating || !selectedDaysOfWeek[index].length || (useCheckBox && !checkedDaysOfWeek.length)"
                    :readonly="!allowedToEdit"
                    v-model="isOpeningRanges[index]"
                ></b-form-select>
            </b-col>
            <b-col sm="1" v-if="allowedToEdit && !isTimeRangeUpdating"
                   class="remove-opening-range"
                   :class="{'days-selected': !!selectedDaysOfWeek[index].length && !useCheckBox, 'days-not-selected': !selectedDaysOfWeek[index].length && !useCheckBox}">
                <i class="fas fa-trash remove-item-action" @click="onOpeningRangeRemove(index)" title="Supprimer cette plage horaire"></i>
            </b-col>
            <b-col sm="2" v-if="isTimeRangeUpdating && (index === currentIndex || -1 === currentIndex)"
                   class="remove-opening-range"
                   :class="{'days-selected': !!selectedDaysOfWeek[index].length && !useCheckBox, 'days-not-selected': !selectedDaysOfWeek[index].length && !useCheckBox}">
                <i class="fas fa-fan remove-item-action" title="Traitement en cours ..."></i>
            </b-col>
        </b-row>
        <b-row class="mb-3" v-if="allowedToEdit && !isTimeRangeUpdating && (undefined === maxAllowedRanges || selectedDaysOfWeek.length < maxAllowedRanges) && (!useCheckBox || (useCheckBox && checkedDaysOfWeek.length))">
            <div class="float-left add-item-action ml-3" @click="onOpeningRangeAdd" id="add-time-range">
                <i class="fas fa-plus"></i> Ajouter des horaires
            </div>
        </b-row>
    </b-container>
</template>

<script>
import { weekDays, openCloseDate } from "../../Interface/partnershipFolderDatas";
import { mapActions } from "vuex";
import { normalizer } from "@/_helpers";
import { store } from '@/_store';

export default {
    name: "TimeRanges",
    props: [
        'parentEntityName',
        'parentEntity',
        'timeRanges',
        'allowedToEdit',
        'customClassName',
        'useCheckBox',
        'isOpeningRange',
        'maxAllowedRanges',
        'verifyFields',
        'updateTimeRanges',
        'openCloseEnabled',
        'isCampaign',
    ],
    mounted() {
        this._timeRanges = [];
        this._isCampaign = this.isCampaign || false;
        
        let timeout = window.setInterval(() => {
            if (!this.timeRanges) {
                return;
            }
            window.clearInterval(timeout);
            this._timeRanges = this.timeRanges ?
                Array.from(this.timeRanges
                    .filter(openingRange => this._isCampaign === openingRange.isCampaign))
                : [];
            this.initializeTimeRanges();
        }, 50);
    },
    data() {
        return {
            weekDays,
            openCloseDate,
            startTimes: [],
            endTimes: [],
            dates: [],
            openingRanges: [],
            selectedDaysOfWeek: [],
            checkedDaysOfWeek: [],
            currentTimeRanges: [],
            isTimeRangeUpdating: false,
            isNewOpenRange: null,
            _timeRanges: [],
            currentIndex: -1,
            isOpeningRanges: [],
            _isCampaign: false,
        }
    },
    methods: {
        ...mapActions('account', ['updatePartnerPropertyFromForm', 'deletePartnerPropertyFromForm']),
        onFocus(event, index) {
            this.previousEditedValue = event.target.value;
            this.currentIndex = index;
        },
        onOpeningRangeDayChange(selectedDayOfWeek, index) {
            this.loadCurrentRange(index);
            
            if (!this.startTimes[index] || !this.endTimes[index]) {
                return;
            }

            this.isTimeRangeUpdating = true;

            let newTimeRange = {
                dayOfWeek: this.getDayValue(selectedDayOfWeek),
                startTime: normalizer.strTimeToSeconds(this.startTimes[index]),
                endTime: normalizer.strTimeToSeconds(this.endTimes[index]),
                isOpeningRange: this.getIsOpeningRange(index),
                isCampaign: this._isCampaign
            };
            newTimeRange[this.parentEntityName] = this.parentEntity['@id'];

            let data = {
                openingRange: newTimeRange
            };

            return this.updatePartnerPropertyFromForm({data: data}).then(response => {
                this.isTimeRangeUpdating = false;
                let timeRange = response && response[0] ? response[0] : data.openingRange;
                this.updateCurrentTimeRanges(timeRange);
                this.initializeTimeRanges();
                this.verifyFields && this.verifyFields();
            });
        },
        onOpeningRangeTimeChange(time, index) {
            // Time format HH:MM
            if (!/^\d{1,2}:\d{2}$/.test(time) ||
                this.previousEditedValue === time ||
                !this.endTimes[index] ||
                !this.startTimes[index] ||
                !this.selectedDaysOfWeek[index].length
            ) {
                return;
            }

            this.isTimeRangeUpdating = true;
            Promise.all(this.selectedDaysOfWeek[index].map(selectedDayOfWeek => {
                let currentOpeningRange = {
                    dayOfWeek: this.getDayValue(selectedDayOfWeek),
                    startTime: normalizer.strTimeToSeconds(this.startTimes[index]),
                    endTime: normalizer.strTimeToSeconds(this.endTimes[index])
                };
                let openingRangeFound = this.currentTimeRanges.find(
                    currentOpeningRange => currentOpeningRange.dayOfWeek === this.getDayValue(selectedDayOfWeek)
                );
                let data = {};
                
                if (openingRangeFound) {
                    data = {
                        openingRange: openingRangeFound,
                        payload: currentOpeningRange
                    };
                } else {
                    currentOpeningRange = {
                        ...currentOpeningRange,
                        isOpeningRange: this.getIsOpeningRange(index),
                        isCampaign: this._isCampaign
                    };
                    currentOpeningRange[this.parentEntityName] = this.parentEntity['@id'];
                    data.openingRange = currentOpeningRange;
                }

                return this.updatePartnerPropertyFromForm({
                    data,
                    showNotification: false
                }).then(response => {
                    let timeRange = response && response[0] ? response[0] : data.openingRange;
                    this.updateCurrentTimeRanges(timeRange);
                });
            }))
                .then(() => {
                    this._timeRanges = this._timeRanges.filter(item => item.id);
                    this.afterUpdateTimeRangesSuccess();
                })
                .catch(() => this.afterUpdateTimeRangesFailed())
                .finally(() => this.afterUpdateTimeRangesFinally())
            ;
        },
        onOpenCloseChange(index) {
            // Time format HH:MM
            if (!this.endTimes[index] ||
                !this.startTimes[index] ||
                !this.selectedDaysOfWeek[index].length
            ) {
                return;
            }

            const startTime = normalizer.strTimeToSeconds(this.startTimes[index]);
            const endTime = normalizer.strTimeToSeconds(this.endTimes[index]);
            const isOpeningRange = this.isOpeningRanges[index];
            this.isTimeRangeUpdating = true;
            Promise.all(this.selectedDaysOfWeek[index].map(selectedDayOfWeek => {
                let currentOpeningRange = {
                    dayOfWeek: this.getDayValue(selectedDayOfWeek),
                    startTime,
                    endTime
                };
                let openingRangeFound = this.findPartnerOpeningRange(currentOpeningRange)
                let data = {};
                if (openingRangeFound) {
                    data = {
                        openingRange: openingRangeFound,
                        payload: {
                            isOpeningRange,
                            isCampaign: this._isCampaign
                         }
                    };
                } else {
                    currentOpeningRange[this.parentEntityName] = this.parentEntity['@id'];
                    data.openingRange = {
                        ...currentOpeningRange,
                        isOpeningRange,
                        isCampaign: this._isCampaign
                    };
                }

                return this.updatePartnerPropertyFromForm({
                    data,
                    showNotification: false
                }).then(response => {
                    let timeRange = response && response[0] ? response[0] : data.openingRange;
                    this.updateCurrentTimeRanges(timeRange);
                });
            }))
                .then(() => {
                    this._timeRanges = this._timeRanges.filter(item => item.id);
                    this.afterUpdateTimeRangesSuccess();
                })
                .catch(() => this.afterUpdateTimeRangesFailed())
                .finally(() => this.afterUpdateTimeRangesFinally())
            ;
        },
        onDayOfWeekChecked(checkedDaysOfWeek) {
            this.currentIndex = -1;
            if (checkedDaysOfWeek.length && !this.selectedDaysOfWeek.length) {
                this.onOpeningRangeAdd(null, checkedDaysOfWeek);
            }

            this.selectedDaysOfWeek.map((item, index, array) => {
                array[index] = checkedDaysOfWeek.map(day => {
                    return this.getDayLabel(day);
                });
            });

            // Add new
            let newDays = checkedDaysOfWeek.filter(dayOfWeek => !this.checkedDaysOfWeek.includes(dayOfWeek));
            let hasAdded = false;
            let finishToAdd = false;
            if (newDays.length) {
                this.isTimeRangeUpdating = true;
            }
            Promise.all(newDays.map(dayOfWeek => {
                return Promise.all(this.selectedDaysOfWeek.map((item, index) => {
                    let startTime = this.startTimes[index];
                    let endTime = this.endTimes[index];
                    if (undefined === startTime || null === startTime
                        || undefined === endTime || null === endTime
                    ) {
                        return;
                    }

                    let openingRange = {
                        dayOfWeek: dayOfWeek,
                        startTime: normalizer.strTimeToSeconds(startTime),
                        endTime: normalizer.strTimeToSeconds(endTime),
                        isOpeningRange: this.getIsOpeningRange(index),
                        isCampaign: this._isCampaign
                    };
                    openingRange[this.parentEntityName] = this.parentEntity['@id'];

                    return this.updatePartnerPropertyFromForm({data: { openingRange }, showNotification: false})
                        .then(response => {
                            hasAdded = true;
                            let timeRange = response && response[0] ? response[0] : openingRange;
                            this.updateCurrentTimeRanges(timeRange);
                        });
                }));
            }))
                .then(() => hasAdded && this.afterUpdateTimeRangesSuccess())
                .catch(() => this.afterUpdateTimeRangesFailed())
                .finally(() => finishToAdd = true)
            ;

            // Delete old
            let oldDays = this.checkedDaysOfWeek.filter(dayOfWeek => !checkedDaysOfWeek.includes(dayOfWeek));
            let hasDeleted = false;
            let finishToDelete = false;
            if (oldDays.length) {
                this.isTimeRangeUpdating = true;
            }
            Promise.all(oldDays.map(dayOfWeek => {
                return Promise.all(this.selectedDaysOfWeek.map((item, index) => {
                    let openingRange = this.findPartnerOpeningRange({
                        dayOfWeek,
                        startTime: normalizer.strTimeToSeconds(this.startTimes[index]),
                        endTime: normalizer.strTimeToSeconds(this.endTimes[index]),
                    });

                    return this.deletePartnerPropertyFromForm({
                        data: {
                            openingRange: openingRange
                        },
                        showNotification: false,
                    }).then(() => {
                        hasDeleted = true;
                        let timeRangeIdx = this._timeRanges.findIndex(
                            item =>
                                item.dayOfWeek === openingRange.dayOfWeek &&
                                item.startTime === openingRange.startTime &&
                                item.endTime === openingRange.endTime
                        )
                        this._timeRanges.splice(timeRangeIdx, 1);
                        this.initializeTimeRanges();
                    });
                }));
            }))
                .then(() => hasDeleted && this.notifySuccess('Donnée supprimée !'))
                .catch(() => this.afterUpdateTimeRangesFailed())
                .finally(() => finishToDelete = true)
            ;

            let interval = setInterval(() => {
                if (finishToAdd && finishToDelete) {
                    clearInterval(interval);
                    this.isTimeRangeUpdating = false;
                    this.verifyFields && this.verifyFields();
                }
            }, 50);
        },
        updateCurrentTimeRanges(timeRange) {
            let timeRangeFound = false;
            this._timeRanges = this._timeRanges.map(_timeRange => {
                if (this.isSameTimeRange(_timeRange, timeRange)) {
                    timeRangeFound = true;
                    return timeRange;
                }
                return _timeRange;
            });

            if (!timeRangeFound) {
                this._timeRanges.push(timeRange);
            }

            this.updateTimeRanges && this.updateTimeRanges(this._timeRanges);
        },
        onOpeningRangeAdd(event, selectedDaysOfWeek) {
            let newDaysOfWeek = [];
            if (this.useCheckBox) {
                newDaysOfWeek = (selectedDaysOfWeek || this.checkedDaysOfWeek).map(day => this.getDayLabel(day));
            }
            this.selectedDaysOfWeek.push(newDaysOfWeek);
            this.isOpeningRanges.push(true);
        },
        onDayOfWeekRemove(day, index, dates = null, showNotification) {
            this.currentIndex = index;
            const startTime = null === dates ? this.startTimes[index] : dates.startTime;
            const endTime = null === dates ? this.endTimes[index] : dates.endTime;
            const timeRangeFound = this.findPartnerOpeningRange({
                dayOfWeek: this.getDayValue(day),
                startTime: startTime ? normalizer.strTimeToSeconds(startTime) : undefined,
                endTime: endTime ? normalizer.strTimeToSeconds(endTime) : undefined,
                isOpeningRange: this.getIsOpeningRange(index),
            });

            if (timeRangeFound) {
                this.isTimeRangeUpdating = true;
                return this.deletePartnerPropertyFromForm({
                    data: {
                        openingRange: timeRangeFound
                    },
                    showNotification: showNotification,
                }).then(() => {
                    let timeRangeIdx = this._timeRanges.findIndex(
                        item => this.isSameTimeRange(timeRangeFound, item)
                    )
                    this._timeRanges.splice(timeRangeIdx, 1);
                    this.initializeTimeRanges();
                    this.isTimeRangeUpdating = false;
                    this.verifyFields && this.verifyFields();
                });
            }

            return Promise.resolve();
        },
        onOpeningRangeRemove(index) {
            this.currentIndex = index;
            this.isTimeRangeUpdating = true;
            Promise.all(this.selectedDaysOfWeek[index].map(
                selectedDayOfWeek => this.onDayOfWeekRemove(selectedDayOfWeek, index, null, false)
            ))
                .then(() => this.afterUpdateTimeRangesSuccess())
                .catch(() => this.afterUpdateTimeRangesFailed())
                .finally(() => this.afterUpdateTimeRangesFinally())
            ;
        },
        getDayLabel(dayValue) {
            return dayValue ? this.weekDays.find(item => item.value === dayValue).text : null;
        },
        getDayValue(dayText) {
            return dayText ? this.weekDays.find(item => item.text === dayText).value : null;
        },
        getAvailableDaysOfWeek(index) {
            return this.weekDays
                .map(item => item.text)
                .filter(day => -1 === this.selectedDaysOfWeek[index].indexOf(day));
        },
        findPartnerOpeningRange(openingRange) {
            return this._timeRanges.find(
                item =>
                    item.dayOfWeek === openingRange.dayOfWeek &&
                    item.startTime === openingRange.startTime &&
                    item.endTime === openingRange.endTime &&
                    (undefined === openingRange.isOpeningRange || item.isOpeningRange === openingRange.isOpeningRange)
            );
        },
        initializeTimeRanges() {
            let filteredTimeRanges = this._timeRanges.filter(item => item.id);
            if (!this.allowedToEdit) {
                this._timeRanges = filteredTimeRanges;
            }

            let timeRanges = [];
            let selectedDaysOfWeek = [];
            let startTimes = [];
            let endTimes = [];
            let dates = [];
            let isOpeningRanges = [];

            this._timeRanges.forEach(item => {
                if (item.date) {
                    dates[item.id] = (new Date(item.date)).toLocaleDateString();
                } else {
                    timeRanges.push(item);
                }
            });

            let alreadyProcessedRanges = [];
            timeRanges.sort((a, b) => a.dayOfWeek - b.dayOfWeek).forEach(item => {
                let currentRange = `${item.startTime}:${item.endTime}:${item.isOpeningRange}`;
                let indexOfRange = alreadyProcessedRanges.indexOf(currentRange);
                if (-1 !== indexOfRange) {
                    selectedDaysOfWeek[indexOfRange].push(this.getDayLabel(item.dayOfWeek));
                } else {
                    selectedDaysOfWeek.push([this.getDayLabel(item.dayOfWeek)]);
                    alreadyProcessedRanges.push(currentRange);
                    startTimes.push(
                        (undefined !== item.startTime && null !== item.startTime)
                            ? normalizer.secondsToStrTime(item.startTime)
                            : null
                    );
                    endTimes.push(
                        (undefined !== item.endTime && null !== item.endTime)
                            ? normalizer.secondsToStrTime(item.endTime)
                            : null
                    );
                    isOpeningRanges.push(item.isOpeningRange);
                }
            });

            this.selectedDaysOfWeek = selectedDaysOfWeek;
            this.startTimes = startTimes;
            this.endTimes = endTimes;
            this.dates = dates;
            this.isOpeningRanges = isOpeningRanges;

            this.checkedDaysOfWeek = [... new Set(
                this._timeRanges.map(openingRange => openingRange.dayOfWeek)
            )];

            this.updateTimeRanges && this.updateTimeRanges(this._timeRanges);
        },
        isSameTimeRange(timeRange1, timeRange2) {
            return (undefined !== timeRange1.id && timeRange1.id === timeRange2.id)
                || (timeRange2.dayOfWeek === timeRange1.dayOfWeek &&
                    timeRange2.startTime === timeRange1.startTime &&
                    timeRange2.endTime === timeRange1.endTime &&
                    timeRange2.isOpeningRange === timeRange1.isOpeningRange
                )
        },
        loadCurrentRange(index) {
            this.currentTimeRanges = this._timeRanges.filter(
                item =>
                    item.startTime === normalizer.strTimeToSeconds(this.startTimes[index]) &&
                    item.endTime === normalizer.strTimeToSeconds(this.endTimes[index])
            );
        },
        getIsOpeningRange(index) {
            return this.openCloseEnabled
                ? this.isOpeningRanges[index]
                : (undefined !== this.isOpeningRange ? this.isOpeningRange : true);
        },
        breakpointLayout(parentEntityName, breakpointTrue, breakpointFalse) {
            return 'agendaMember' === parentEntityName ? breakpointTrue : breakpointFalse;
        },
        afterUpdateTimeRangesSuccess() {
            this.notifySuccess('Donnée sauvegardée !');
            this.initializeTimeRanges();
        },
        afterUpdateTimeRangesFailed() {
            this.notifyFailure('Impossible de mettre à jour les informations du partenaire.');
        },
        afterUpdateTimeRangesFinally() {
            this.isTimeRangeUpdating = false;
            this.verifyFields && this.verifyFields();
        },
        notifySuccess(message) {
            store.dispatch(
                'alert/success',
                {
                    group: 'general-error',
                    type: 'success',
                    message,
                    show: true,
                    title: 'Envoyé !'
                }
            );
        },
        notifyFailure(message) {
            store.dispatch(
                'alert/error',
                {
                    group: 'general-error',
                    message,
                    show: true,
                    title: 'Erreur',
                    type: 'error'
                }
            );
        },
    }
}
</script>
