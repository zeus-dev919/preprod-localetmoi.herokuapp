'use strict';

module.exports = {
    NODE_ENV: JSON.stringify('production'),

    // UberAll Credentials
    UBERALL_PUBLIC_IMAGES: JSON.stringify('https://static-prod.uberall.com/assets/directory_logo/png/'),

    // Webtool Credentials
    WEBTOOL_BASE_URL: JSON.stringify(process.env.WEBTOOL_BASE_URL.replace(/\/$/, '')),
    WEBTOOL3_URL: JSON.stringify(process.env.WEBTOOL3_URL.replace(/\/$/, '')),
    WEBTOOL_TOKEN_CONNECTION: JSON.stringify(process.env.WEBTOOL_TOKEN_CONNECTION || '/oauth/token_connection'),

    LOCALFR_API_BASE_URL: JSON.stringify(process.env.LOCALFR_API_BASE_URL.replace(/\/$/, '')),
    LOCALFR_API_OAUTH2_TOKEN: JSON.stringify(process.env.LOCALFR_API_OAUTH2_TOKEN || '/oauth/v2/token'),
    LOCALFR_API_TOKEN_CHECK_AUTOLOGIN: JSON.stringify(process.env.LOCALFR_API_TOKEN_CHECK_AUTOLOGIN || '/oauth/token_check/autologin'),
    LOCALFR_API_OAUTH2_PUBLIC_KEY: JSON.stringify(process.env.LOCALFR_API_OAUTH2_PUBLIC_KEY),

    // Local&Moi Url
    LOCALETMOI_BASE_URL: JSON.stringify(process.env.LOCALETMOI_BASE_URL.replace(/\/$/, '')),
    LOCALETMOI_PUBLIC_KEY: JSON.stringify(process.env.LOCALETMOI_PUBLIC_KEY),
    LOCALETMOI_VIDEO_URL: JSON.stringify('https://www.youtube.com/embed/Zxbh6Hbfp6E'),

    // Oxatis
    OXATIS_URL: JSON.stringify('https://local.oxatis.com/login.asp'),
    UBIFLOW_URL: JSON.stringify('https://annonceur.ubiflow.net/'),

    // Dropbox
    DROPBOX_FOLDER: JSON.stringify(process.env.DROPBOX_FOLDER.replace(/\/$/, '')),
    ALLOWED_UPLOAD_EXTENSIONS: JSON.stringify(process.env.ALLOWED_UPLOAD_EXTENSIONS.replace(/\/$/, '')),

    // TOOLBOX
    TOOLBOX_URL: JSON.stringify(process.env.TOOLBOX_URL.replace(/\/$/, '')),
    TOOLBOX_API_BASE_URL: JSON.stringify(process.env.TOOLBOX_API_BASE_URL.replace(/\/$/, '')),
    TOOLBOX_AUTOLOGIN_URL: JSON.stringify(process.env.TOOLBOX_AUTOLOGIN_URL.replace(/\/$/, '')),
    TOOLBOX_API_SECRET_KEY: JSON.stringify(process.env.TOOLBOX_API_SECRET_KEY.replace(/\/$/, '')),
    TOOLBOX_API_IV: JSON.stringify(process.env.TOOLBOX_API_IV.replace(/\/$/, '')),

    // Salesforce Brief Events recordIds
    SALESFORCE_BRIEF_EVENT_RECORD_TYPE_ID: JSON.stringify(process.env.SALESFORCE_BRIEF_EVENT_RECORD_TYPE_ID),
    SALESFORCE_CLICK_COLLECT_BRIEF_EVENT_RECORD_TYPE_ID: JSON.stringify(process.env.SALESFORCE_CLICK_COLLECT_BRIEF_EVENT_RECORD_TYPE_ID),

    // Google Analytics ID
    GOOGLE_ANALYTICS_ID: JSON.stringify('UA-132683031-1'),

    // Registrar
    REGISTRAR_URL: JSON.stringify(process.env.REGISTRAR_URL),

    // micro web service base url
    MICRO_WEB_SERVICES_API_URL: JSON.stringify(process.env.MICRO_WEB_SERVICES_API_URL),

    // OVH config
    OVH_APPLICATION_KEY: JSON.stringify('WOQ2Yr6R3ZwP5D80'),
    OVH_APPLICATION_SECRET: JSON.stringify('wkGCo1RoKQL6nMLnE1mmFKzXDVE5RH2B'),
    OVH_CONSUMER_KEY: JSON.stringify('lQDZEFGlXj5NUwqjFvxdPeqaKmNeecS0'),
    OVH_API_URL: JSON.stringify('https://eu.api.ovh.com/'),
    OVH_API_VERSION: JSON.stringify('1.0'),

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
};
