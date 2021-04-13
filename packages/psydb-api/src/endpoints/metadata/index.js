'use strict';
var compose = require('koa-compose'),
    KoaRouter = require('koa-router'),

    getCustomRecordTypes = require('./get-custom-record-types'),
    getSchema = require('./get-schema');

var createMetadataRouting = ({ middleware }) => {
    var router = KoaRouter();

    router.use(middleware);

    router.get('/custom-record-types', getCustomRecordTypes);
    router.get('/schema/:collectionName', getSchema);
    router.get('/schema/:collectionName/:recordType', getSchema);

    return [
        router.routes(),
        router.allowedMethods(),
    ];
}

module.exports = createMetadataRouting;
