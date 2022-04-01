'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var {
    ApiError,
    getIntervalRemovalUpdateOps
} = require('@mpieva/psydb-api-lib');

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

handler.triggerSystemEvents = async (context) => {
    var { message } = context;
    var { id, props } = message.payload;

    var { 
        interval: removeInterval,
        locationId,
        experimentOperatorTeamId
    } = props;

    await removeReservationsInInterval({
        ...context,
        removeInterval,
        extraFilters: {
            'state.locationId': locationId,
            'state.experimentOperatorTeamId': experimentOperatorTeamId
        }
    })

}

var removeReservationsInInterval = async (options) => {
    var { db, dispatch, removeInterval, extraFilters } = options;
    
    var reservations = await (
        db.collection('reservation')
        .find({
            ...extraFilters,
            // we are switching to half open intervals
            // i.e. ends are set on .000Z
            // therefor $lt is the way to go
            'state.interval.start': { $lt: removeInterval.end },
            'state.interval.end': { $gt: removeInterval.start }
        })
        .toArray()
    );

    var toBeUpdated = [];
    var toBeRemoved = [];
    var toBeCreated = [];
    for (var reservation of reservations) {
        var { _id: reservationId, type, state } = reservation;
        var { interval: recordInterval } = state;

        var {
            shouldRemove,
            shouldUpdateStart,
            shouldUpdateEnd,
            shouldCutOut,
        } = getIntervalRemovalUpdateOps({ removeInterval, recordInterval });

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

            toBeRemoved.push(reservationId);
        }
        else if (shouldUpdateStart || shouldUpdateEnd) {
            var updates = {};
            if (shouldUpdateEnd) {
                updates['state.interval.end'] = (
                    new Date (removeInterval.start.getTime() - 1)
                );
            }
            if (shouldUpdateStart) {
                updates['state.interval.start'] = (
                    new Date (removeInterval.end.getTime() + 1)
                );
            }
            toBeUpdated.push({
                reservationId,
                updates
            });
        }
        else {
            throw new Error('reached an unknown state');
        }
    }

    if (toBeUpdated.length > 0) {
        for (var it of toBeUpdated) {
            var { reservationId, updates } = it;
            
            await dispatch({
                collection: 'reservation',
                channelId: reservationId,
                payload: { $set: updates }
            });
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
                isNew: true,
                additionalChannelProps: { type: it.type },
                props: it.props,

                recordType: it.type,
                initialize: true
            });
        } 
    }
}

module.exports = handler;
