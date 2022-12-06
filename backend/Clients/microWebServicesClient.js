'use strict';

const axios = require('axios');
const express = require('express');
const config = require('../config');
const { localfrApiAuthProvider } = require('./localfrApiClient');

var MicroWebServicesClientRouter = express.Router();
var apiToken = null;

function setApiToken() {
    localfrApiAuthProvider.credentials.getToken().then(
        token => {
            console.log('localfrApi access_token successfully negociated.');
            apiToken = token;
            return token;
        }, error => {
            console.error(error);
        }
    );
}

function getTtl(date, tokenType = null) {
    return {
        ttl: Math.floor((Date.parse(date) - Date.now()) / 1000),
        tokenType: tokenType
    };
}

function refreshApiToken() {
    if (!apiToken || !apiToken.accessToken) {
        return setApiToken();
    }
    const ttl = Math.floor((Date.parse(apiToken.expires) - Date.now()) / 1000);
    if (ttl < 600) {
        console.warn(`localfrApi access_token expires in ${ttl} seconds, refresh needed...`);
        return setApiToken();
    }
    console.log(`localfrApi access_token expires in ${ttl} seconds, looks good. Next check in 5 minutes.`);
}

setApiToken();

setInterval(() => {
    refreshApiToken();
}, 5 * 60 * 1000);

MicroWebServicesClientRouter.post('/uberall/autologin', function (req, res) {
    return axios.post(
        `${config.microwebservice.baseUrl}/uberall/autologin`,
        JSON.stringify(req.body),
        {
            headers: {
                'Authorization': `${apiToken.tokenType} ${apiToken.accessToken}`,
                'Content-type': 'application/ld+json'
            }
        }
    ).then(
        response => {
            let data = response.data;
            if (data) {
                if (data.listings && Array.isArray(data.listings)) {
                    data.listings = data.listings.filter(listing => 'active' === (listing.status || '').toLowerCase())
                } else {
                    data.listings = [];
                }
            }
            return res.status(response.status).send(data);
        }, error => {
            return res.status(error.response.status).send(error.response.data);
        }
    );
});

module.exports = MicroWebServicesClientRouter;
