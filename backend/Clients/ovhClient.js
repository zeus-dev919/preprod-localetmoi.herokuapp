'use strict';

const axios = require('axios');
const express = require('express');
const { ovh: ovhConfiguration } = require('../config');
const { createHash } = require('crypto');

const OvhClientRouter = express.Router();

const baseHeaders = {
    'X-Ovh-Application': ovhConfiguration.applicationKey,
    'X-Ovh-Consumer': ovhConfiguration.consumerKey
};

OvhClientRouter.get('/check/:domain', function (req, res) {
    getCartId()
        .then(cart => {
            const { cartId } = cart;
            return getDomainInformation(cartId, req.params.domain || '')
                .then(response => {
                        res.status(200).send({ available: response && !!response.length && 'create' === response[0].action })
                    }
                )
                .catch(error => res.status(500).send(error));
        })
        .catch(error => res.status(500).send(error));
});

const getDomainInformation = (cartId, domain) => {
    const url = new URL(
        `/${ovhConfiguration.apiVersion}/order/cart/${cartId}/domain`,
        ovhConfiguration.url
    ).toString();

    const requestParams = {
        params: { domain },
        headers: getHeaders('get', url, domain)
    };

    return axios
        .get(url, requestParams)
        .then(response => response.data)
        .catch(err => {
                if (err.response) {
                    console.error(
                        `Ovh API /order/cart/:cartId/domain ${err.response.status} ${err.response.statusText}`,
                        err.response.data
                    );
                }
                return err;
            }
        );
}

const getCartId = () => {
    const url = new URL(
        `/${ovhConfiguration.apiVersion}/order/cart`,
        ovhConfiguration.url
    ).toString();

    const params = { ovhSubsidiary: 'FR' };
    const headers = getHeaders('post', url, params);

    return axios
        .post(url, params, { headers })
        .then(response => response.data)
        .catch(err => {
            if (err.response) {
                console.error(
                    `Ovh API /order/cart ${err.response.status} ${err.response.statusText}`,
                    err.response.data
                );
            }
            return { available: false };
        });
}

const getHeaders = (method, url, body) => {
    const currentTimestamp = Date.now();
    return {
        ...baseHeaders,
        'X-Ovh-Timestamp': currentTimestamp,
        'X-Ovh-Signature': getSignature(
            method,
            url,
            JSON.stringify(body),
            currentTimestamp
        )
    };
}

const getSignature = (method, url, body, timestamp) => {
    const params = [
        ovhConfiguration.applicationSecret,
        ovhConfiguration.consumerKey,
        method,
        url,
        body || '',
        timestamp
    ];

    return (
        '$1$' +
        createHash('sha1')
            .update(params.join('+'))
            .digest('hex')
    );
}

module.exports = OvhClientRouter;
