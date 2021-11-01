'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:searchSubjectsTestableInOnlineVideCall'
);
var compose = require('koa-compose');
var searchUngrouped = require('./search-ungrouped');

var searchSubjectsTestableInOnlineVideoCall = compose([
    async (context, next) => {
        context.experimentVariant = 'online-video-call';
        await next();
    },
    searchUngrouped
]);

module.exports = searchSubjectsTestableInOnlineVideoCall;
