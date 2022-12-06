'use strict';

const axios = require('axios');
const ClientOAuth2 = require('client-oauth2');
const express = require('express');
const config = require('../config');
const emailUtils = require('../utils/email');

var localfrApiClientRouter = express.Router();

var localfrApiAuthProvider = new ClientOAuth2({
    clientId: config.localfr.api.oauth2.clientId,
    clientSecret: config.localfr.api.oauth2.clientSecret,
    accessTokenUri: config.localfr.api.baseUrl + config.localfr.api.oauth2.tokenUri
});

var apiToken = null;
const tokenCheckInterval = 5; // in minutes
var expireRefreshToken = null;
var currentRefreshTime = null;

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
    console.log(`localfrApi access_token expires in ${ttl} seconds, looks good. Next check in ${tokenCheckInterval} minutes.`);
}

setApiToken();

setInterval(() => {
    refreshApiToken();
}, tokenCheckInterval * 60 * 1000);

localfrApiClientRouter.post('/generate-user-token', function (req, res) {
    let data = req.body;

    localfrApiAuthProvider.owner.getToken(data.username, data.password).then(
        user => {
            res.send(user.data);
        },
        error => {
            res.status(401).send(error);
        }
    );
});

localfrApiClientRouter.post('/refresh-user-token', function (req, res) {
    const data = req.body;
    const userToken = localfrApiAuthProvider.createToken(data.user.access_token, data.user.refresh_token, data.user.token_type);
    if (userToken) {
        userToken.refresh().then(response => {
            currentRefreshTime = new Date();
            expireRefreshToken = response.expires;
            res.send({ data: response.data, expires: getTtl(response.expires).ttl });
        },
        error => {
            res.status(401).send(error);
        })
    }
});

localfrApiClientRouter.get('/users/:email', function (req, res) {
    const email = req.params.email;

    if (!emailUtils.validateEmail(email)) {
        return res.status(400).send({
            status: 400,
            statusText: 'Bad Request',
            message: 'Invalid email input.'
        });
    }

    return axios.get(
        `${config.localfr.api.baseUrl}/api${config.localfr.api.usersEndpoint}?email=${email}&active=true`,
        {
            headers: {
                'Authorization': `${apiToken.tokenType} ${apiToken.accessToken}`,
                'Content-type': 'application/ld+json'
            }
        }
    ).then(
        response => {
            const count = response.data['hydra:totalItems'];
            if (0 === count) {
                return res.status(404).send();
            }
            const results = response.data['hydra:member'];
            let user;

            if (1 === count) {
                user = results[0];
            } else {
                user = results.find(item => email === item.email);
                if (!user) {
                    return res.status(404).send(`No user found with email ${email}.`);
                }
            }

            return res.status(response.status).send({
                id: user.id,
                email: user.email
            });
        }, error => {
            return res.status(error.response.status).send(error.response.data);
        }
    );
});

localfrApiClientRouter.post('/send-reset-pwd-link', function (req, res) {
    let email = req.body.email;

    if (!email) {
        res.status(400).send('Missing email !');
        return;
    }

    return axios.get(
        `${config.localetmoi.baseUrl}/localfr-api/users/${email}`,
        {
            headers: {
                'Content-type': 'application/json'
            }
        }
    ).then(response => {
        axios.post(
            `${config.localfr.api.baseUrl}/api/emails/reset-password`,
            {
                userId: response.data.id
            },
            {
                headers: {
                    'Authorization': `${apiToken.tokenType} ${apiToken.accessToken}`,
                    'Content-type': 'application/json'
                }
            }
        ).then(response => {
            res.json(JSON.stringify(response.data));
        }, error => {
            res.status(error.response.status).json(JSON.stringify(error.response.data));
        });
    }, error => {
        res.status(error.response.status).json(error.response.data);
    });
});

module.exports = { localfrApiClientRouter, localfrApiAuthProvider };
