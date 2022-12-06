'use strict';

const express = require('express');
const axios = require('axios');
const config = require('../config');
const moment = require('moment');
const atInternetHelper = require('../helpers/atInternetClient.helper');

const atInternetClientRouter = express.Router();

atInternetClientRouter.post('/visits', function (req, res) {
    let { atInternetId, startDate, endDate, evo, customerCode } = handleBodyInformation(req.body);
    let calls = [];

    const periodBeforeMigration = getPeriodBeforeMigration(startDate, endDate);
    if (periodBeforeMigration && atInternetId) {
        const params = atInternetHelper.formatQueryParamsV2({
            'columns': '{m_visits,m_page_views,m_page_views_per_visits,m_time_spent_per_visits}',
            'sort': '{-m_visits}',
            'space': `{s:${atInternetId}}`,
            'period': `{D:{start:'${periodBeforeMigration.startDate}',end:'${periodBeforeMigration.endDate}'}}`,
            'max-results': 20,
            'evo': `{${evo}}`,
            'page-num': 1,
        });
        const url1 = `${config.atinternet.api.baseUrl}/${config.atinternet.api.version}/${config.atinternet.api.format}/getData?${params}`;
        calls.push(axios.get(url1, getConfigHeaders(config.atinternet.api.credentials)).then(response => {
            let dataFeeds = response.data.DataFeed;
            if (!dataFeeds || !dataFeeds.length
                || !dataFeeds[0].Rows || !dataFeeds[0].Rows.length
            ) {
                return {};
            }

            let dataToSend = dataFeeds[0].Rows[0].Rows;
            if (undefined !== dataToSend.m_visits) {
                dataToSend.visits = dataToSend.m_visits;
            }
            if (undefined !== dataToSend.m_page_views) {
                dataToSend.page_views = dataToSend.m_page_views;
            }
            if (undefined !== dataToSend.m_page_views_per_visits) {
                dataToSend.page_views_per_visits = dataToSend.m_page_views_per_visits;
            }
            if (undefined !== dataToSend.m_time_spent_per_visits) {
                dataToSend.time_spent_per_visits = dataToSend.m_time_spent_per_visits;
            }

            dataToSend.Rows = dataToSend.Rows.map(row => ({
                date: row.d_time_date,
                visits: row.m_visits,
                page_views: row.m_page_views,
                page_views_per_visits: row.m_page_views_per_visits,
                time_spent_per_visits: row.m_time_spent_per_visits,
                evo_day: 'D' === evo ? row.evo_day : undefined,
                time_month: 'M' === evo ? row.d_time_month : undefined,
                time_year: 'M' === evo ? row.d_time_year : undefined,
            }));

            return dataToSend;
        }));
    }

    const periodAfterMigration = getPeriodAfterMigration(startDate, endDate);
    if (periodAfterMigration) {
        const params = atInternetHelper.formatQueryParamsV3({
            'columns': ['customer_code', "customer_code.uid", 'm_visits', 'm_page_loads', 'm_page_loads_per_visit', 'm_time_spent_per_visits'],
            'space': {
                's': [
                    Number(config.atinternet.api2.siteId)
                ]
            },
            'period': {
                'p1': [{
                    'type': 'D',
                    'start': periodAfterMigration.startDate,
                    'end': periodAfterMigration.endDate,
                }]
            },
            'evo': {
                'granularity': evo,
                'top': {
                    'page-num': 1,
                    'max-results': 5,
                    'sort': ['m_visits'],
                    'filter': {
                        'property': {
                            'customer_code': {
                                '$eq': customerCode
                            }
                        }
                    }
                }
            },
            'options': {
                'ignore_null_properties': true,
                'eco_mode': true
            }
        });
        const url2 = `${config.atinternet.api2.baseUrl}/getData?param=${params}`;
        calls.push(axios.get(url2, getConfigHeaders(config.atinternet.api2.credentials)).then(response => {
            let dataFeed = response.data.DataFeed;
            if (!dataFeed || !dataFeed.Rows
                || !dataFeed.Rows.length
                || !dataFeed.Rows[0].Rows
                || !dataFeed.Rows[0].Rows.Rows
                || !dataFeed.Rows[0].Rows.Rows.length) {
                return {};
            }

            dataFeed.Rows = dataFeed.Rows[0].Rows.Rows.map((row) => ({
                date: 'D' === evo ? row.d_evo_day : undefined,
                evo_day: 'D' === evo ? row.d_evo_day : undefined,
                time_month: 'M' === evo ? moment(row.d_evo_month).month()+1 : undefined,
                time_year: 'M' === evo ? moment(row.d_evo_month).year() : undefined,
                visits: row.m_visits,
                page_views: row.m_page_loads,
                page_views_per_visits: row.m_page_loads_per_visit,
                time_spent_per_visits: row.m_time_spent_per_visits / 1000,
            }));

            return dataFeed;
        }))
    }

    Promise.all(calls).then(responses => {
        const offsets = [
            'visits',
            'page_views',
            'page_views_per_visits',
            'time_spent_per_visits',
        ];
        const dataToSend = {};
        responses.forEach(response => {
            offsets.forEach(offset => {
                if (undefined !== response[offset]) {
                    if (undefined === dataToSend[offset]) {
                        dataToSend[offset] = 0;
                    }
                    dataToSend[offset] += Number(response[offset]);
                }
            });

            dataToSend.Rows = [
                ...(dataToSend.Rows || []),
                ...(response.Rows || []),
            ]
        });

        dataToSend.visits = 0;
        dataToSend.page_views = 0;
        dataToSend.page_views_per_visits = 0;
        dataToSend.time_spent_per_visits = 0;
        let rows = [];
        dataToSend.Rows.forEach(row => {
            if ('M' !== evo) {
                rows.push(row);
            } else {
                let index = rows.findIndex(item => item.time_month === row.time_month && item.time_year === row.time_year);
                if (index < 0) {
                    rows.push(row);
                } else {
                    rows[index].visits += Number(row.visits);
                    rows[index].page_views += Number(row.page_views);
                    rows[index].page_views_per_visits += Number(row.page_views_per_visits);
                    rows[index].time_spent_per_visits += Number(row.time_spent_per_visits);
                }
            }
            dataToSend.visits += Number(row.visits);
            dataToSend.page_views += Number(row.page_views);
            dataToSend.page_views_per_visits += Number(row.page_views_per_visits);
            dataToSend.time_spent_per_visits += Number(row.time_spent_per_visits);
        });
        dataToSend.Rows = rows;
        dataToSend.page_views_per_visits = Number(dataToSend.page_views_per_visits)/dataToSend.Rows.length;
        dataToSend.time_spent_per_visits = Number(dataToSend.time_spent_per_visits)/dataToSend.Rows.length;

        res.json(dataToSend);
    }).catch(error => {
        if (error.response) {
            res.status(500).json(error.response.data || error.response);
        } else {
            res.status(500).json(error.data || error);
        }
    });
});

atInternetClientRouter.post('/source', function (req, res) {
    const { atInternetId, startDate, endDate, evo, customerCode } = handleBodyInformation(req.body);
    let calls = [];

    const periodBeforeMigration = getPeriodBeforeMigration(startDate, endDate);
    if (periodBeforeMigration && atInternetId) {
        const params = atInternetHelper.formatQueryParamsV2({
            'columns': '{d_source,m_visits,d_source.uid}',
            'sort': '{-m_visits}',
            'space': `{s:${atInternetId}}`,
            'period': `{D:{start:'${periodBeforeMigration.startDate}',end:'${periodBeforeMigration.endDate}'}}`,
            'max-results': 20,
            'evo': `{${evo}}`,
            'lng': 'fr',
            'page-num': 1,
        });
        const url1 = `${config.atinternet.api.baseUrl}/${config.atinternet.api.version}/${config.atinternet.api.format}/getData?${params}`;
        calls.push(axios.get(url1, getConfigHeaders(config.atinternet.api.credentials)).then(response => {
            let dataFeeds = response.data.DataFeed;
            if (!dataFeeds || !dataFeeds.length
                || !dataFeeds[0].Rows || !dataFeeds[0].Rows.length
            ) {
                return null;
            }

            let datatToSend = {};
            dataFeeds[0].Rows.forEach(rowData => {
                const source = translate(rowData.Rows.d_source);
                datatToSend[source] = {
                    Rows: rowData.Rows.Rows.map(row => ({
                        date: row.d_time_date,
                        visits: row.m_visits,
                    })),
                    source,
                    visits: rowData.Rows.m_visits,
                };
            });

            return datatToSend;
        }));
    }

    const periodAfterMigration = getPeriodAfterMigration(startDate, endDate);
    if (periodAfterMigration) {
        const params = atInternetHelper.formatQueryParamsV3({
            'columns': ['date', 'src', 'm_visits', 'src.uid'],
            'sort': ['-m_visits'],
            'filter': {
                'property': {
                    'customer_code': {
                        '$eq': customerCode
                    }
                }
            },
            'space': {
                's': [
                    Number(config.atinternet.api2.siteId)
                ]
            },
            'period': {
                'p1': [{
                    'type': 'D',
                    'start': periodAfterMigration.startDate,
                    'end': periodAfterMigration.endDate
                }]
            },
            'max-results': 50,
            'page-num': 1,
            'options': {
                'ignore_null_properties': true
            }
        })
        const url2 = `${config.atinternet.api2.baseUrl}/getData?param=${params}`;
        calls.push(axios.get(url2, getConfigHeaders(config.atinternet.api2.credentials)).then(response => {
            let dataFeeds = response.data.DataFeed;
            if (!dataFeeds || !dataFeeds.Rows || !dataFeeds.Rows.length) {
                return {};
            }

            let dataToSend = {};
            dataFeeds.Rows.forEach(row => {
                const source = translate(row.src);
                if (undefined === dataToSend[source]) {
                    dataToSend[source] = {
                        source,
                        visits: 0,
                    };
                }
                if (undefined === dataToSend[source].Rows) {
                    dataToSend[source].Rows = [];
                }
                dataToSend[source].Rows.push({
                    date: row.date,
                    visits: Number(row.m_visits || 0),
                });
                dataToSend[source].visits += Number(row.m_visits);
            });

            return dataToSend;
        }))
    }

    Promise.all(calls)
        .then(responses => {
            const dataToSend = {};
            responses.forEach(response => {
                if (!response) {
                    return;
                }

                Object.keys(response).forEach(source => {
                    if (!dataToSend[source]) {
                        dataToSend[source] = {};
                    }
                    dataToSend[source] = {
                        Rows: [
                            ...(dataToSend[source].Rows || []),
                            ...(response[source].Rows || []),
                        ],
                        source,
                        visits: (dataToSend[source].visits || 0) + response[source].visits
                    };
                });
            });

            res.json(dataToSend);
        })
        .catch(error => {
            if (error.response) {
                res.status(500).json(error.response.data || error.response);
            } else {
                res.status(500).json(error.data || error);
            }
        });
});

function getPeriodBeforeMigration(_startDate, _endDate) {
    const migrationDate = new Date(config.atinternet.migrationDate + ' 00:00:00');
    const startDate = new Date(_startDate + ' 00:00:00');
    const endDate = new Date(_endDate + ' 23:59:59');

    switch (true) {
        case endDate < migrationDate:
            return {
                startDate: _startDate,
                endDate: _endDate
            }
        case startDate >= migrationDate:
            return null;
    }

    return {
        startDate: _startDate,
        endDate: moment(migrationDate.setSeconds(-1)).format('YYYY-MM-DD')
    }
}

function getPeriodAfterMigration(_startDate, _endDate) {
    const migrationDate = new Date(config.atinternet.migrationDate + ' 00:00:00');
    const startDate = new Date(_startDate + ' 00:00:00');
    const endDate = new Date(_endDate + ' 23:59:59');

    switch (true) {
        case endDate <= migrationDate:
            return null;
        case startDate >= migrationDate:
            return {
                startDate: _startDate,
                endDate: _endDate
            }
    }

    return {
        startDate: config.atinternet.migrationDate,
        endDate: _endDate
    }
}

function handleBodyInformation(body) {
    const { atInternetId, customerCode, dateRange } = body;
    const duration = moment.duration(moment(dateRange.endDate).diff(moment(dateRange.startDate)));
    const evo = duration.asDays() <= 31 ? 'D' : 'M';
    const endDate = moment().format('L') === moment(dateRange.endDate).format('L') ? moment(dateRange.endDate).subtract(1, 'd').format('YYYY-MM-DD') : dateRange.endDate;
    return { atInternetId, customerCode, startDate: dateRange.startDate, endDate, evo };
}

function translate(txt) {
    return ({
        'Search engines': 'Moteurs',
        'Referrer sites': 'Sites affluents',
        'Direct traffic': 'Accès Direct',
        'Social media': 'Réseaux sociaux',
        'Webmails': 'Courriel',
    })[txt] || txt;
}

function getConfigHeaders(credentials) {
    return {
        auth: {
            username: credentials.username,
            password: credentials.password
        }
    };
}

module.exports = atInternetClientRouter;
