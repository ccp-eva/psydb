'use strict';
var {
    timeshiftAgeFrame
} = require('@mpieva/psydb-common-lib');

var {
    hasSubjectParticipatedIn
} = require('@mpieva/psydb-mongo-stages').expressions;

var {
    escapeRX // FIXME: use makeRX
} = require('../utils');

var createSpecialFilterConditions = (filters) => {
    var {
        subjectId,
        onlineId,
        sequenceNumber,
        didParticipateIn,
        didNotParticipateIn
    } = filters;

    var AND = [];
    if (subjectId) {
        AND.push({
            '_id': new RegExp(escapeRX(subjectId), 'i')
        });
    }
    if (onlineId) {
        AND.push({
            'onlineId': new RegExp(escapeRX(onlineId), 'i')
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
    if (didParticipateIn && didParticipateIn.length > 0) {
        AND.push({ $expr: (
            hasSubjectParticipatedIn({ studyIds: didParticipateIn })
        )});
    }
    if (didNotParticipateIn && didNotParticipateIn.length > 0) {
        AND.push({ $expr: { $not: (
            hasSubjectParticipatedIn({ studyIds: didNotParticipateIn })
        )}});
    }

    return (
        AND.length > 0
        ? { $and: AND }
        : undefined
    )
}

module.exports = createSpecialFilterConditions;
