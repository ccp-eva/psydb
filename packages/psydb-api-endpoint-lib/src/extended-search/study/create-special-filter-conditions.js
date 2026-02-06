'use strict';
var { makeRX } = require('@mpieva/psydb-common-lib');
var { createCustomQueryValues } = require('../utils');

var createSpecialFilterConditions = (filters) => {
    var {
        studyId,
        sequenceNumber,
    } = filters;

    var AND = [];
    if (studyId) {
        AND.push({ '_id': makeRX(studyId) });
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
            {
                key: 'name',
                pointer: '/state/name',
                type: 'SaneString'
            },
            {
                key: 'shorthand',
                pointer: '/state/shorthand',
                type: 'SaneString'
            },
            {
                key: 'researchGroupIds',
                pointer: '/state/researchGroupIds',
                type: 'ForeignIdList',
                props: { collection: 'researchGroup' }
            },
            {
                key: 'scientistIds',
                pointer: '/state/scientistIds',
                type: 'ForeignIdList',
                props: { collection: 'personnel' }
            },
            {
                key: 'studyTopicIds',
                pointer: '/state/studyTopicIds',
                type: 'ForeignIdList',
                props: { collection: 'studyTopic' }
            },
            {
                key: 'experimentNames',
                pointer: '/state/experimentNames',
                type: 'SaneStringList'
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
