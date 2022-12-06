'use strict';

const merge = require('webpack-merge');
const prodEnv = require('./production.env');

module.exports = merge(prodEnv, {
    NODE_ENV: '"test"',

    // Webtool Credentials
    WEBTOOL_URL: '"https://preprod.client-webtool.lelocal.fr/"',
    API_URL_OAUTH: '"https://localfr-api.herokuapp.com/"',

    // Local&Moi Url
    LOCAL_MOI_URL: '"https://preprod-localetmoi.herokuapp.com/"',
});
