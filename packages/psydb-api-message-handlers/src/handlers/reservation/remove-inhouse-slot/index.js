'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var nanoid = require('nanoid').nanoid;
var ApiError = require('@mpieva/psydb-api-lib/src/api-error');

var SimpleHandler = require('../../../lib/simple-handler'),
    PutMaker = require('../../../lib/put-maker'),
    checkForeignIdsExist = require('../../../lib/check-foreign-ids-exist');

var {
    checkConflictingLocationExperiments,
} = require('../util');

var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'reservation/remove-inhouse-slot',
    createSchema,
});

handler.checkAllowedAndPlausible = async ({
    db,
    permissions,
    message
}) => {
    var canRemove = permissions.hasSomeLabOperationFlags({
        types: ['inhouse', 'online-video-call'],
        flags: ['canWriteReservations']
    });
    if (!canRemove) {
        throw new ApiError(403);
    }

    var {
        studyId,
        experimentOperatorTeamId,
        locationId,
        interval,
    } = message.payload.props;

    // TODO: use FK to check existance (?)
    await checkForeignIdsExist(db, {
        'study': studyId,
        'experimentOperatorTeam': experimentOperatorTeamId,
        'location': locationId
    });

    await checkConflictingLocationExperiments({
        db, locationId, interval
    });
}

handler.triggerSystemEvents = async ({
    db,
    rohrpost,
    message,
    personnelId,
}) => {
    var { type: messageType, payload } = message;
    var { id, props } = payload;

    var { 
        interval: removeInterval,
        locationId,
        experimentOperatorTeamId
    } = props;

    var reservations = await (
        db.collection('reservation')
        .find({
            'state.locationId': locationId,
            // we are switching to half open intervals
            // i.e. ends are set on .000Z
            // therefor $lt is the way to go
            'state.interval.start': { $lt: removeInterval.end },
            'state.interval.end': { $gt: removeInterval.start }
        })
        .toArray()
    );

    var toBeRemoved = [];
    var toBeCreated = [];
    for (var reservation of reservations) {
        var { _id: reservationId, events, state } = reservation;
        var { interval } = state;
        var [{ _id: lastKnownEventId }] = events;

        var isStartBelowRemoveStart = (
            removeInterval.start.getTime() > interval.start.getTime()
        );
        var isStartAboveRemoveStart = (
            removeInterval.start.getTime() < interval.start.getTime()
        );

        var isEndBelowRemoveEnd = (
            removeInterval.end.getTime() > interval.end.getTime()
        );
        var isEndAboveRemoveEnd = (
            removeInterval.end.getTime() < interval.end.getTime()
        );

        var isEqualStart = (
            removeInterval.start.getTime() === interval.start.getTime()
        );
        var isEqualEnd = (
            removeInterval.end.getTime() === interval.end.getTime()
        );

        // remove
        var isEqualAll = (
            isEqualStart && isEqualEnd
        );
        // remove
        var isInside = (
            isStartAboveRemoveStart && isEndBelowRemoveEnd
        );
        // remove
        var isInsideRightAligned = (
            isStartAboveRemoveStart && isEqualEnd
        );
        // remove
        var isInsideLeftAligned = (
            isEqualStart && isEndBelowRemoveEnd
        );

        // cut out the rem part
        var isOutside = (
            isStartBelowRemoveStart && isEndAboveRemoveEnd
        );
        // change end to rem start
        var isOutsideRightAligned = (
            isStartBelowRemoveStart && isEqualEnd
        );
        // change start to rem end
        var isOutsideLeftAligned = (
            isEqualStart && isEndAboveRemoveEnd
        );
        // change end to rem start
        var isOverlappingLeft = (
            isStartBelowRemoveStart && isEndBelowRemoveEnd
        );
        // change start to rem end
        var isOverlappingRight = (
            isStartAboveRemoveStart && isEndAboveRemoveEnd
        );

        var shouldRemove = (
            isEqualAll ||
            isInside ||
            isInsideRightAligned ||
            isInsideLeftAligned
        );

        var shouldUpdateStart = (
            isOutsideLeftAligned || isOverlappingRight
        );
        var shouldUpdateEnd = (
            isOutsideRightAligned || isOverlappingLeft
        )

        if (shouldRemove) {
            toBeRemoved.push(reservationId);
        }
        else if (isOutside) {
            var ps = {
                '/state/seriesId': state.seriesId,
                '/state/isDeleted': false,
                '/state/studyId': state.studyId,
                '/state/experimentOperatorTeamId': (
                    state.experimentOperatorTeamId
                ),
                '/state/locationId': state.locationId,
                '/state/locationRecordType': state.locationRecordType,
                '/state/interval/start': state.interval.start,
                '/state/interval/end': state.interval.end,
            };
            toBeCreated.push({
                ...ps,
                '/state/interval/end': (
                    new Date (removeInterval.start.getTime() - 1)
                )
            });
            toBeCreated.push({
                ...ps,
                '/state/interval/start': ( 
                    new Date (removeInterval.end.getTime() + 1)
                )
            });
            toBeRemoved.push(reservationId);
        }
        else if (shouldUpdateStart || shouldUpdateEnd) {
            var messages = [];
            if (shouldUpdateEnd) {
                messages.push(...PutMaker({ personnelId }).all({
                    '/state/interval/end': (
                        new Date (removeInterval.start.getTime() - 1)
                    ),
                }));
            }
            if (shouldUpdateStart) {
                messages.push(...PutMaker({ personnelId }).all({
                    '/state/interval/start': (
                        new Date (removeInterval.end.getTime() + 1)
                    )
                }));
            }
            var channel = (
                rohrpost
                .openCollection('reservation')
                .openChannel({ id: reservationId })
            );
            await channel.dispatchMany({ messages, lastKnownEventId });
        }
        else {
            throw new Error('reached an unknown state');
        }
    }

    if (toBeRemoved.length > 0) {
        await db.collection('reservation').removeMany({
            _id: { $in: toBeRemoved }
        });
    }

    if (toBeCreated.length > 0) {
        for (var it of toBeCreated) {
            var channel = (
                rohrpost
                .openCollection('reservation')
                .openChannel({
                    id,
                    isNew: true,
                    additionalChannelProps: {
                        type: 'inhouse'
                    }
                })
            );
            await channel.dispatchMany({ messages: (
                PutMaker({ personnelId }).all(it)
            )});
        } 
    }
}

module.exports = handler;
