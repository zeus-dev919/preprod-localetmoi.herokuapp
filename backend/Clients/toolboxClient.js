'use strict';

const express = require('express');
const config = require('../config');
const CryptoJS = require('crypto-js');

var toolboxClientRouter = express.Router();

toolboxClientRouter.get('/autologin', function (req, res) {
    const timestamp = parseInt((new Date()).getTime() / 1000);
    const token = `client_id=${req.query.customerCode}&timestamp=${timestamp}`;
    const secret = CryptoJS.enc.Utf8.parse(config.toolbox.secret);
    const iv = CryptoJS.enc.Hex.parse(config.toolbox.iv);
    const auth = CryptoJS.enc.Hex.stringify(
        CryptoJS.AES.encrypt(token, secret, { iv }).ciphertext
    );

    res.send(auth ? `${config.toolbox.autologinBaseUrl}?auth=${auth}` : config.toolbox.url);
});

module.exports = toolboxClientRouter;
