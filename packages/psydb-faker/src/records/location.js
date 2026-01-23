'use strict';
var { jsonpointer } = require('@mpieva/psydb-core-utils');
var { Fields, applyOverrides } = require('../utils');

var fakeRecord = (bag) => {
    var { crtSettings, refcache, overrides } = bag;
    var { fieldDefinitions, reservationType } = crtSettings;

    // TODO: create something reasonable for theese settings
    var reservationSettings;
    if (reservationType === 'away-team') {
        reservationSettings = {
            'canBeReserved': false,
            'excludedExperimentWeekdays': {
                'mon': Fields.DefaultBool(),
                'tue': Fields.DefaultBool(),
                'wed': Fields.DefaultBool(),
                'thu': Fields.DefaultBool(),
                'fri': Fields.DefaultBool(),
                'sat': Fields.DefaultBool(),
                'sun': Fields.DefaultBool(),
            }
        }
    }
    else if (reservationType === 'inhouse') {
        reservationSettings = {
            'canBeReserved': true,
            'possibleReservationTimeInterval': {
                'start': 28800000, 'end': 57600000
            },
            'reservationSlotDuration': 900000,
            'timezone': 'Europe/Berlin'
        }
    }

    var record = { 'state': {
        'custom': {},
        'systemPermissions': Fields.SystemPermissions({}, {
            fromStore: refcache,
        }),
        ...(reservationSettings && {
            'reservationSettings': reservationSettings
        }),
    }}

    for (var def of fieldDefinitions) {
        var { pointer, type, systemType, props } = def;
        if (!systemType) { // FIXME
            systemType = type;
        }

        jsonpointer.set(record, pointer, Fields[systemType](props, {
            fromStore: refcache
        }))
    }

    applyOverrides({ record, refcache, overrides });

    return record;
}

module.exports = fakeRecord;
