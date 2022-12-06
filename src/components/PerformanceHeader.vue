<template>
    <b-container fluid>
        <b-row class="audience-header">
            <b-col class="element" lg="4" sm="4" cols="12">
                <h2> {{ title }} </h2>
            </b-col>
            <b-col class="element" lg="4" sm="4" cols="12">
                <a v-if="websiteLink !== null" :href="websiteLink" target="_blank">
                    www.{{ websiteLink.replace(/https?:\/\//, '').replace('/', '') }}
                </a>
                <a v-else-if="websiteLink === null">
                    <div>Aucun site</div>
                </a><br/>
            </b-col>
            <b-col class="calendar-element" lg="4" md="4" sm="4">
                <b-row>
                    <b-col sm="2">
                        <img src="../assets/calendar.svg">
                    </b-col>
                    <b-col sm="10">
                        <date-range-picker
                            ref="picker"
                            :locale-data="localeData"
                            :ranges="ranges"
                            v-model="currentDateRange"
                            :minDate="null"
                            :maxDate="maxDate"
                            :opens="'left'"
                            :timePicker="false"
                            :closeOnEsc="true"
                            @update="updateRange"
                        >
                            <template v-slot:input="picker" style="min-width: 350px">
                                <b-row>
                                    <b-col sm="10">
                                        {{ picker.startDate | date }} - {{ picker.endDate | date }}
                                    </b-col>
                                    <b-col sm="2">
                                        <img src="../assets/arrow-multi-choice.svg">
                                    </b-col>
                                </b-row>
                            </template>
                        </date-range-picker>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import FadeLoader from 'vue-spinner/src/FadeLoader.vue';
import DateRangePicker from 'vue2-daterange-picker';
import moment from "moment";

require('vue-tour/dist/vue-tour.css');

export default {
    name: 'PerformanceHeader',
    components: {
        FadeLoader,
        DateRangePicker
    },
    model: {
        prop: 'dateRange',
        event: 'change'
    },
    props: {
        title: String,
        dateRange: {
            default: {}
        }
    },
    computed: {
        ...mapState('globalStore', ['websiteLink']),
    },
    filters: {
        date(val) {
            return val ? moment(val).format('DD/MM/YYYY') : '';
        }
    },
    data() {
        return {
            ranges: {},
            range: {},
            maxDate: new Date(new Date().setDate(new Date().getDate() - 1)),
            picker: null,
            localeData: {
                firstDay: 1,
                format: 'dd/mm/yyyy',
                separator: ' - ',
                applyLabel: 'Appliquer',
                cancelLabel: 'Annuler',
                weekLabel: 'S',
                daysOfWeek: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
                monthNames: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jui', 'Jui', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
            },
            currentDateRange: {},
        };
    },
    methods: {
        updateRange(val) {
            this.$emit('change', val);
        }
    },
    mounted() {
        this.currentDateRange = this.dateRange;
        const today = new Date(),
            yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        this.ranges = {
            'Hier': [yesterday, yesterday],
            '7 derniers jours': [new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate() - 7), yesterday],
            '30 derniers jours': [new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate() - 30), yesterday],
            'Mois en cours': [new Date(yesterday.getFullYear(), yesterday.getMonth(), 1), new Date()],
            'Mois dernier': [new Date(yesterday.getFullYear(), yesterday.getMonth() - 1, 1), new Date(yesterday.getFullYear(), yesterday.getMonth(), 0)],
            'Année courante': [new Date(yesterday.getFullYear(), 0, 1), yesterday]
        };
    }
};

</script>
