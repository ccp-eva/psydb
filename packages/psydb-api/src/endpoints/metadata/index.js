'use strict';
var compose = require('koa-compose'),
    KoaRouter = require('koa-router'),
    withKoaBody = require('koa-body'),

    getCustomRecordTypes = require('./get-custom-record-types'),
    getSchema = require('./get-schema'),
    getCRTSettings = require('./get-crt-settings');

var createMetadataRouting = ({ middleware }) => {
    var router = KoaRouter();

    router.use(middleware);

    router.post(
        '/custom-record-types',
        withKoaBody(),
        getCustomRecordTypes
    );
    router.get('/record-schema/:collectionName', getSchema);
    router.get('/record-schema/:collectionName/:recordType', getSchema);

    router.get('/crt-settings/:collectionName', getCRTSettings);
    router.get('/crt-settings/:collectionName/:recordType', getCRTSettings);

    return [
        router.routes(),
        router.allowedMethods(),
    ];
}

module.exports = createMetadataRouting;
