'use strict';
var {
    ForeignId
} = require('@mpieva/psydb-schema-fields');

var coreState = require('../core-state');

var coreSubjectState = {
    allOf: [
        {
            type: 'object',
            properties: {
                subjectScientificId: ForeignId('subjectScientific'),
            }
        },
        coreState,
    ]
};

module.exports = coreSubjectState;
