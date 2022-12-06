'use strict';

const merge = require('webpack-merge');
const prodEnv = require('./production.env');

module.exports = merge(prodEnv, {
    NODE_ENV: JSON.stringify('preproduction'),

    // Webtool Credentials
    WEBTOOL_URL: JSON.stringify('https://preprod.client-webtool.lelocal.fr/'),
    WEBTOOL3_URL: JSON.stringify(process.env.WEBTOOL3_URL),

    // OVH config
    OVH_APPLICATION_KEY: JSON.stringify('WOQ2Yr6R3ZwP5D80'),
    OVH_APPLICATION_SECRET: JSON.stringify('wkGCo1RoKQL6nMLnE1mmFKzXDVE5RH2B'),
    OVH_CONSUMER_KEY: JSON.stringify('lQDZEFGlXj5NUwqjFvxdPeqaKmNeecS0'),
    OVH_API_URL: JSON.stringify('https://eu.api.ovh.com/'),
    OVH_API_VERSION: JSON.stringify('1.0'),
    
    // MWS base_url
    MICRO_WEB_SERVICES_API_URL: JSON.stringify(process.env.MICRO_WEB_SERVICES_API_URL),
    
    // Google Analytics ID
    GOOGLE_ANALYTICS_ID: JSON.stringify('UA-132683031-1'),

    // Tutorial URL's
    STRIPE_TUTORIAL_URL: JSON.stringify(process.env.STRIPE_TUTORIAL_URL),
    VIVA_WALLET_TUTORIAL_URL: JSON.stringify(process.env.VIVA_WALLET_TUTORIAL_URL),
    BOXTAL_TUTORIAL_URL: JSON.stringify(process.env.BOXTAL_TUTORIAL_URL),

    LOCALSHOP_TRAINING_VIDEO_LINK: JSON.stringify(process.env.LOCALSHOP_TRAINING_VIDEO_LINK),
    LOCALSHOP_EXPRESS_TRAINING_VIDEO_LINK: JSON.stringify(process.env.LOCALSHOP_EXPRESS_TRAINING_VIDEO_LINK),
    LOCALBOUTIQUE_TRAINING_VIDEO_LINK: JSON.stringify(process.env.LOCALBOUTIQUE_TRAINING_VIDEO_LINK),
    LOCALBOUTIQUE_AGENDA_TRAINING_VIDEO_LINK: JSON.stringify(process.env.LOCALBOUTIQUE_AGENDA_TRAINING_VIDEO_LINK),
    DEFAULT_TRAINING_VIDEO_LINK: JSON.stringify(process.env.DEFAULT_TRAINING_VIDEO_LINK),
    
    // adplorer configuration
    ADPLORER_API_PASSWORD: JSON.stringify(process.env.ADPLORER_API_PASSWORD),
    ADPLORER_API_USERNAME: JSON.stringify(process.env.ADPLORER_API_USERNAME),
    ADPLORER_CUSTOMER_WSDL_URL: JSON.stringify(process.env.ADPLORER_CUSTOMER_WSDL_URL),
    ADPLORER_ORDER_WSDL_URL: JSON.stringify(process.env.ADPLORER_ORDER_WSDL_URL),
    ADPLORER_REPORT_WSDL_URL: JSON.stringify(process.env.ADPLORER_REPORT_WSDL_URL),
    ADPLORER_NEW_CAMPAIGN_URL: JSON.stringify(process.env.ADPLORER_NEW_CAMPAIGN_URL)
});
