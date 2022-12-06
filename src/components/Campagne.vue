<template>
    <div class="performance">
        <app-headerbuttons/>
        <notifications class="notification-container" group="campaign-notify" position="bottom right"/>
        <b-container fluid>
            <b-row>
                <app-menuformation class='hidden-for-mobile margin-menu'></app-menuformation>
                <app-menumobile class="menu-mobile"></app-menumobile>
                <fade-loader v-if="pageLoading" :color="color" class="loader-site hidden-for-mobile"></fade-loader>
                <b-col v-else class="margin-menu" lg="9" md="12" sm="12">
                    <PerformanceHeader
                        title="Mes rapports Google Ads"
                        v-model="dateRange"
                        @change="onDatePeriodChange($event)"
                    />
                    <b-container fluid>
                        <b-row class="statistiques-container pt-2">
                            <b-col>
                                <b-row class="px-3">
                                    <b-col class="px-1 py-3" md="4">
                                        <b-row>
                                            <b-col>
                                                <b-row class="campaign-element fix-height-120 mx-3 py-4 text-center">
                                                    <b-col cols="5" class="px-0">
                                                        <img src="../assets/eye.svg"/>
                                                    </b-col>
                                                    <b-col class="px-0">
                                                        <span class="metric-value">{{ reportws.Impressions }}</span>
                                                        <br />
                                                        <span class="metric-label">Impressions</span>
                                                        <i class="fas fa-info picto-info" v-b-tooltip.hover title="Nombre de fois que la publicité a été affichée sur Google, sans clic du côté de l’utilisateur."></i>
                                                    </b-col>
                                                </b-row>
                                            </b-col>
                                        </b-row>
                                    </b-col>
                                    <b-col class="px-1 py-3" md="4">
                                        <b-row>
                                            <b-col>
                                                <b-row class="campaign-element fix-height-120 mx-3 py-4 text-center">
                                                    <b-col cols="5" class="px-0">
                                                        <img src="../assets/mouse-pointer.svg"/>
                                                    </b-col>
                                                    <b-col class="px-0">
                                                        <span class="metric-value">{{ reportws.Clicks }}</span>
                                                        <br />
                                                        <span class="metric-label">Clics</span>
                                                    </b-col>
                                                </b-row>
                                            </b-col>
                                        </b-row>
                                    </b-col>
                                    <b-col class="px-1 py-3" md="4">
                                        <b-row>
                                            <b-col>
                                                <b-row class="campaign-element fix-height-120 mx-3 py-4 text-center">
                                                    <b-col cols="5" class="px-0">
                                                        <img src="../assets/active-pointer.svg"/>
                                                    </b-col>
                                                    <b-col class="px-0">
                                                        <span class="metric-value">{{ parseInt(reportws.CTR||0) }}%</span>
                                                        <br />
                                                        <span class="metric-label">Taux de clics</span>
                                                        <i class="fas fa-info picto-info" v-b-tooltip.hover title="Rapport exprimé en pourcentage entre le nombre de clics et le nombre d’impressions."></i>
                                                    </b-col>
                                                </b-row>
                                            </b-col>
                                        </b-row>
                                    </b-col>
                                </b-row>
                            </b-col>
                        </b-row>
                        <b-row class="statistiques-container pb-2">
                            <b-col>
                                <b-row class="px-3">
                                    <b-col class="px-1 py-3" md="7">
                                        <b-row>
                                            <b-col>
                                                <b-row class="campaign-element mx-3 py-4">
                                                    <b-col cols="12" class="pb-3 text-center metric-title">
                                                        Top 10 des mots-clés les plus cliqués
                                                    </b-col>
                                                    <b-col cols="12">
                                                        <b-table
                                                            hover borderless small
                                                            head-variant="light"
                                                            table-variant="light"
                                                            table-class="top-keywords-table"
                                                            :items="topKeywords"
                                                            :fields="topKeywordsFields"
                                                        ></b-table>
                                                    </b-col>
                                                </b-row>
                                            </b-col>
                                        </b-row>
                                    </b-col>
                                    <b-col class="px-1 py-3" md="5">
                                        <b-row>
                                            <b-col>
                                                <b-row class="campaign-element mx-3 py-4 text-center">
                                                    <b-col cols="12" class="pb-3 text-center metric-title">
                                                        Répartition par matériel (nb de clics)
                                                    </b-col>
                                                    <b-col cols="12" class="px-0">
                                                        <DoughnutChart
                                                            v-if="performancesByDeviceValues.length"
                                                            :datas="performancesByDeviceValues"
                                                            :labels="performancesByDeviceLabels"
                                                            :colors="performancesByDeviceColors"
                                                            :styles="performancesByDeviceStyles"
                                                        />
                                                        <div align-v="center" class="total-device-clicks-container" v-b-tooltip.hover title="Nombre total de clicks">
                                                            {{ totalDeviceClicks }}
                                                        </div>
                                                    </b-col>
                                                </b-row>
                                            </b-col>
                                        </b-row>
                                    </b-col>
                                </b-row>
                            </b-col>
                        </b-row>
                        <b-row class="statistiques-container pb-2">
                            <b-col>
                                <b-row class="px-3">
                                    <b-col class="px-1 py-3">
                                        <b-row>
                                            <b-col>
                                                <b-row class="campaign-element mx-3 py-4">
                                                    <b-col cols="12" class="pb-3 text-center metric-title">
                                                        Clics sur la période du {{ dateRangeData.startDate|date }} au {{ dateRangeData.endDate|date }} (par {{ linearChartPeriod }})
                                                    </b-col>
                                                    <b-col cols="12">
                                                        <LinearChart
                                                            v-if="linearChartDatas.length"
                                                            :datas="linearChartDatas.map(data => data.clicks)"
                                                            :labels="linearChartDatas.map(item => item.day || item.month)"
                                                            elementLabel="Nombre de clics"
                                                            :styles="linearChartStyles"
                                                        />
                                                    </b-col>
                                                </b-row>
                                            </b-col>
                                        </b-row>
                                    </b-col>
                                </b-row>
                            </b-col>
                        </b-row>
                    </b-container>
                </b-col>
            </b-row>
        </b-container>
        <app-footer class="footer-auth"></app-footer>
    </div>
</template>

<script>

import axios from 'axios';
import FadeLoader from 'vue-spinner/src/FadeLoader.vue';
import Site from '@/components/Site.vue';
import { adplorerService } from "@/_services";
import { store } from '@/_store';
import { mapActions, mapState } from "vuex";
import { readyState } from "@/_helpers";
import PerformanceHeader from './PerformanceHeader';
import {dateHelpers} from "../_helpers";
import DoughnutChart from './Charts/DoughnutChart';
import LinearChart from './Charts/LinearChart';
import moment from "moment";

require('../assets/style/campagne.css');

export default {
    name: 'Campagne',
    components: {
        FadeLoader,
        PerformanceHeader,
        DoughnutChart,
        LinearChart,
    },
    mounted: function () {
        this.pageLoading = true;
        let now = new Date();
        this.dateRange = {
            startDate: new Date().setMonth(now.getMonth() - 1),
            endDate: now,
        };
        readyState.getSalesforceState()
            .then(() => this.loadAdwordsData())
            .then(() => this.getUberallListings())
            .finally(() => this.pageLoading = false);
    },
    computed: {
        ...mapState('account', ['currentPartner']),
        ...mapState('globalStore', ['salesforce']),
        dateRange: {
            get() {
                return this.dateRangeData;
            },
            set(value) {
                this.dateRangeData = value;
            }
        },
        performancesByDeviceStyles() {
            return {
                width: '100%',
                height: '390px',
                padding: '0',
            };
        },
        linearChartPeriod() {
            const {endDate, startDate} = this.dateRangeData || {};
            if (!endDate || !startDate) {
                return 'jour';
            }

            const dayDiff = parseInt((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));

            return dayDiff > 183 ? 'mois' : 'jour';
        }
    },
    filters: {
        date: val => val ? moment(val).format('DD/MM/YYYY') : '',
    },
    data() {
        return {
            isAdplorerCustomer: true,
            reportws: {},
            topKeywords: [],
            topKeywordsFields: [
                {
                    key: 'Termes de recherche',
                    tdClass: () => 'text-left',
                    thClass: 'py-2',
                },
                {
                    key: 'Impressions',
                    thClass: 'py-2',
                },
                {
                    key: 'Clics',
                    thClass: 'py-2',
                },
            ],
            availableDevices: {
                Desktop: 'Ordinateurs',
                Mobile: 'Smartphones',
                Tablet: 'Tablettes',
            },
            availableColorsByDevice: {
                Desktop: '#ec008c',
                Mobile: '#faa61a',
                Tablet: '#bcbdc0',
            },
            firstDate: new Date(),
            secondDate: new Date(),
            demoType: 'Visibilité',
            time1: 'Matin',
            time2: 'Matin',
            error: false,
            pageLoading: true,
            color: '#ec008c',
            performancesByDeviceValues: [],
            performancesByDeviceLabels: [],
            performancesByDeviceColors: [],
            totalDeviceClicks: 0,
            dateRangeData: {},
            linearChartDatas: [],
            linearChartStyles: {
                width: '100%'
            }
        };
    },
    methods: {
        ...mapActions('globalStore', ['getUberallListings']),
        open_modal() {
            this.$modal.show('demo-campaign');
        },
        close_modal() {
            this.$modal.hide('demo-campaign');
        },
        send_demo() {
            let agency = Site.methods.make_agency_email(localStorage.getItem('agenceName'));
            let firstDate = this.firstDate.getMonth() + 1 + '/' + this.firstDate.getDate() + '/' + this.firstDate.getFullYear() + ' ' + this.time1;
            let secondDate = this.secondDate.getMonth() + 1 + '/' + this.secondDate.getDate() + '/' + this.secondDate.getFullYear() + ' ' + this.time2;
            if (firstDate === secondDate) {
                this.error = true;
            } else {
                this.error = false;
                axios.post(
                    process.env.LOCALETMOI_BASE_URL + '/api/mandrill/demo',
                    {
                        agency: agency,
                        sageCode: localStorage.getItem('sageCode'),
                        fromEmail: localStorage.getItem('login'),
                        firstDate: firstDate,
                        secondDate: secondDate,
                        demoType: this.demoType
                    },
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                ).then(response => {
                    this.$modal.hide('demo-campaign');
                    store.dispatch('alert/success', {
                        group: 'campaign-notify',
                        title: 'Merci !',
                        type: 'success',
                        duration: 10000,
                        text: 'Votre demande de démo a bien été envoyée !'
                    });
                }).catch(error => {
                    console.warn('error ' + error);
                });
            }
        },
        onDatePeriodChange(dateRange) {
            this.loadAdwordsData(
                dateHelpers.toISODate(dateRange.startDate),
                dateHelpers.toISODate(dateRange.endDate)
            );
        },
        loadAdwordsData(startDate, endDate) {
            this.performancesByDeviceValues = [];
            this.performancesByDeviceLabels = [];
            this.linearChartDatas = [];

            return adplorerService
                .getAdwordsData(
                    this.currentPartner.customerCode,
                    this.salesforce.account.Agence__c,
                    startDate || dateHelpers.toISODate(this.dateRangeData.startDate),
                    endDate || dateHelpers.toISODate(this.dateRangeData.endDate)
                ).then(response => {
                    if (response && response.isAdplorerCustomer) {
                        this.reportws = response;
                        this.topKeywords = (response.TopKeywords || []).map(item => {
                            return {
                                'Termes de recherche': item.KeywordText,
                                'Impressions': item.Impressions,
                                'Clics': item.Clicks,
                            };
                        });
                        const performancesByDevice = (response || {}).PerformanceDataByEndDevice || [];
                        performancesByDevice.forEach(item => {
                            this.performancesByDeviceValues.push(item.Clicks);
                            this.performancesByDeviceLabels.push(this.availableDevices[item.Device]);
                            this.performancesByDeviceColors.push(this.availableColorsByDevice[item.Device]);
                            this.totalDeviceClicks += parseInt(item.Clicks);
                        });
                        this.linearChartDatas = response.ClicksByDay.map(data => ({
                            month: data.Month ? dateHelpers.fromMonthNumberToLabel(data.Month - 1) : data.Month,
                            day: data.Date ? moment(data.Date).format('DD-MM-YY') : null,
                            clicks: data.Clicks
                        }));
                    } else {
                        store.dispatch('alert/warn', {
                            group: 'campaign-notify',
                            title: 'Campagne Google Ads',
                            type: 'warn',
                            duration: 10000,
                            text: "Aucune donnée sur votre campagne Google Ads."
                        });
                    }
                })
                .catch((error) => {
                    console.warn(error);
                    store.dispatch('alert/error', {
                        group: 'campaign-notify',
                        title: 'Campagne Google Ads',
                        type: 'error',
                        duration: 5000,
                        text: "Service indisponible."
                    });
                });
        },
    }
};
</script>
