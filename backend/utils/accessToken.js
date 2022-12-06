'use strict';

const { JWK, JWT } = require('jose');
const config = require('../config');

module.exports = {
    publicKey: JWK.asKey(Buffer.from(config.localfr.api.oauth2.publicKey)),
    audience: config.localfr.api.oauth2.clientId,
    isValid: function (token) {
        if (!token) {
            return false;
        }
        
        try {
            this.parse(token);
        } catch (err) {
            return false;
        }

        return true;
    },
    parse: function (token) {
        return JWT.verify(
            token,
            this.publicKey,
            {
                audience: this.audience
            }
        );
    }
};
