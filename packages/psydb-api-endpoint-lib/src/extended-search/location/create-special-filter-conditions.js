'use strict';
var { makeRX } = require('@mpieva/psydb-common-lib');
var { createCustomQueryValues } = require('../utils');

var createSpecialFilterConditions = (filters) => {
    var {
        locationId,
        sequenceNumber,
        isHidden
    } = filters;

    var AND = [];
    if (locationId) {
        AND.push({ '_id': makeRX(locationId) });
    }
    if (sequenceNumber !== undefined) {
        AND.push({ $expr: {
            $regexMatch: {
                input: { $convert: {
                    input: '$sequenceNumber', to: 'string'
                }},
                regex: makeRX(String(sequenceNumber)),
            }
        }});
    }

    var statics = createCustomQueryValues({
        fields: [
            {
                key: 'isHidden',
                pointer: '/state/systemPermissions/isHidden',
                type: 'DefaultBool'
            },
        ],
        filters,
    });
    if (Object.keys(statics).length > 0 ) {
        AND.push(statics);
    }

    return (
        AND.length > 0
        ? { $and: AND }
        : undefined
    )
}

module.exports = createSpecialFilterConditions;
