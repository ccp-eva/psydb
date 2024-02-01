'use strict';
var { unescape } = require('@cdxoo/mongodb-escape-keys');
var { ejson, forcePush } = require('@mpieva/psydb-core-utils');

var {
    validateOrThrow,
    ResponseBody,
    fetchRecordLabelsManual,
} = require('@mpieva/psydb-api-lib');

var { fetchUpdates, fetchEvents, postprocessUpdates } = require('../utils');
var Schema = require('./schema');


var fixedEventDetails = async (context, next) => {
    var { db, permissions, request } = context;

    validateOrThrow({
        schema: Schema(),
        payload: request.body
    })

    var {
        updateId
    } = request.body;
   
    var { updates, total } = await fetchUpdates({
        db, match: { _id: updateId }, offset: 0, limit: 1
    });

    var events = await fetchEvents({ db, updates });

    var { relatedIds } = postprocessUpdates({ updates, events  });
    var related = await fetchRecordLabelsManual(db, relatedIds);

    context.body = ResponseBody({
        data: { update: updates[0], related },
    });
}

module.exports = { fixedEventDetails };
