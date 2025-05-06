'use strict';
var compose = require('koa-compose');
var KoaRouter = require('koa-router');
var withKoaBody = require('koa-body');

var {
    getCustomRecordTypes,
    getSchema,
    getCRTSettingsByRecordId,
    getCRTSettingsById,
    getCRTSettings,
    getCollectionCRTs,
    getSubjectStudyCRTs,
} = require('./endpoints');

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
