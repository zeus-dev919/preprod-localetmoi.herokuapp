'use strict';

var _ = require('lodash');

// All configurations will extend these options
// ============================================
var all = {
    // LOCAL ET MOI
    localetmoi: {
        baseUrl: process.env.LOCALETMOI_BASE_URL.replace(/\/$/, ''),
        sessionTtl: process.env.SESSION_TTL || 3600,
        privateKey: process.env.LOCALETMOI_PRIVATE_KEY,
        publicKey: process.env.LOCALETMOI_PUBLIC_KEY
    },

    // Localfr-api
    localfr: {
        api: {
            baseUrl: process.env.LOCALFR_API_BASE_URL.replace(/\/$/, ''),
            tokenEndpoint: process.env.LOCALFR_API_TOKEN_ENDPOINT || '/oauth/token',
            usersEndpoint: process.env.LOCALFR_API_USERS_ENDPOINT || '/users',
            oauth2: {
                tokenUri: process.env.LOCALFR_API_OAUTH2_TOKEN_URI || '/oauth/v2/token',
                clientId: process.env.LOCALFR_API_OAUTH2_CLIENT_ID,
                clientSecret: process.env.LOCALFR_API_OAUTH2_CLIENT_SECRET,
                publicKey: process.env.LOCALFR_API_OAUTH2_PUBLIC_KEY
            }
        }
    },
    
    microwebservice: {
        baseUrl: process.env.MICRO_WEB_SERVICES_API_URL
    },

    // AT Internet
    atinternet: {
        api: {
            baseUrl: process.env.AT_INTERNET_API_BASE_URL.replace(/\/$/, ''),
            version: process.env.AT_INTERNET_API_VERSION || 'v2',
            format: process.env.AT_INTERNET_API_FORMAT || 'json',
            credentials: {
                username: process.env.AT_INTERNET_API_USERNAME,
                password: process.env.AT_INTERNET_API_PASSWORD
            }
        },
        api2: {
            baseUrl: process.env.AT_INTERNET_API2_BASE_URL.replace(/\/$/, ''),
            credentials: {
                username: process.env.AT_INTERNET_API2_USERNAME,
                password: process.env.AT_INTERNET_API2_PASSWORD,
            },
            siteId: process.env.AT_INTERNET_API2_SITE_ID,
        },
        migrationDate: process.env.AT_INTERNET_MIGRATION_DATE
    },

    // Mandrill
    mandrill: {
        baseUrl: process.env.MANDRILL_BASE_URL.replace(/\/$/, ''),
        apiKey: process.env.MANDRILL_API_KEY,
        mailFrom: process.env.MANDRILL_MAIL_FROM,
        mailReset: process.env.MANDRILL_MAIL_RESET,
        mailTo: process.env.MANDRILL_MAIL_TO,
        dropboxTo: process.env.MANDRILL_DROPBOX_TO || null,
        dropboxCc: process.env.MANDRILL_DROPBOX_CC || null,
        dropboxNotifyTo: process.env.MANDRILL_DROPBOX_NOTIFY_TO || null,
        dropboxNotifyCc: process.env.MANDRILL_DROPBOX_NOTIFY_CC || null
    },

    // Amazon
    amazon: {
        accessKeyID: process.env.AMAZON_ACCESS_KEY_ID,
        secretAccessKey: process.env.AMAZON_SECRET_ACCESS_KEY,
        s3: {
            bucket: process.env.S3_BUCKET,
            region: process.env.S3_REGION,
            folder: process.env.S3_FOLDER
        }
    },

    // Salesforce
    salesforce: {
        audience: process.env.SALESFORCE_AUDIENCE.replace(/\/$/, ''),
        tokenEndpoint: process.env.SALESFORCE_TOKEN_ENDPOINT || '/services/oauth2/token',
        clientId: process.env.SALESFORCE_CLIENT_ID,
        clientSecret: process.env.SALESFORCE_CLIENT_SECRET,
        privateKey: process.env.SALESFORCE_PRIVATE_KEY,
        username: process.env.SALESFORCE_USERNAME,
        api: {
            baseEndpoint: process.env.SALESFORCE_API_BASE_ENDPOINT || '/services/data',
            listEndpoint: process.env.SALESFORCE_API_LIST_ENDPOINT,
            recordTypeId: process.env.SALESFORCE_RECORD_TYPE_ID_LIST,
            version: process.env.SALESFORCE_API_VERSION
        },
        ownerId: process.env.SALESFORCE_OWNER_ID,
        recordTypeId: process.env.SALESFORCE_RECORD_TYPE_ID,
        event: {
            brief: {
                recordTypeId: process.env.SALESFORCE_BRIEF_EVENT_RECORD_TYPE_ID,
                clickAndCollectRecordTypeId: process.env.SALESFORCE_CLICK_COLLECT_BRIEF_EVENT_RECORD_TYPE_ID
            }
        },
        ticketCreatorId: process.env.SALESFORCE_TICKET_CREATOR_ID,
        task: {
            nddRecordTypeId: process.env.SALESFORCE_NDD_TASK_RECORD_TYPE_ID,
        }
    },

    // Webtool
    webtool: {
        baseUrl: process.env.WEBTOOL_BASE_URL.replace(/\/$/, ''),
        passwordKey: process.env.WEBTOOL_PASSWORD_KEY
    },

    // Dropbox
    dropbox: {
        api: {
            token: process.env.DROPBOX_TOKEN,
            folder: process.env.DROPBOX_FOLDER,
        }
    },

    // Toolbox
    toolbox: {
        url: process.env.TOOLBOX_URL,
        apiBaseUrl: process.env.TOOLBOX_API_BASE_URL,
        autologinBaseUrl: process.env.TOOLBOX_AUTOLOGIN_URL,
        secret: process.env.TOOLBOX_API_SECRET_KEY,
        iv: process.env.TOOLBOX_API_IV,
    },

    // Teds
    teds: {
        url: process.env.CLICK_AND_COLLECT_URL,
        tedsPrefixUrl: process.env.CLICK_AND_COLLECT_PREFIX_URL,
        apiBaseUrl: process.env.CLICK_AND_COLLECT_API_BASE_URL,
        apiTokenEndpoint: process.env.CLICK_AND_COLLECT_API_TOKEN_ENDPOINT,
        clientId: process.env.CLICK_AND_COLLECT_CLIENT_ID,
        clientSecret: process.env.CLICK_AND_COLLECT_CLIENT_SECRET,
        scope: process.env.CLICK_AND_COLLECT_SCOPE,
        state: process.env.CLICK_AND_COLLECT_STATE
    },
    
    // OVH
    ovh: {
        applicationKey: process.env.OVH_APPLICATION_KEY, 
        applicationSecret: process.env.OVH_APPLICATION_SECRET, 
        consumerKey: process.env.OVH_CONSUMER_KEY, 
        url: process.env.OVH_API_URL, 
        apiVersion: process.env.OVH_API_VERSION, 
    },

    allowedUploadExtensions: process.env.ALLOWED_UPLOAD_EXTENSIONS,

    adplorer: {
        customerWsdl: process.env.ADPLORER_CUSTOMER_WSDL_URL,
        orderWsdl: process.env.ADPLORER_ORDER_WSDL_URL,
        reportWsdl: process.env.ADPLORER_REPORT_WSDL_URL,
        username: process.env.ADPLORER_API_USERNAME,
        password: process.env.ADPLORER_API_PASSWORD,
        newCampaignUrl: process.env.ADPLORER_NEW_CAMPAIGN_URL,
    },

    qrcode: {
        createUrl: process.env.QRCODE_GENERATOR_CREATE_URL,
        token: process.env.QRCODE_GENERATOR_TOKEN,
    },
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
    all,
    require('./environment/' + process.env.NODE_ENV + '.js') || {});
