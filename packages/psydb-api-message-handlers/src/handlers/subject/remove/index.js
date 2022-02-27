'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var { unique } = require('@mpieva/psydb-core-utils');

var {
    ApiError,
    compareIds,
    fetchRecordReverseRefs,
} = require('@mpieva/psydb-api-lib');

var SimpleHandler = require('../../../lib/simple-handler');
var checkForeignIdsExist = require('../../../lib/check-foreign-ids-exist');
var PutMaker = require('../../../lib/put-maker');

var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'subject/remove',
    createSchema,
});

handler.checkAllowedAndPlausible = async ({
    db,
    permissions,
    message,
    cache,
}) => {
    if (!permissions.isRoot()) {
        throw new ApiError(403);
    }

    var {
        id,
        lastKnownScientificEventId,
    } = message.payload;

    var allReverseRefs = await fetchRecordReverseRefs({
        db,
        recordId: id
    });
}

handler.triggerSystemEvents = async ({
    db,
    rohrpost,
    message,
    personnelId,
    cache,
}) => {
}


module.exports = handler;
