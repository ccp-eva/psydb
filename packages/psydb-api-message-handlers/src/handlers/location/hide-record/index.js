'use strict';
var debug = require('debug')('psydb:api:message-handlers');
var {
    compareIds,
    only,
    flatten,
    entries
} = require('@mpieva/psydb-core-utils');

var {
    ApiError,
    fetchRecordReverseRefs,
} = require('@mpieva/psydb-api-lib');

var { SimpleHandler } = require('../../../lib/');
var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'location/hide-record',
    createSchema,
});

handler.checkAllowedAndPlausible = async ({
    db,
    permissions,
    message,
    cache,
}) => {
    if (!permissions.hasCollectionFlag('location', 'write')) {
        throw new ApiError(403);
    }

    var { id } = message.payload;

    var record = await (
        db.collection('location')
        .findOne(
            { _id: id },
            { projection: { _id: true }}
        )
    );
    if (!record) {
        throw new ApiError(404);
    }
}

handler.triggerSystemEvents = async (context) => {
    var { db, message, dispatch } = context;
    var { id: locationId, detachSubjects } = message.payload;

    if (detachSubjects) {
        var reverseRefs = await fetchRecordReverseRefs({
            db,
            recordId: locationId,
            refTargetCollection: 'location'
        });

        var subjectReverseRefs = reverseRefs.filter(it => (
            it.collection === 'subject'
        ));
        
        var subjectRecords = await (
            db.collection('subject')
            .aggregate([
                { $match: {
                    _id: { $in: subjectReverseRefs.map(it => it._id) }
                }},
                { $project: {
                    'scientific.state.custom': true,
                    'gdpr.state.custom': true,
                }}
            ])
            .toArray()
        );
        
        for (var subject of subjectRecords) {
            var refPaths = (
                entries(flatten(subject))
                .filter(([ key, value ]) => compareIds(value, locationId))
                .map(([ key ]) => key)
            );

            var scientificRefPaths = (
                refPaths.filter(it => it.startsWith('scientific.'))
            );
            var gdprRefPaths = (
                refPaths.filter(it => it.startsWith('gdpr.'))
            );

            if (scientificRefPaths.length > 0) {
                var scientificPayload = { $set: (
                    scientificRefPaths.reduce((acc, it) => ({
                        ...acc, [it]: null
                    }), {})
                )};
                await dispatch({
                    collection: 'subject',
                    channelId: subject._id,
                    subChannelKey: 'scientific',
                    payload: scientificPayload
                });
            }
            
            if (gdprRefPaths.length > 0) {
                var gdprPayload = { $set: (
                    gdprRefPaths.reduce((acc, it) => ({
                        ...acc, [it]: null
                    }), {})
                )};
                await dispatch({
                    collection: 'subject',
                    channelId: subject._id,
                    subChannelKey: 'gdpr',
                    payload: gdprPayload
                });
            }

        }
    }

    var path = 'state.systemPermissions.isHidden';

    await dispatch({
        collection: 'location',
        channelId: locationId,
        payload: { $set: {
            [path]: true
        }}
    });
}

module.exports = handler;
