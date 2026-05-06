'use strict';
var { aggregateToIds, aggregateToArray }
    = require('@mpieva/psydb-mongo-adapter');

var { compose, switchComposition, ApiError }
    = require('@mpieva/psydb-api-lib');
var { verifyOneCRT }
    = require('@mpieva/psydb-api-message-handler-lib');


var compose_verifyAllowedAndPlausible = () => compose([
    verifyGeneralPermissions,
    verifyCSVImportRecord,
    
    // NOTE:scheduled experiments will update the subjects as of yet
    verifyNoSubjectWasUpdated,
    verifyNoReverseRefs,
]);

var verifyGeneralPermissions = async (context, next) => {
    var { db, permissions, message } = context;
    
    if (!permissions.isRoot()) {
        throw new ApiError(403)
    }
    
    await next();
}

var verifyCSVImportRecord = verifyOneCRT({
    collection: 'csvImport',
    by: '/payload/_id',
    cache: true,'
});

var verifyNoSubjectWasUpdated = async (context) => {
    var { db, message } = context;
    var { _id } = message.payload;

    var updatedSubjectIds = await aggregateToIds({ db, subject: [
        { $match: {
            'csvImportId': _id,
            'gdpr._rohrpostMetadata.eventIds.1': { $exists: true },
            'scientific._rohrpostMetadata.eventIds.1': { $exists: true },
        }}
    ]});

    if (updatedSubjectIds.length > 0) {
        throw new ApiError(409, {
            apiStatus: 'SubjectsWereUpdated',
            data: { subjectIds: updatedSubjectIds }
        });
    }
    
    await next();
}

var verifyNoReverseRefs = async (context) => {
    var { db, message, cache } = context;
    var { _id } = message.payload;

    var subjectIds = await aggregateToIds({ db, subject: {
        'csvImportId': _id,
    }});

    var crtRecords = await aggregateToArray({ db, customRecordType: {} });
    for (var record of crtRecords) {
        var crt = CRTSettings.fromRecord(record);
        var collection = crt.getCollection();

        var definitions = crt.findCustomFields({
            'systemType': { $in: [ 'ForeignId', 'ForeignIdList' ]},
            'props.collection': 'subject'
        });

        var MATCH = {};
        for (var def of definitions) {
            var { pointer } = def;
            MATCH['$' + convertPointerToPath(pointer)] = { $in: subjectIds };
        }

        var referrerIds = await aggregateToIds({ db, [collection]: {
            ...MATCH
        }});
        if (referrerIds.length > 0) {
            throw new ApiError(409, {
                apiStatus: 'SubjectsAreReferenced',
                data: { collection, referrerIds }
            });
        } 
    }

    cache.merge({ subjectIds });
    await next();
}

module.exports = {
    verifyAllowedAndPlausible: compose_verifyAllowedAndPlausible()
}
