'use strict';
var { ApiError, validateMessageOrThrow, fetchCRTSettings }
    = require('@mpieva/psydb-api-lib');

var CoreSchema = require('./schema-core');
var FullSchem = require('./schema-full');

var validateMessage = async (context) => {
    var { db, message, handler, cache, apiConfig } = context;

    validateMessageOrThrow({
        handler, message, schema: CoreSchema(),
    });

    var { _id } = message.payload;
    // NOTE: aggregateOneOrThrow ??
    var study = await aggregateOne({ db, study: { _id }});
    if (!study) {
        throw new ApiError(404, {
            apiStatus: 'RecordNotFound',
            data: { collection: 'study', id: _id }
        });
    }

    var crtSettings = await fetchCRTSettings({
        db, collectionName: 'study', recordType: study.type, wrap: true
    })

    validateMessageOrThrow({
        handler, message, schema: FullSchema({ apiConfig, crtSettings }),
    });

    cache.merge({ study })
}

module.exports = { validateMessage };
