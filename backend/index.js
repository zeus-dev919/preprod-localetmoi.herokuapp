const express = require('express');
const s3Client = require('./Clients/s3Client');
const atInternetClient = require('./Clients/atinternetClient');
const mandrillClient = require('./Clients/mandrillClient');
const salesforceClient = require('./Clients/salesforceClient');
const dropboxClient = require('./Clients/dropboxClient');
const toolboxClient = require('./Clients/toolboxClient');
const ovhClient = require('./Clients/ovhClient');
const adplorerClient = require('./Clients/adplorerClient');
const qrcodeClient = require('./Clients/qrcodeClient');

var apiRouter = express.Router();
apiRouter.use('/s3', s3Client);
apiRouter.use('/atinternet', atInternetClient);
apiRouter.use('/ovh', ovhClient);
apiRouter.use('/mandrill', mandrillClient);
apiRouter.use('/salesforce', salesforceClient);
apiRouter.use('/dropbox', dropboxClient);
apiRouter.use('/toolbox', toolboxClient);
apiRouter.use('/adplorer', adplorerClient);
apiRouter.use('/qrcode', qrcodeClient);

module.exports = apiRouter;
