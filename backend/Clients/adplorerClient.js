'use strict';

const express = require('express');
const axios = require('axios');
const config = require('../config');
const convert = require("xml-js");
const adplorerHelper = require('../helpers/adplorerApiClient.helper');

let adplorerClientRouter = express.Router();

adplorerClientRouter.post('/adwords', function (req, res) {
    const data = req.body;
    if (!data || !data.customerCode) {
        res.status(500).send('Missing customer code.');
    }

    getCustomerId(data.customerCode, data.agency).then(companyId => {
        if (!companyId) {
            res.send({
                isAdplorerCustomer: false
            });
        } else {
            const agency = data.agency;
            getOrder(companyId, agency).then(orderResponse => {
                if (!orderResponse.OrderID) {
                    res.send({
                        isAdplorerCustomer: false
                    });
                } else {
                    const orderId = orderResponse.OrderID;
                    const startDate = data.startDate;
                    const endDate = data.endDate;
                    Promise.all([
                        getDataReport(companyId, orderId, startDate, endDate, agency).then(response => {
                            if (!response.data) {
                                return {};
                            }

                            let performanceDataByEndDevice = (response.data.PerformanceDataByEndDeviceDataItems || {}).PerformanceDataByEndDeviceDataItem || [];
                            if (!Array.isArray(performanceDataByEndDevice)) {
                                performanceDataByEndDevice = [ performanceDataByEndDevice ];
                            }

                            return {
                                isAdplorerCustomer: true,
                                ...parseData(response.data.PerformanceData || {}),
                                TopKeywords: ((response.data.TopKeywordsDataItems || {}).TopKeywordsDataItem || []).map(item => {
                                    return {
                                        KeywordText: item.KeywordText['_text'],
                                        ...parseData(item.PerformanceData)
                                    }
                                }).sort((a, b) => parseInt(b.Clicks) - parseInt(a.Clicks)),
                                PerformanceDataByEndDevice: performanceDataByEndDevice.map(item => {
                                    return {
                                        Device: item.Device['_text'],
                                        ...parseData(item.PerformanceData)
                                    }
                                }).sort((a, b) => parseInt(b.Clicks) - parseInt(a.Clicks)),

                            }
                        }),
                        getClicksByDayReport(companyId, orderId, startDate, endDate, agency).then(response => {
                            if (!response.data) {
                                return {};
                            }

                            const isMonthly = 'Month' === response.periodUnit;

                            return {
                                isAdplorerCustomer: true,
                                ClicksByDay: response.data
                                    .map(data => {
                                        const date = (data.Time || {})['_text'];
                                        return {
                                            Month: (date && isMonthly) ? new Date(date).getMonth() + 1 : null,
                                            Date: (date && !isMonthly) ? date : null,
                                            Clicks: (data.PerformanceData.Clicks || {})['_text']
                                        }
                                    })
                                    .filter(item => undefined !== item.Clicks && null !== item.Clicks)
                                    .sort((a, b) => (new Date(a.Date)).getTime() - (new Date(b.Date)).getTime())
                            };
                        }),
                    ]).then(reportResponse => {
                        res.json({
                            ...reportResponse[0],
                            ...reportResponse[1],
                        });
                    }, (err) => {
                        console.log(err);
                        res.status(500).send(err);
                    }).catch(err => {
                        console.log(err);
                        res.status(500).send(err);
                    });
                }
            }, (err) => {
                console.log(err);
                res.status(500).send(err);
            }).catch(err => {
                console.log(err);
                res.status(500).send(err);
            });
        }
    }, (err) => {
        console.log(err);
        res.status(500).send(err);
    }).catch(err => {
        console.log(err);
        res.status(500).send(err);
    });
});

function getHeaders() {
    return {
        headers: {
            'Content-Type': 'text/xml; charset=utf-8'
        }
    };
}

adplorerClientRouter.get('/customer/information', (req, res) => {
    const { customerCode, agency } = req.query

    getCustomerId(customerCode, agency)
        .then(companyId => {
            if (!companyId) {
                res.send({
                    isAdplorerCustomer: false
                });
            } else {
                getOrder(companyId, agency).then(orderResponse => {
                    if (!orderResponse.OrderID) {
                        res.send({
                            isAdplorerCustomer: false
                        });
                    } else {
                        res.json({
                            companyId,
                            orderId: orderResponse.OrderID
                        })
                    }
                });
            }
        });
});

function getCustomerId(customerCode, agency) {
    let xmls =
        '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cus="http://www.publocity.de/ns/Customer_1_1">' +
        '<soapenv:Header>' +
        '<cus:AuthHeader>' +
        `<cus:UserName>${config.adplorer.username}</cus:UserName>` +
        `<cus:Password>${config.adplorer.password}</cus:Password>` +
        '</cus:AuthHeader>' +
        '</soapenv:Header>' +
        '<soapenv:Body>' +
        '<cus:GetCustomersByQueryWS>' +
        '<cus:Query>' +
        '<QueryItemList>' +
        '<QueryItem>' +
        '<QueryProperty>IdAccountingClient</QueryProperty>' +
        '<QueryOperator>Equals</QueryOperator>' +
        `<Value>${customerCode}</Value>` +
        '</QueryItem>' +
        '</QueryItemList>' +
        '</cus:Query>' +
        '</cus:GetCustomersByQueryWS>' +
        '</soapenv:Body>' +
        '</soapenv:Envelope>';

    let url = adplorerHelper.formatApiUrl(config.adplorer.customerWsdl, agency);
    return axios.post(url, xmls, getHeaders()).then(response => {
        const companyId = parseCustomerResponse(response);
        if (companyId) {
            return companyId;
        }

        return axios.post(config.adplorer.customerWsdl, xmls, getHeaders()).then(response => {
            return parseCustomerResponse(response);
        });
    });
}

function parseCustomerResponse(response) {
    let result = JSON.parse(convert.xml2json(response.data, {compact: true, spaces: 4}));
    let customer = result['soap:Envelope']['soap:Body']['GetCustomersByQueryWSResponse']['GetCustomersByQueryWSResult']['CustomerList']['Customer'];

    return customer ? customer['Company']['CompanyID']['_text'] : null;
}

function getClicksByDayReport(companyId, orderId, startDate, endDate, agency) {
    return getReport(companyId, orderId, startDate, endDate, agency,
        {
            TimeAggregationLevel: getPeriodUnit(startDate, endDate),
            ChannelFilter: 1
        }, {
            IncludeOnlyActiveAdgroups: 0,
            IncludeOnlyActiveCampaigns: 0,
            SkipImageAds: 0,
            SkipShoppingAds: 1,
            NoPerformanceData: 0,
            NoDeviceData: 1,
            NoLocationData: 1,
            ShowImpressionShare: 0,
            OnlyActiveAds: 0,
            ShowBudgetSettings: 0,
        }
    );
}

function getDataReport(companyId, orderId, startDate, endDate, agency) {
    return getReport(companyId, orderId, startDate, endDate, agency,
        {
            TimeAggregationLevel: 'NoAggregationByTime',
            ChannelFilter: 1
        }, {
            IncludeOnlyActiveAdgroups: 1,
            IncludeOnlyActiveCampaigns: 0,
            SkipImageAds: 0,
            SkipShoppingAds: 0,
            NoPerformanceData: 0,
            NoDeviceData: 0,
            NoLocationData: 1,
            ShowImpressionShare: 0,
            OnlyActiveAds: 1,
            ShowBudgetSettings: 0,
        }
    );
}

function getReport(companyId, orderId, startDate, endDate, agency, requestParams, generalOptions) {
    const options = generalOptions
        ? '<GeneralOptions>' + adplorerHelper.jsonToXml(generalOptions) + '</GeneralOptions>'
        : '';
    let xmls =
        '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:rep="http://www.publocity.de/ns/Report_1_2">' +
        '<soap:Header>' +
        '<rep:AuthHeader>' +
        `<rep:UserName>${config.adplorer.username}</rep:UserName>` +
        `<rep:Password>${config.adplorer.password}</rep:Password>` +
        '</rep:AuthHeader>' +
        '</soap:Header>' +
        '<soap:Body>' +
        '<rep:GetReportDataByOrderWS>' +
        '<rep:GetReportDataByOrderRequest>' +
        `<CompanyIDs><Int64>${companyId}</Int64></CompanyIDs>` +
        `<OrderIDs><Int64>${orderId}</Int64></OrderIDs>` +
        adplorerHelper.jsonToXml(requestParams) +
        `<DateFrom>${startDate}</DateFrom>` +
        `<DateTo>${endDate}</DateTo>` +
        options +
        '</rep:GetReportDataByOrderRequest>' +
        '</rep:GetReportDataByOrderWS>' +
        '</soap:Body>' +
        '</soap:Envelope>';

    let url = adplorerHelper.formatApiUrl(config.adplorer.reportWsdl, agency);
    return axios.post(url, xmls, getHeaders()).then(response => {
        let reportws = parseReportResponse(response);
        if (reportws.isAdplorerCustomer) {
            reportws.periodUnit = getPeriodUnit(startDate, endDate);
            return reportws;
        }

        return axios.post(config.adplorer.reportWsdl, xmls, getHeaders()).then(response => {
            reportws = parseReportResponse(response);
            if (reportws.isAdplorerCustomer) {
                reportws.periodUnit = getPeriodUnit(startDate, endDate);
                return reportws;
            }

            return {};
        });
    });
}

function parseReportResponse(response) {
    const result = JSON.parse(convert.xml2json(response.data, {compact: true, spaces: 4}));
    const data = result['soap:Envelope']['soap:Body']['GetReportDataByOrderWSResponse']['GetReportDataByOrderWSResult']['DataItems']['DataItem'];
    return {
        isAdplorerCustomer: !!data,
        data,
    };
}

function getOrder(companyId, agency) {
    let xmls =
        '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
        '<soap:Header>' +
        '<AuthHeader xmlns="http://www.publocity.de/ns/Order_1_1">' +
        `<UserName>${config.adplorer.username}</UserName>` +
        `<Password>${config.adplorer.password}</Password>` +
        '</AuthHeader>' +
        '</soap:Header>' +
        '<soap:Body>' +
        '<GetOrdersByQueryWS xmlns="http://www.publocity.de/ns/Order_1_1">' +
        '<Query>' +
        '<QueryItemList xmlns="">' +
        '<QueryItem>' +
        '<QueryProperty>CompanyID</QueryProperty>' +
        '<QueryOperator>Equals</QueryOperator>' +
        `<Value>${companyId}</Value>` +
        '</QueryItem>' +
        '</QueryItemList>' +
        '</Query>' +
        '</GetOrdersByQueryWS>' +
        '</soap:Body>' +
        '</soap:Envelope>';

    let url = adplorerHelper.formatApiUrl(config.adplorer.orderWsdl, agency);
    return axios.post(url, xmls, getHeaders()).then(response => {
        const orderws = parseOrderResponse(response);
        if (orderws.isAdplorerCustomer) {
            return orderws;
        }

        return axios.post(config.adplorer.orderWsdl, xmls, getHeaders()).then(response => {
            return parseOrderResponse(response);
        });
    });
}

function parseOrderResponse(response) {
    let result = JSON.parse(convert.xml2json(response.data, {compact: true, spaces: 4}));
    result = result['soap:Envelope']['soap:Body']['GetOrdersByQueryWSResponse']['GetOrdersByQueryWSResult']['OrderList']['Order'];
    let responseParsed = {
        isAdplorerCustomer: !!result
    };
    if (result) {
        if (Array.isArray(result)) {
            result = result
                .map(order => parseData(order || {}))
                .filter(order => /^active$/i.test(order.OrderStatus))[0] || {};
        } else {
            result = parseData(result || {});
        }

        responseParsed = {
            ...responseParsed,
            ...result
        };
    }

    return responseParsed;
}

function parseData(data) {
    let result = {};
    Object.keys(data).forEach(offset => {
        if (undefined !== data[offset]['_text']) {
            result[offset] = data[offset]['_text'];
        }
    });

    return result;
}

function getPeriodUnit(startDate, endDate) {
    const dayDiff = parseInt((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));

    return dayDiff > 183 ? 'Month' : 'Day';
}

module.exports = adplorerClientRouter;
