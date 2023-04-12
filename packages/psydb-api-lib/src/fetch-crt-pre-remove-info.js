'use strict';
var sift = require('sift');
var { entries, ejson } = require('@mpieva/psydb-core-utils');

var fetchAllCRTSettings = require('./fetch-all-crt-settings');

var fetchCRTPreRemoveInfo = async (bag) => {
    var { db, crtId } = bag;
    var crt = await (
        db.collection('customRecordType').findOne({ _id: crtId })
    );
    var { collection: targetCollection, type: targetType } = crt;

    var existingRecordCount = await (
        db.collection(targetCollection).countDocuments({
            type: targetType,
            'state.internals.isRemoved': { $ne: true }
        })
    );
    
    var allCRTs = await fetchAllCRTSettings(db, [
        'subject',
        'study',
        'location',
        'externalPerson',
        'externalOrganization',
    ].map(it => ({ collection: it })), { wrap: true });

    var crtFieldRefs = [];
    for (var [collectionKey, collectionCRTs] of entries(allCRTs)) {
        for (var [ crtKey, crt ] of entries(collectionCRTs)) {
            var fields = crt.allCustomFields().filter(sift({
                'type': { $in: [ 'ForeignId', 'ForeignIdList' ]},
                'props.collection': targetCollection,
                'props.recordType': targetType,
                'isRemoved': { $ne: true }
            }));
            if (fields.length > 0) {
                crtFieldRefs.push({
                    collection: collectionKey,
                    recordType: crtKey,
                    recordTypeLabel: crt.getDisplayName(),
                    fields,
                })
            }
        }
    }

    return {
        existingRecordCount,
        crtFieldRefs,
    }
}

module.exports = { fetchCRTPreRemoveInfo };
