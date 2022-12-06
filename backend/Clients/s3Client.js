'use strict';

const express = require('express');
const aws = require('aws-sdk');
const config = require('../config');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

var s3ClientRouter = express.Router();

function getS3 () {
    aws.config.update({
        'accessKeyId': config.amazon.accessKeyID,
        'secretAccessKey': config.amazon.secretAccessKey
    });
    aws.config.region = config.amazon.s3.region;

    return new aws.S3({
        params: {
            Bucket: config.amazon.s3.bucket
        }
    });
}

s3ClientRouter.get('/get-object/:filePath', function (req, res) {
    const filePath = decodeURIComponent(req.params.filePath);
    const s3 = getS3();
    const params = {
        Key: config.amazon.s3.folder + '/' + filePath
    };
    return s3.getObject(params)
      .createReadStream()
      .pipe(res)
      .on('error', function (err) {
          console.error('Error while streaming ' + filePath + ' to client');
      });
});

s3ClientRouter.post('/put-object', upload.single('file'), function (req, res) {
    const sageCode = req.body.sageCode;
    const s3 = getS3();
    const params = {
        Key: config.amazon.s3.folder + '/' + sageCode + '/' + req.file.originalname,
        ContentType: req.file.mimetype,
        Body: req.file.buffer
    };
    return s3.putObject(params, function (err, _data) {
        if (err) {
            console.error(err);
            res.status(500).json({
                status: 500,
                statusText: 'Internal Server Error',
                reason: 'Something went wrong while uploding file ' + req.file.originalname + ' to s3'
            });
        } else {
            res.json({});
        }
    });
});

module.exports = s3ClientRouter;
