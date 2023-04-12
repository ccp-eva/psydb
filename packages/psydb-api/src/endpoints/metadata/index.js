'use strict';
var compose = require('koa-compose'),
    KoaRouter = require('koa-router'),
    withKoaBody = require('koa-body'),

    getCustomRecordTypes = require('./get-custom-record-types'),
    getSchema = require('./get-schema'),
    getCRTSettingsById = require('./get-crt-settings-by-id'),
    getCRTSettings = require('./get-crt-settings'),
    getCollectionCRTs = require('./get-collection-crts'),
    getSubjectStudyCRTs = require('./get-subject-study-crts');

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

    router.get('/crt-settings-by-id/:id', getCRTSettingsById);
    router.get('/crt-settings/:collectionName', getCRTSettings);
    router.get('/crt-settings/:collectionName/:recordType', getCRTSettings);

    router.get('/collection-crts/:collectionName', getCollectionCRTs);
    router.get('/subject-study-crts/:subjectType', getSubjectStudyCRTs);

    return [
        router.routes(),
        router.allowedMethods(),
    ];
}

module.exports = createMetadataRouting;
