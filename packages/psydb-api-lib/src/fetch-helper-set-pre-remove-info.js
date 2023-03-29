'use strict';
var sift = require('sift');
var { entries, ejson } = require('@mpieva/psydb-core-utils');

var fetchAllCRTSettings = require('./fetch-all-crt-settings');

var fetchHelperSetPreRemoveInfo = async (bag) => {
    var { db, setId } = bag;

    var existingItemCount = await (
        db.collection('helperSetItem').countDocuments({
            setId,
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
                'type': { $in: [ 'HelperSetItemId', 'HelperSetItemIdList' ]},
                'props.setId': setId,
                // FIXME: idk
                //'isRemoved': { $ne: true }
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
        existingItemCount,
        crtFieldRefs,
    }
}

module.exports = { fetchHelperSetPreRemoveInfo };
