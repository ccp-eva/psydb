'use strict';
var compose = require('koa-compose');
var KoaRouter = require('koa-router');
var withKoaBody = require('koa-body');

var getCustomRecordTypes = require('./get-custom-record-types');
var getSchema = require('./get-schema');
var getCRTSettingsByRecordId = require('./get-crt-settings-by-record-id');
var getCRTSettingsById = require('./get-crt-settings-by-id');
var getCRTSettings = require('./get-crt-settings');
var getCollectionCRTs = require('./get-collection-crts');
var getSubjectStudyCRTs = require('./get-subject-study-crts');

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

    router.get(
        '/crt-settings-by-record-id/:collection/:id',
        getCRTSettingsByRecordId
    );
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
