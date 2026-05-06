'use strict';
var { jsonpointer } = require('@mpieva/psydb-core-utils');
var { ApiError, fetchRecordReverseRefs } = require('@mpieva/psydb-api-lib');
var noop = require('../noop');

var verifyNoReverseRefs = (bag) => {
    var {
        collection, by: resolveId,
        excludedRefCollections = undefined,
    } = bag;

    if (typeof resolveId === 'string') {
        var pointer = resolveId;
        resolveId = ({ message }) => ( jsonpointer.get(message, pointer) );
    }
    
    var verifyNoReverseRefs_MW = async (context, next = noop) => {
        var { db, message, cache } = context;
        var recordId = resolveId({ message, cache });

        var reverseRefs = await fetchRecordReverseRefs({
            db, recordId,
            refTargetCollection: collection,
            excludedCollections: excludedRefCollections
        });

        if (reverseRefs.length > 0) {
            throw new ApiError(409, {
                apiStatus: 'RecordHasReverseRefs',
                data: { reverseRefs }
            });
        }

        await next();
    }

    return verifyNoReverseRefs_MW;
}

module.exports = { verifyNoReverseRefs };
