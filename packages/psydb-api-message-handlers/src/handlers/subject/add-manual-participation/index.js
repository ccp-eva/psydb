'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var nanoid = require('nanoid').nanoid;

var ApiError = require('@mpieva/psydb-api-lib/src/api-error'),
    compareIds = require('@mpieva/psydb-api-lib/src/compare-ids');

var SimpleHandler = require('../../../lib/simple-handler'),
    checkForeignIdsExist = require('../../../lib/check-foreign-ids-exist'),
    PushMaker = require('../../../lib/push-maker');

var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'subject/add-manual-participation',
    createSchema,
});

handler.checkAllowedAndPlausible = async ({
    db,
    permissions,
    message
}) => {
    // TODO
    if (!permissions.hasRootAccess) {
        throw new ApiError(403);
    }

    var {
        id,
        lastKnownScientificEventId,
        studyId,
    } = message.payload;

    var study = await (
        db.collection('study')
        .findOne({ _id: studyId })
    );

    // TODO: check study permissions

    if (!study) {
        throw new ApiError(404, 'StudyNotFound');
    }

    var subject = await (
        db.collection('subject')
        .findOne({ _id: id })
    );

    // TODO: check subject permissions agains study permissions
    // TODO: check subject record type agains study subject types
    
    if (!subject) {
        throw new ApiError(404, 'SubjectNotFound');
    }

    if (!compareIds(
        subject.scientific.events[0]._id,
        lastKnownScientificEventId
    )) {
        throw new ApiError(400, 'SubjectRecordHasChanged');
    }
}

handler.triggerSystemEvents = async ({
    db,
    rohrpost,
    message,
    personnelId,
}) => {
    var { type: messageType, payload } = message;
    var {
        id,
        lastKnownScientificEventId,
        studyId,
        timestamp,
        status,
    } = payload;

    var channel = (
        rohrpost
        .openCollection('subject')
        .openChannel({
            id,
        })
    );

    var messages = PushMaker({ personnelId }).all({
        '/state/internals/participatedInStudies': {
            type: 'manual',
            studyId,
            timestamp,
            status,
        },
    });

    await channel.dispatchMany({
        messages,
        subChannelKey: 'scientific',
        lastKnownEventId: lastKnownScientificEventId,
    });
}

module.exports = handler;
