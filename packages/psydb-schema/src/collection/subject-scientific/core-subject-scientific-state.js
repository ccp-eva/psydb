'use strict';
var {
    DateTime,
    ExtBool,
    ForeignId
} = require('@mpieva/psydb-schema-fields');

var coreState = require('../core-state');

var coreSubjectState = {
    allOf: [
        {
            type: 'object',
            properties: {
                subjectGdprId: ForeignId('subjectGdpr'),
                
                canBeTestedInhouseByInstituteIds: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            instituteId: ForeignId('institute'),
                            canBeTested: ExtBool(),
                        },
                        required: [
                            'instituteId',
                            'canBeTested',
                        ]
                    }
                },

                canBeTestedExternallyByInstituteIds: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            instituteId: ForeignId('institute'),
                            canBeTested: ExtBool(),
                        },
                        required: [
                            'instituteId',
                            'canBeTested',
                        ]
                    }
                },

                participatedInStudyIds: {
                    type: 'array',
                    items: ForeignId('study'),
                },

                disabledForTestingIntervals: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            instituteId: ForeignId('institute'),
                            start: DateTime(),
                            end: DateTime({
                                // NOTE: https://docs.opis.io/json-schema/1.x/pointers.html#relative-pointers
                                formatMinimum: { $data: '2/start/$date' }
                            }),
                        }
                    }
                },

                // TODO: comment handling here?
                // better in separate collection?
            }
        },
        coreState,
    ]
};

module.exports = coreSubjectState;
