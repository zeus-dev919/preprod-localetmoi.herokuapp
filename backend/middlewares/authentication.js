'use strict';

const accessToken = require('../utils/accessToken');

module.exports = function (req, res, next) {
    var authorization = req.headers.authorization;
    if (authorization) {
        var bearer = authorization.split(' ');
        var token = bearer[1];

        if (token && 'null' !== token) {
            if (true === accessToken.isValid(token)) {
                next();
            } else {
                res.status(401).send('Unauthorized');
            }
        } else {
            res.status(401).send('Unauthorized');
        }
    } else {
        res.status(401).send('Unauthorized');
    }
};
