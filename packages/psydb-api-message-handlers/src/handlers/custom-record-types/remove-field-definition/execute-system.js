'use strict';
var { jsonpointer } = require('@mpieva/psydb-core-utils');
var { convertPointerToPath } = require('@mpieva/psydb-api-lib');

var executeSystemEvents = async (context) => {
    var { message, cache, dispatch } = context;
    var { id, subChannelKey, key } = message.payload;
    var { isCommited, nextFieldsPointer, nextFieldIndex } = cache.get();
    
    var path = convertPointerToPath(
        `${nextFieldsPointer}/${nextFieldIndex}`
    );

    var payload = undefined;
    if (isCommited) {
        await dispatch({
            collection: 'customRecordType',
            channelId: id,
            payload: { $set: {
                'state.isDirty': true,
                [`${path}.isDirty`]: true,
                [`${path}.isRemoved`]: true,
            }}
        });
        // TODO maybe we could allow to actually remove the field when
        // there are no records of that in db yet
    }
    else {
        await dispatch({
            collection: 'customRecordType',
            channelId: id,
            payload: { $unset: {
                [path]: true,
            }}
        });
        // FIXME: his is a workaround for:
        // http://jira.mongodb.org/browse/SERVER-1014
        await dispatch({
            collection: 'customRecordType',
            channelId: id,
            payload: { $pull: {
                [convertPointerToPath(nextFieldsPointer)]: null,
            }}
        });
    }

}
module.exports = { executeSystemEvents }
