<template>
    <b-container fluid>
        <!-- reportForm -->
        <b-row class="mb-3">
            <!-- @todo fake value now -->
            <b-col lg="3" md="4" class="text-left">
                <b-form-checkbox
                    :disabled="true"
                    :readonly="true"
                    :checked="status.hasPhotosReport10"
                    type="checkbox"
                >
                Reportage 10 photos
                </b-form-checkbox>
            </b-col>
            <b-col lg="3" md="4" class="text-left">
                <b-form-checkbox
                    :disabled="true"
                    :readonly="true"
                    :checked="status.hasPhotosVideoReport10"
                    type="checkbox"
                >
                Reportage 10 photos + vidéos 60s
                </b-form-checkbox>
            </b-col>
            <b-col lg="3" md="4" class="text-left">
                <b-form-checkbox
                    :disabled="true"
                    :readonly="true"
                    :checked="status.hasVirtualVisit"
                    type="checkbox"
                >
                Reportage 10 photos + visite virtuelle
                </b-form-checkbox>
            </b-col>
            <b-col lg="3" md="4" class="text-left">
                <b-form-checkbox
                    :disabled="true"
                    :readonly="true"
                    :checked="status.hasPhotosReport20"
                    type="checkbox"
                >
                Reportage 20 photos
                </b-form-checkbox>
            </b-col>
        </b-row>
        <b-row v-for="(item, index) in currentPartner.footages" :key="item.id" class="footage-period-container mb-2">
            <i class="fas fa-trash d-block d-md-none remove-item-action" @click="onFootageRemove(item, index)" title="Supprimer cette disponibilité"></i>
            <b-col lg="4" md="6">
                <ValidationProvider name="date de rendez-vous" rules="required" :ref="`currentPartner.footages[${index}].date`"
                                    v-slot="{ validate, classes, errors }">
                    <b-form-datepicker
                        @input="onDateChange($event, { footage: currentPartner.footages[index] }, selectedFootagePeriods[index])"
                        type="date"
                        :class="classes"
                        v-model="item.date"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                        :name="`currentPartner.footages[${index}].date`"
                        :min="minDate"
                        :max="maxDate"
                        start-weekday="1"
                    ></b-form-datepicker>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
            <b-col lg="5" md="5">
                <b-row>
                    <b-col v-for="dayPeriod in dayPeriods" :key="`${index}-${dayPeriod.value}`">
                        <ValidationProvider name="Période de disponible" :rules="{ required:{ allow: false} }" :ref="`footages[${index}][${dayPeriod.value}].period`"
                                            v-slot="{ validate, classes, errors }">
                            <b-form-checkbox-group
                                @change.native="onFootagePeriodChange($event, currentPartner.footages[index], selectedFootagePeriods[index])"
                                :options="[ dayPeriod ]"
                                v-model="selectedFootagePeriods[index]"
                                :disabled="!identity.allowedToEdit || !currentPartner.footages[index].date"
                                :readonly="!identity.allowedToEdit"
                                :name="`footages[${index}][${dayPeriod.value}].period`"
                                type="checkbox"
                            >
                            </b-form-checkbox-group>
                            <small :class="classes">{{ errors[0] }}</small>
                        </ValidationProvider>
                    </b-col>
                    <b-col cols="1" v-if="identity.allowedToEdit" class="d-none d-md-block">
                        <i class="fas fa-trash remove-item-action" @click="onFootageRemove(item, index)" title="Supprimer cette disponibilité"></i>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
        <b-row class="my-3" v-if="identity.allowedToEdit">
            <div class="float-left add-item-action ml-3" @click="onFootageAdd">
                <i class="fas fa-plus"></i> Ajouter une disponibilité
            </div>
        </b-row>
    </b-container>
</template>

<script>
import { mapActions, mapState } from "vuex";
import {footages, dayPeriods} from "../../Interface/partnershipFolderDatas";

require('../../assets/style/Pfolder/partnership-folder.css');


export default {
    name: 'Report',
    computed: {
        ...mapState('account', ['identity', 'currentPartner']),
        ...mapState('globalStore', ['status'])
    },
    data() {
        const maxDays = 15;
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const minDate = new Date(today);
        const maxDate = new Date(today);
        maxDate.setDate(minDate.getDate() + maxDays)

        return {
            footages,
            dayPeriods,
            selectedFootagePeriods: [],
            maxDays: maxDays,
            previousEditedValue: null,
            minDate: minDate,
            maxDate: maxDate,
        }
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
                provider: provider[0] || provider,
                data: data ? Object.assign({ previousEditedValue: this.previousEditedValue }, data) : undefined
            });
        },
        onDateChange(value, data, selectedPeriods) {
            if (!selectedPeriods || !selectedPeriods.length) {
                return;
            }

            if (!data.footage || !data.footage.id) {
                data.footage = {
                    date: value,
                    partner: this.currentPartner['@id'],
                }
            } else {
                data.offset = 'date';
                data.value = value;
            }
            this.updatePartnerPropertyFromForm({
                data: data ? Object.assign({ previousEditedValue: this.previousEditedValue }, data) : undefined
            });
        },
        onFootagePeriodChange(event, footage, selectedPeriods) {
            let data = {
                footage: footage || {}
            };

            switch (selectedPeriods.length) {
                case 2:
                    data.footage.period = 'All';
                    break;
                case 1:
                    data.footage.period = selectedPeriods[0];
                    break;
            }

            if (!footage || !footage.id) {
                data.footage.partner = this.currentPartner['@id'];
            } else {
                data.offset = 'period';
                data.value = footage.period;
            }
            
            
            this.updatePartnerPropertyFromForm({ data: data });
        },
        onFootageAdd() {
            this.currentPartner.footages.push({
                date: null,
                period: null,
                partner: this.currentPartner['@id'],
            });
        },
        onFootageRemove(footage, index) {
            if (footage && footage.id) {
                this.deletePartnerPropertyFromForm({
                    data: {footage: footage}
                });
            } else {
                this.currentPartner.footages.splice(index, 1);
            }
        },
    },
    mounted() {
        this.currentPartner.footages.forEach(item => {
            let periods = [];
            switch (item.period) {
                case 'AM':
                case 'PM':
                    periods = [item.period];
                    break;
                case 'All':
                    periods = ['AM', 'PM'];
                    break;
            }
            this.selectedFootagePeriods.push(periods);
        });
    },
}
</script>
