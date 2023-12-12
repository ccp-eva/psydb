'use strict';
var {
    validateOrThrow,
    ResponseBody,
    fetchRecordLabelsManual,
} = require('@mpieva/psydb-api-lib');

var { fetchUpdates, fetchEvents, postprocessUpdates } = require('../utils');
var Schema = require('./schema');

var fixedImportEventList = async (context, next) => {
    var {
        db, permissions, request,
        timezone, language, locale
    } = context;

    validateOrThrow({
        schema: Schema(),
        payload: request.body
    })

    var { offset, limit } = request.body;
    var { updates, total } = await fetchUpdates({
        db,
        match: { source: 'fixImportEvents' },
        offset, limit
    });

    var events = await fetchEvents({ db, updates });
    
    var { relatedIds } = postprocessUpdates({ updates, events });
    var related = await fetchRecordLabelsManual(db, relatedIds, {
        timezone, language, locale
    });

    context.body = ResponseBody({
        data: { updates, total, related },
    });
}

module.exports = { fixedImportEventList };
