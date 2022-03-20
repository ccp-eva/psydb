'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var { ApiError } = require('@mpieva/psydb-api-lib');
var {
    SimpleHandler,
    checkForeignIdsExist
} = require('../../../lib/');

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

    dispatch,
    dispatchProps,
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
        var { _id: reservationId, type, state } = reservation;
        var { interval } = state;

        var {
            shouldRemove,
            shouldUpdateStart,
            shouldUpdateEnd,
            shouldCutOut,
        } = getIntervalRemovealUpdateOps({ removeInterval, recordInterval });

        if (shouldRemove) {
            toBeRemoved.push(reservationId);
        }
        else if (shouldCutOut) {
            var props = {
                ...state,
                isDeleted: false
            };
            toBeCreated.push({ type, props: {
                ...props,
                interval: {
                    start: props.interval.start,
                    end: new Date (removeInterval.start.getTime() - 1)
                }
            }});
            toBeCreated.push({ type, props: {
                ...props,
                interval: {
                    start: new Date (removeInterval.end.getTime() + 1),
                    end: props.interval.end
                }
            }});

            //var ps = {
            //    '/state/seriesId': state.seriesId,
            //    '/state/isDeleted': false,
            //    '/state/studyId': state.studyId,
            //    '/state/experimentOperatorTeamId': (
            //        state.experimentOperatorTeamId
            //    ),
            //    '/state/locationId': state.locationId,
            //    '/state/locationRecordType': state.locationRecordType,
            //    '/state/interval/start': state.interval.start,
            //    '/state/interval/end': state.interval.end,
            //};
            //toBeCreated.push({
            //    ...ps,
            //    '/state/interval/end': (
            //        new Date (removeInterval.start.getTime() - 1)
            //    )
            //});
            //toBeCreated.push({
            //    ...ps,
            //    '/state/interval/start': ( 
            //        new Date (removeInterval.end.getTime() + 1)
            //    )
            //});
            toBeRemoved.push(reservationId);
        }
        else if (shouldUpdateStart || shouldUpdateEnd) {
            var updates = {};
            if (shouldUpdateEnd) {
                updates['state.interval.end'] = (
                    new Date (removeInterval.start.getTime() - 1)
                );
                //messages.push(...PutMaker({ personnelId }).all({
                //    '/state/interval/end': (
                //        new Date (removeInterval.start.getTime() - 1)
                //    ),
                //}));
            }
            if (shouldUpdateStart) {
                updates['state.interval.start'] = (
                    new Date (removeInterval.end.getTime() + 1)
                );
                //messages.push(...PutMaker({ personnelId }).all({
                //    '/state/interval/start': (
                //        new Date (removeInterval.end.getTime() + 1)
                //    )
                //}));
            }
            await dispatch({
                collection: 'reservation',
                channelId: reservationId,
                payload: { $set: updates }
            });
            //var channel = (
            //    rohrpost
            //    .openCollection('reservation')
            //    .openChannel({ id: reservationId })
            //);
            //await channel.dispatchMany({ messages });
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
            await dispatchProps({
                collection: 'reservation',
                //channelId: id,
                isNew: true,
                additionalChannelProps: { type: it.type },
                props: it.props,

                recordType: it.type,
                initialize: true
            });
            //var channel = (
            //    rohrpost
            //    .openCollection('reservation')
            //    .openChannel({
            //        id,
            //        isNew: true,
            //        additionalChannelProps: {
            //            type: 'inhouse'
            //        }
            //    })
            //);
            //await channel.dispatchMany({ messages: (
            //    PutMaker({ personnelId }).all(it)
            //)});
        } 
    }
}

var getIntervalRemovalUpdateOps = (options) => {
    var { removeInterval, recordInterval: interval } = options;

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
    );
    
    return {
        shouldRemove,
        shouldUpdateStart,
        shouldUpdateEnd,
        shouldCutOut: isOutside
    };
}

module.exports = handler;
