'use strict';
var { jsonpointer } = require('@mpieva/psydb-core-utils');
var { CRTSettingsList } = require('@mpieva/psydb-common-lib');
var {
    ApiError,
    fetchAvailableCRTSettings
} = require('@mpieva/psydb-api-lib');

var noop = require('./noop');


var verifyOneCRT = (bag) => {
    var {
        collection,
        by: recordTypePointer,
        byStudyId: studyIdPointer,
        fakeAjvError = false, // TODO
        cache: shouldCacheCRT = false,
        as: cacheAs
    } = bag;

    var [ apiCode, apiStatus ] = (
        fakeAjvError
        ? [ 400, 'InvalidMessageSchema' ]
        : [ 409, 'MessageDataConflict' ]
    );
    
    var resolveRecordType = ({ message }) => (
        jsonpointer.get(message, recordTypePointer)
    );

    var resolveStudyId = ({ message }) => (
        studyIdPointer
        ? jsonpointer.get(message, studyIdPointer)
        : undefined
    );

    return async (context, next = noop) => {
        var { db, message, cache } = context;
        
        var recordType = resolveRecordType({ message });
        var studyId = resolveStudyId({ message });

        var crts = await fetchAvailableCRTSettings({
            db, collections: [ collection ],
            ...(studyId && {
                byStudyId: studyId
            }),
            wrap: false, asTree: false
        });
        // FIXME: move that into above when asTree is false
        var crt = CRTSettingsList({ items: crts }).find({
            'type': recordType
        });
        if (!crt) {
            throw new ApiError(apiCode, {
                apiStatus,
                data: (
                    fakeAjvError
                    ? { ajvErrors: [ /* TODO */] }
                    : { recordTypePointer, studyIdPointer }
                )
            });
        }
        if (shouldCacheCRT) {
            cache.merge({ [cacheAs || collection + 'CRT']: crt })
        }

        await next();
    }
}

module.exports = { verifyOneCRT };
