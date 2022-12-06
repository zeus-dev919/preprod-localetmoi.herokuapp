<template>
    <div class="audiencevisibilite">
        <app-headerbuttons></app-headerbuttons>
        <b-container fluid class="bv-example-row">
            <b-row>
                <notifications group="no-ticket" position="bottom right" class="notification-container" />
                <app-menuformation class='hidden-for-mobile margin-menu'></app-menuformation>
                <app-menumobile class="menu-mobile"></app-menumobile>
                <fade-loader v-if="status.isPageLoading || status.isConnectingToAtInternet" color="#ec008c" class="loader-accueil"></fade-loader>
                <b-col v-else lg="9" md="12" sm="12" class="visibilty-container">
                    <b-row class="audience-header">
                        <b-col class="element" lg="4" sm="4" cols="12">
                            <h2>Statistiques de mon site web </h2>
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
                                        :locale-data="{
                                            firstDay: 1,
                                            format: 'dd/mm/yyyy',
                                            separator: ' - ',
                                            applyLabel: 'Appliquer',
                                            cancelLabel: 'Annuler',
                                            weekLabel: 'S',
                                            daysOfWeek: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
                                            monthNames: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jui', 'Jui', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
                                        }"
                                        :ranges="ranges"
                                        v-model="dateRange"
                                        :minDate="null"
                                        :maxDate="maxDate"
                                        :opens="'left'"
                                        :timePicker="false"
                                        @update="updateChartsData()"
                                        :closeOnEsc="true"
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
                    <b-row class="statistiques-container">
                        <b-col sm="12">
                            <b-row class="mt-2">
                                <b-col sm="8">
                                    <b-row>
                                        <b-col sm="3" class="audience-element">
                                            <b-row>
                                                <img src="../assets/uniq-visits.svg"/>
                                            </b-row>
                                            <b-row class="metric-value">
                                                {{ atInternetFields['visits'] || 0}}
                                            </b-row>
                                            <b-row>
                                                Visites uniques
                                            </b-row>
                                        </b-col>
                                        <b-col sm="3" class="audience-element">
                                            <b-row>
                                                <img src="../assets/clock.svg"/>
                                            </b-row>
                                            <b-row class="metric-value">
                                                {{ atInternetFields['time_spent_per_visits'] ? fromSecondsToFullTimeDescription(atInternetFields['time_spent_per_visits']) : 0 }}
                                            </b-row>
                                            <b-row>
                                                Temps passé par visite
                                            </b-row>
                                        </b-col>
                                        <b-col sm="3" class="audience-element">
                                            <b-row>
                                                <img src="../assets/message.svg"/>
                                            </b-row>
                                            <b-row class="metric-value">{{ nbrMsg }}</b-row>
                                            <b-row>
                                                Messages reçus
                                            </b-row>
                                        </b-col>
                                    </b-row>
                                    <b-row>
                                        <b-col sm="3" class="audience-element">
                                            <b-row>
                                                <img src="../assets/file.svg"/>
                                            </b-row>
                                            <b-row class="metric-value">{{ atInternetFields['page_views'] || 0 }}</b-row>
                                            <b-row>
                                                Pages vues
                                            </b-row>
                                        </b-col>
                                        <b-col sm="3" class="audience-element">
                                            <b-row>
                                                <img src="../assets/filesSet.svg"/>
                                            </b-row>
                                            <b-row class="metric-value"> {{ atInternetFields['page_views_per_visits'] ? atInternetFields['page_views_per_visits'].toFixed(2) : 0 }}</b-row>
                                            <b-row>
                                                Pages vues par visite
                                            </b-row>
                                        </b-col>
                                        <b-col sm="3" class="audience-element">
                                            <b-row>
                                                <img src="../assets/newsLetter.svg"/>
                                            </b-row>
                                            <b-row class="metric-value">{{ webtool.newsletter.nbrUser }}</b-row>
                                            <b-row>
                                                Inscriptions newsletter
                                            </b-row>
                                        </b-col>
                                    </b-row>
                                </b-col>
                                <b-col sm="4">
                                    <b-row>
                                        <fade-loader v-if="status.isLoadingSources" color="#ec008c" class="loader-accueil"></fade-loader>
                                        <DoughnutChart
                                            v-else-if="!status.isLoadingSources && doughnutChartDatas.length"
                                            :datas="doughnutChartDatas.map(doughnutChartData => doughnutChartData.visits)"
                                            :labels="doughnutChartDatas.map(doughnutChartData => doughnutChartData.source)"
                                            :colors="doughnutChartDatas.map(doughnutChartData => fromLabelToColor(doughnutChartData.source))"
                                            label="Source de trafic"
                                        />
                                    </b-row>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col sm="12" class="pl-0 mb-3">
                                    <fade-loader v-if="status.isLoadingVisits" color="#ec008c" class="loader-accueil"></fade-loader>
                                    <LineChart
                                        v-else-if="!status.isLoadingVisits && lineChartDatas.length"
                                        :datas="lineChartDatas.map(lineCHartData => lineCHartData.visits)"
                                        :labels="lineChartDatas.map(lineCHartData => lineCHartData.day || (lineCHartData.month ? fromMonthNumberToLabel(lineCHartData.month -1) : lineCHartData.month))"
                                        :label="formattedLabel"
                                        elementLabel="Nombre de visite"
                                    />
                                </b-col>
                            </b-row>
                            <b-row class="text-center" v-if="partner.hasVisibility && !status.isToolbox && isAtInternetDashboardAvailable">
                                <b-col cols="1" class="my-3 offset-sm-4">
                                    <a :href="hasAtInternetReport ? atInternetAutoLogin : '#'" target="_blank">
                                        <b-row class="uppercase btn-at-internet-report" :class="{'unavailable-atinternet': !hasAtInternetReport }">
                                            <b-col cols="3" class="mr-0 px-0 text-center">
                                                <img src="../assets/external-link.svg" width="25" height="25" class="mr-3" />
                                            </b-col>
                                            <b-col class="ml-0 pl-0">
                                                Voir les statistiques détaillées
                                            </b-col>
                                        </b-row>
                                    </a>
                                </b-col>
                            </b-row>
                        </b-col>
                    </b-row>
                </b-col>
            </b-row>
        </b-container>
        <app-footer :class="{'footer-auth': !partner.hasVisibility }"/>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import FadeLoader from 'vue-spinner/src/FadeLoader.vue';
import VueCircle from 'vue2-circle-progress';
import LineChart from './Charts/LinearChart';
import DoughnutChart from './Charts/DoughnutChart';
import { dateHelpers, chartsHelper } from '../_helpers';
import moment from 'moment';
import DateRangePicker from 'vue2-daterange-picker';
// import PerformanceHeader from './PerformanceHeader';

require('../assets/style/visibilite.css');

export default {
    name: 'Audience',
    components: {
        LineChart,
        DoughnutChart,
        FadeLoader,
        VueCircle,
        DateRangePicker,
        // PerformanceHeader
    },
    computed: {
        ...mapState('globalStore', ['partner', 'status', 'webtool', 'websiteLink', 'filterAudienceRange', 'atInternetInformation', 'atInternetVisitsData', 'atInternetSourceData', 'salesforce']),
        ...mapState('account', ['currentPartner']),
        formattedLabel() {
            return this.dateRange ? `Nombre de visites du ${this.formatDate(this.dateRange.startDate)} au ${this.formatDate(this.dateRange.endDate)}` : ''
        },
        isAtInternetDashboardAvailable() {
            // The report button was hidden since 2021-11-29
            return new Date(this.salesforce.account.Date_Mise_en_ligne_Site__c || null) < new Date('2021-11-29 00:00:00');
        }
    },
    mounted () {
        let timeout = setInterval(() => {
            if (this.status.isPageLoading) {
                return;
            }
            clearInterval(timeout);

            this.getNewsletterNbr();
            this.getMessagesCount();
            this.connectToAtInternet()
                .then(() => this.loadAtInternetData());
            this.getUberallListings();
        }, 100);
    },
    data () {
        return {
            hasAtInternetReport: false,
            lineChartDatas: [],
            doughnutChartDatas: [],
            dateRange: {},
            picker: null,
            visitLoadingMsg: 'chargement en cours ...',
            color: '#ec008c',
            atInternetAutoLogin: '',
            uberallLoading: true,
            visitsLastMonth: null,
            reloadingTime: 1,
            reloadingTime2: 2,
            nbrMsg: null,
            atInternetFields: {},
            ranges: {},
            maxDate: new Date(new Date().setDate(new Date().getDate() - 1))
        };
    },
    filters: {
        date(val) {
            return val ? moment(val).format('DD/MM/YYYY') : '';
        }
    },
    methods: {
        ...mapActions('globalStore', ['getUberallListings', 'connectToAtInternet', 'getNewsletterNbr', 'getCountContactMessages', 'getFilterAudienceValue']),
        loadAtInternetData() {
            const today = new Date();
            const startDate = new Date();
            const yesterday = new Date();
            startDate.setMonth(startDate.getMonth() - 1);
            yesterday.setDate(today.getDate() - 1);
            this.dateRange = this.filterAudienceRange || {
                startDate: startDate,
                endDate: yesterday
            };
            this.ranges = {
                'Hier': [yesterday, yesterday],
                '7 derniers jours': [new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate() - 7), yesterday],
                '30 derniers jours': [new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate() - 30), yesterday],
                'Mois en cours': [new Date(yesterday.getFullYear(), yesterday.getMonth(), 1), new Date()],
                'Mois dernier': [new Date(yesterday.getFullYear(), yesterday.getMonth() - 1, 1), new Date(yesterday.getFullYear(), yesterday.getMonth(), 0)],
                'Année courante': [new Date(yesterday.getFullYear(), 0, 1), yesterday]
            };
            this.updateChartsData();
        },
        fromSecondsToFullTimeDescription(seconds) {
            const duration = moment.duration(seconds, 'seconds');
            return moment.utc(duration.asMilliseconds()).format('HH:mm:ss');
        },
        printVisitsStats() {
            if (this.atInternetVisitsData.Rows && this.atInternetVisitsData.Rows.length) {
                const rows = this.atInternetVisitsData.Rows;
                this.lineChartDatas = rows.map(row => ({
                    month: row.time_month,
                    day: row.evo_day ? moment(row.evo_day).format('DD-MM-YY') : null,
                    visits: row.visits
                }));
            }
            this.atInternetFields = Object.assign({}, this.atInternetVisitsData);
        },
        printSourceStats() {
            if (this.atInternetSourceData) {
                let sources = Object.values(this.atInternetSourceData);
                this.doughnutChartDatas = (sources || []).map(row => ({
                    source: row.source,
                    visits: row.visits
                }));
            }
        },
        updateChartsData() {
            this.lineChartDatas = [];
            this.doughnutChartDatas = [];
            this.getFilterAudienceValue({
                customerCode: this.currentPartner.customerCode,
                dateRange: this.dateRange
            }).then(() => {
                const currentWebsite = this.websiteLink.replace(/https?:\/\//, '').replace('/', '');
                this.hasAtInternetReport = this.atInternetInformation && this.atInternetInformation[currentWebsite];
                if (this.hasAtInternetReport) {
                    this.atInternetAutoLogin = this.atInternetInformation[currentWebsite].autologin_url;
                } else {
                    this.visitLoadingMsg = 'Aucune donnée disponible.';
                }

                this.printVisitsStats();
                this.printSourceStats();
            });
        },
        getMessagesCount() {
            this.getCountContactMessages().then(response => {
                for (let site in response) {
                    this.nbrMsg += response[site];
                }
            });
        },
        fromLabelToColor(englishLabel) {
            return chartsHelper.fromLabelToColor(englishLabel);
        },
        fromMonthNumberToLabel(monthNumber) {
            return dateHelpers.fromMonthNumberToLabel(monthNumber);
        },
        formatDate(val) {
            return val ? moment(val).format('DD/MM/YYYY') : '';
        }
    }
};

</script>
