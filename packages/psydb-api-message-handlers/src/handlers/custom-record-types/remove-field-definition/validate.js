'use strict';
var { aggregateOne } = require('@mpieva/psydb-mongo-adapter');
var { validateMessageOrThrow, ApiError } = require('@mpieva/psydb-api-lib');

var allSchemaCreators = require('@mpieva/psydb-schema-creators');

var CoreSchema = require('./core-schema');
var FullSchema = require('./full-schema');

var validateMessage = async (context) => {
    var { db, handler, message, cache } = context;

    var coreload = validateMessageOrThrow({
        handler, message, schema: CoreSchema(),
        performClone: true,
    });

    var { id: crtId } = coreload;
    var crtRecord = await aggregateOne({ db, customRecordType: [
        { $match: { '_id': crtId }}
    ]});
    if (!crtRecord) {
        throw new ApiError(404, 'CustomRecordTypeNotFound');
    }

    var { collection } = crtRecord;
    var { hasSubChannels } = allSchemaCreators[collection];

    validateMessageOrThrow({
        handler, message,
        schema: FullSchema({ hasSubChannels }),
    });

    cache.merge({ crtRecord });
}

module.exports = { validateMessage }
