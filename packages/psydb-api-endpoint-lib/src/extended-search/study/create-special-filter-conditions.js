'use strict';

var {
    createCustomQueryValues,
    convertPointerKeys,
} = require('../utils');

var createSpecialFilterConditions = (filters) => {
    var {
        studyId,
    } = filters;

    var AND = [];
    if (studyId) {
        AND.push({
            '_id': new RegExp(escapeRX(studyId), 'i')
        });
    }

    var statics = createCustomQueryValues({
        fields: [
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
