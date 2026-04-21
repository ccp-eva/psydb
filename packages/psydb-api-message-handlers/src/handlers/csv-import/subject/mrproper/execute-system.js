'use strict';
var { prepareStateUpdate } = require('@mpieva/psydb-api-message-handler-lib');
var { StudyConsentTemplate } = require('@mpieva/psydb-schema-creators');

var executeSystemEvents = async (context) => {
    var { db, dispatch, message, cache } = context;
    var { _id: csvImportId } = message.payload;
    var { subjectIds } = cache.get();

    if (subjectIds.length > 0) {
        await mrproperMany({ db, dispatch, subject: {
            _id: { $in: subjectIds }
        }}); // subChannelKeys: [ 'gdpr', 'scirntific' ] // TODO maybe?
    }

    await mrproperMany({ db, dispatch, csvImport: {
        _id: csvImportId
    }});
}

var mrproperMany = async (bag) => {
    var { db, dispatch, ...rest } = bag;
    var [ collection, query ] = Object.entries(rest)[0];

    var records = aggregateToArray({ db, [collection]: query });
    var channelIds = records.map(it => it._id);

    var { hasSubChannels } = records[0]._rohrpostMetadata; // FIXME
    if (hasSubChannels) {
        await dispatch.multiplexed({
            collection, channelIds, subChannelKey: 'gdpr',
            type: 'MAKE_MRPROPER', doUnlock: false
        });
        await dispatch.multiplexed({
            collection, channelIds, subChannelKey: 'scientific',
            type: 'MAKE_MRPROPER', doUnlock: false
        });
    }

    var keepEventIds = [];
    for (var it of records) {
        var { _rohrpostMetadata } = it;
        var { hasSubChannels } = _rohrpostMetadata;

        if (hasSubChannels) {
            keepEventIds.push([
                it.gdpr._rohrpostMetadata.eventIds.slice(-1)[0],
                it.gdpr._rohrpostMetadata.eventIds[0],
                it.scientific._rohrpostMetadata.eventIds.slice(-1)[0],
                it.scientific._rohrpostMetadata.eventIds[0],
            ])
        }
        else {
            keepEventIds.push([
                _rohrpostMetadata.eventIds.slice(-1)[0],
                _rohrpostMetadata.eventIds[0],
            ])
        }
    }
}

module.exports = { executeSystemEvents }
