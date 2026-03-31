'use strict';
var { aggregateOne } = require('@mpieva/psydb-mongo-adapter');
var { ApiError, validateMessageOrThrow, fetchCRTSettings }
    = require('@mpieva/psydb-api-lib');

var CoreSchema = require('./schema-core');
var FullSchema = require('./schema-full');

var validateMessage = async (context) => {
    var { db, message, handler, cache, apiConfig } = context;

    var { _id } = validateMessageOrThrow({
        handler, message, schema: CoreSchema(),
        performClone: true, // FIXME: createPayloadClone ??
    });

    // NOTE: aggregateOneOrThrow ??
    var study = await aggregateOne({ db, study: { _id }});
    if (!study) {
        throw new ApiError(404, {
            apiStatus: 'RecordNotFound',
            data: { collection: 'study', id: _id }
        });
    }

    var studyCRTSettings = await fetchCRTSettings({
        db, collectionName: 'study', recordType: study.type, wrap: true
    });

    validateMessageOrThrow({
        handler, message, schema: FullSchema({
            apiConfig, studyCRTSettings
        })
    });

    cache.merge({ study, studyCRTSettings });
}

module.exports = { validateMessage };
