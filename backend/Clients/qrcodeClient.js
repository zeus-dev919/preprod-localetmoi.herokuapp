'use strict';

const express = require('express');
const axios = require('axios');
const config = require('../config');

var qrcodeClientRouter = express.Router();

qrcodeClientRouter.post('/create', function (req, res) {
    const data = req.body;
    const text = data.text;
    const format = (data.format || 'png').toUpperCase();
    if (-1 === ['JPG', 'PNG', 'SVG', 'EPS'].indexOf(format)) {
        return res.status(500).send("Format d'image invalide (format possible : JPG, PNG, SVG, EPS).");
    }

    axios.post(
        `${config.qrcode.createUrl}?access-token=${config.qrcode.token}`,
        {
            frame_name: 'bottom-frame',
            qr_code_text: text,
            image_format: format,
            qr_code_logo: 'no-logo',
            frame_color: '#000000',
            frame_icon_name: 'mobile',
            frame_text: 'Créé par local.fr',
            frame_text_color: '#FFFFFF',
        }
    ).then(response => {
        res.send(response.data
            .replace('font-size="11px"', 'font-size="9px"')
            .replace('font-family="Verdana"', '')
            .replace('<svg ', `<svg style="font-family: Arial;" `)
        );
    }, error => {
        res.status(500).send(error.data || error);
    }).catch(error => {
        res.status(500).send(error.data || error);
    });
});

module.exports = qrcodeClientRouter;
