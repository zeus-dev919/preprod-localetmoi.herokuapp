'use strict';

const express = require('express');
const FormData = require('form-data');
const axios = require('axios');
const { urlFormatter } = require('../helpers/tedsApiClient.helper');

const config = require('../config');
const emailUtils = require('../utils/email');
const CryptoJS = require('crypto-js');

var tedsApiClientRouter = express.Router();
const authorizationUri = `${process.env.LOCALETMOI_BASE_URL}/teds/authorize/callback`;
const {
    apiBaseUrl,
    url: tedsUrl,
    tedsPrefixUrl,
    clientId,
    clientSecret,
    scope,
    apiTokenEndpoint,
    state
} = config.teds;

/**
 * Send the token informations and autologin url
 * @param res
 * @param response
 * @param customerCode
 * @param url
 */
function sendAutologinData(res, response, customerCode, url) {
    const formattedUrl = `${tedsPrefixUrl}.${urlFormatter(url)}`;
    res.send({
        token: response,
        link: `${formattedUrl}/user/autologin/${customerCode}?${response.token_type.toLowerCase()}=${response.access_token}`
    })
}

/**
 * Post function to ask a new token or a refresh token
 * @param res
 * @param data
 * @param customerCode
 * @param url
 */
function retrieveOrRefreshToken(res, data, customerCode, url) {
    const config = {
        method: 'post',
        url: `${tedsUrl}/${apiTokenEndpoint}`,
        headers: {
            ...data.getHeaders()
        },
        data : data
    };

    axios(config)
        .then(response => {
            if (response.data) {
                sendAutologinData(res, response.data, customerCode, url);
            } else {
                res.send(null);
            }
        })
        .catch(error => {
            console.log(error.error);
            return res.status(500).send(error);
        });

}

tedsApiClientRouter.get('/authorization',  (req, res) => {
    const {customerCode, email, url} = req.query
    const apiUrl = `${tedsUrl}/${apiBaseUrl}`;

    if (!emailUtils.validateEmail(email) || !customerCode) {
        return res.status(400).send({
            status: 400,
            statusText: 'Bad Request',
            message: 'Invalid email input or customer code'
        });
    }

    const userData = JSON.stringify({
        customerCode,
        email,
        state,
        url
    });

    const parsedData = CryptoJS.enc.Utf8.parse(userData);
    const hashedData = CryptoJS.enc.Base64.stringify(parsedData);

    axios.get(apiUrl, {
        params: {
            'grant_type': 'code',
            'client_id': clientId,
            'response_type': 'code',
            'scope': scope,
            'redirect_uri': authorizationUri,
            'custom_identifier': customerCode,
            'user_email': email,
            'state': hashedData
        }
    }).then(
        response => {
            if (response.data) {
                if (response.data.error) {
                    res.status(response.data.error.status).send(response.data.error);
                } else {
                    res.send(response.data);
                }
            }
        }
    ).catch(error => {
        res.status(500).send({
            status: error.response.status,
            statusText: error.response.statusText,
            data: error.response.data
        });
    });
});

tedsApiClientRouter.get('/authorize/callback', (req, res) => {
    const {
        code: authorizationCode,
        state: receivedState
    } = req.query;

    const parsedState = CryptoJS.enc.Base64.parse(receivedState);
    const formattedState = JSON.parse(CryptoJS.enc.Utf8.stringify(parsedState));

    const data = new FormData();

    if (!authorizationCode || state !== formattedState.state) {
        return res.json({
            error: {
                message: 'Authorization code not received, user does not exist',
                error: 'Invalid grant',
                status: 403
            }
        })
    }

    if (authorizationCode) {
        data.append('grant_type', 'authorization_code');
        data.append('client_id', clientId);
        data.append('client_secret', clientSecret);
        data.append('scope', scope);
        data.append('code', authorizationCode);
        data.append('redirect_uri', authorizationUri);
        data.append('custom_identifier', JSON.stringify(formattedState.customerCode));
        data.append('user_email', formattedState.email);

        return retrieveOrRefreshToken(res, data, formattedState.customerCode, formattedState.url);
    }
});

tedsApiClientRouter.post('/refresh-user-token',  (req, res, next) => {
    const data = new FormData();
    const body = req.body;

    if (body.refresh_token && body.customerCode) {
        data.append('grant_type', 'refresh_token');
        data.append('client_id', clientId);
        data.append('client_secret', clientSecret);
        data.append('refresh_token', body.refresh_token);

        return retrieveOrRefreshToken(res, data, body.customerCode, body.url);
    }

    return res.json({
        error: {
            error: {
                message: 'Refresh token not valid or wrong customer code',
                error: 'Bad request',
                status: 400
            }
        }
    })
});

module.exports = tedsApiClientRouter;
