'use strict';

var {
    createCustomQueryValues,
    convertPointerKeys,
    escapeRX, // FIXME: use makeRX
} = require('../utils');

var createSpecialFilterConditions = (filters) => {
    var {
        studyId,
        sequenceNumber,
    } = filters;

    var AND = [];
    if (studyId) {
        AND.push({
            '_id': new RegExp(escapeRX(studyId), 'i')
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
                key: 'researchGroupIds',
                pointer: '/state/researchGroupIds',
                type: 'ForeignIdList',
                props: { collection: 'researchGroup' }
            }
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
