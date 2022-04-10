'use strict';
var { getIntervalRemovalUpdateOps } = require('@mpieva/psydb-api-lib');

var removeReservationsInInterval = async (options) => {
    var { db, dispatch, dispatchProps, removeInterval, extraFilters } = options;
    
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

module.exports = removeReservationsInInterval;
