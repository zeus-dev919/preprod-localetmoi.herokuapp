'use strict';

const authMiddleware = require('./middlewares/authentication');
const { localfrApiClientRouter: localfrApiClient } = require('./Clients/localfrApiClient');
const tedsApiClient = require('./Clients/tedsApiClient');
const microWebServiceApiClient = require('./Clients/microWebServicesClient');
const qrcodeClient = require('./Clients/qrcodeClient');

module.exports = function (app) {
    // Unprotected endpoints
    app.use('/localfr-api', localfrApiClient);
    app.use('/micro-services-api', microWebServiceApiClient);
    app.use('/teds', tedsApiClient);
    app.use('/qrcode', qrcodeClient);

    // Protected endpoints
    app.use('/api', authMiddleware);
    app.use('/api', require('./'));
};
