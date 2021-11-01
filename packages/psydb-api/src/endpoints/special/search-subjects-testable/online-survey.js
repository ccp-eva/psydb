'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:searchSubjectsTestableInOnlineSurvey'
);
var compose = require('koa-compose');
var searchUngrouped = require('./search-ungrouped');

var searchSubjectsTestableInOnlineSurvey = compose([
    async (context, next) => {
        context.experimentVariant = 'online-survey';
        await next();
    },
    searchUngrouped
]);

module.exports = searchSubjectsTestableInOnlineSurvey;
