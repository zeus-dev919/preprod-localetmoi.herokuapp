'use strict';

const express = require('express');
const axios = require('axios');
const config = require('../config');
const sendDropboxFoldersNotification = require("../services/notify.duplicate-folders.service");
const notifyUploadFiles = require("../services/notify.upload-files.service");

var mandrillSecuredClientRouter = express.Router();

mandrillSecuredClientRouter.post('/billing-infos', function (req, res) {
    const dataBody = req.body;
    const html = `
        <!doctype html>
        <html>
            <head>
                <meta name="viewport" content="width=device-width" />
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            </head>
            <body class="" style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
                <table border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;">
                    <tr>
                        <td style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; padding: 20px; max-width: 768px; width: 768px;">
                            <!-- PREHEADER -->
                            <span style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">Une nouvelle demande de modifications de coordonnées de facturation vous a été adressée.</span>
                            <!-- START CENTERED WHITE CONTAINER -->
                            <table class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border-radius: 3px; padding-bottom: 1em;">
                                <!-- START MAIN CONTENT AREA -->
                                <tr>
                                    <td style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;">
                                        <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
                                            <tr>
                                                <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">
                                                    <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Bonjour,</p>
                                                    <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Une nouvelle demande de modifications de coordonnées de facturation vous a été adressée.</p>
                                                    <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; box-sizing: border-box;">
                                                        <thead>
                                                            <tr style="background-color: #EC008C;">
                                                                <th colspan="2" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding: 5px; color: white;">Demandeur</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <th align="left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding: 5px;">Email</th>
                                                                <td align="left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding: 5px;">${dataBody.email}</td>
                                                            </tr>
                                                            <tr>
                                                                <th align="left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding: 5px;">Code Sage</th>
                                                                <td align="left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding: 5px;">${dataBody.sageCode}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                    <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; box-sizing: border-box; margin-top: 1em;">
                                                        <thead>
                                                            <tr style="background-color: #EC008C;">
                                                                <th style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding: 5px; color: white;">Contenu du message</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td align="left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding: 5px;">${dataBody.message.replace(/\r\n|\r|\n/g, '</br>')}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <!-- END MAIN CONTENT AREA -->
                            </table>
                            <!-- START FOOTER AREA -->
                            <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
                                <tr style="background-color: #1c1819;">
                                    <td style="font-family: sans-serif; vertical-align: top; padding: 20px; font-size: 12px; color: white; align: left; width: 33.33%;">
                                        <img src="https://www.etre-visible.local.fr/userfiles/6817/local-fr.png" title="logo local.fr" width="100px" />
                                    </td>
                                    <td style="font-family: sans-serif; vertical-align: center; padding: 20px; font-size: 12px; color: white; text-align: center;">
                                        Envoyé depuis <a href="https://localetmoi.fr" style="color: white; text-decoration: none;">Local&Moi</a>
                                    </td>
                                    <td style="font-family: sans-serif; vertical-align: top; padding: 20px; font-size: 12px; color: white; text-align: center; width: 33.33%;"></td>
                                </tr>
                            <!-- END FOOTER AREA -->
                            </table>
                            <!-- END CENTERED WHITE CONTAINER -->
                        </td>
                    </tr>
                </table>
            </body>
        </html>`;
    var data = {
        'key': config.mandrill.apiKey,
        'message': {
            'from_email': config.mandrill.mailFrom,
            'to': [
                {
                    'email': config.mandrill.mailTo,
                    'type': 'to'
                }
            ],
            'autotext': 'true',
            'subject': `Demande de modifications de coordonnées de facturation: ${dataBody.sageCode}`,
            'html': html
        }
    };

    axios.post(
        config.mandrill.baseUrl,
        data,
        {
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            }
        }
    ).then(response => {
        res.send(response.data);
    }).catch(error => {
        res.send('error ' + JSON.stringify(error.data));
    });
});

mandrillSecuredClientRouter.post('/demo', function (req, res) {
    const dataBody = req.body;
    var data = {
        'key': config.mandrill.apiKey,
        'message': {
            'from_email': config.mandrill.mailFrom,
            'to': [
                {
                    'email': dataBody.agency || config.mandrill.mailTo,
                    'type': 'to'
                }
            ],
            'autotext': 'true',
            'subject': 'Demande de rendez-vous: ' + dataBody.sageCode,
            'html': 'Demande effectuée par : <br>Email :' + dataBody.fromEmail + '<br>Code SAGE : ' + dataBody.sageCode + '<br>Rendez-vous demandé :<br>1er choix de date : ' + dataBody.firstDate + '<br>2e choix de date : ' + dataBody.secondDate + '<br>Type de démo : ' + dataBody.demoType
        }
    };
    axios.post(
        config.mandrill.baseUrl,
        data,
        {
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            }
        }
    ).then(response => {
        res.send(response.data);
    }).catch(error => {
        res.send(error.data);
    });
});

mandrillSecuredClientRouter.post('/notification/duplicate-folders', function (req, res) {
    const dataBody = req.body;
    const email = sendDropboxFoldersNotification(dataBody.customerCode, dataBody.source, dataBody.folders);
    axios.post(
        config.mandrill.baseUrl,
        email,
        {
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            }
        }
    ).then(response => {
        res.send(response.data);
    }).catch(error => {
        res.send(error.data);
    });
});

mandrillSecuredClientRouter.post('/notification/upload-files', function (req, res) {
    const dataBody = req.body;
    const email = notifyUploadFiles(dataBody.customerCode, dataBody.source, dataBody.files, dataBody.folderName);
    axios.post(
        config.mandrill.baseUrl,
        email,
        {
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            }
        }
    ).then(response => {
        res.send(response.data);
    }).catch(error => {
        res.send(error.data);
    });
});

module.exports = mandrillSecuredClientRouter;
