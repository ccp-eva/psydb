'use strict';

var {
    createCustomQueryValues,
    convertPointerKeys,
    escapeRX, // FIXME: use makeRX
} = require('../utils');

var createSpecialFilterConditions = (filters) => {
    var {
        locationId,
        sequenceNumber,
        isHidden
    } = filters;

    var AND = [];
    if (locationId) {
        AND.push({
            '_id': new RegExp(escapeRX(locationId), 'i')
        });
    }
    if (sequenceNumber !== undefined) {
        AND.push({ $expr: {
            $regexMatch: {
                input: { $convert: {
                    input: '$sequenceNumber', to: 'string'
                }},
                regex: new RegExp(escapeRX(String(sequenceNumber)), 'i')
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
        AND.push(convertPointerKeys(statics));
    }

    return (
        AND.length > 0
        ? { $and: AND }
        : undefined
    )
}

module.exports = createSpecialFilterConditions;
