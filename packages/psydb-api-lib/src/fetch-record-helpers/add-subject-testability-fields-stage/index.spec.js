'use strict';
var expect = require('chai').expect,
    snapshot = require('snap-shot-it'),
    AddSubjectTestabilityFieldsStage = require('./index.js');

describe('AddSubjectTestabilityFieldsStage()', function () {
    it('does stuff', () => {

        var STUDY_01 = {
            _id: 'STUDY_01',
            state: {
                researchGroupIds: [
                    'RG_ALPHA',
                    'RG_BETA'
                ],
                selectionSettingsBySubjectType: [
                    {
                        subjectRecordType: 'child',
                        enableOnlineTesting: true,
                        externalLocationGrouping: {
                            enabled: true,
                            fieldKey: 'kigaId',
                        },
                        subjectsPerExperiment: 4,

                        generalConditions: [],
                        conditionsByAgeFrame: [
                            {
                                "ageFrame" : { "start" : 360, "end" : 35640 },
                                "conditions" : [
                                    {
                                        "fieldKey" : "languages",
                                        "values" : [ "GERMAN_ID" ]
                                    }
                                ]
                            },
                            {
                                "ageFrame" : { "start" : 360, "end" : 9000 },
                                "conditions" : [
                                    {
                                        "fieldKey": "fruits",
                                        "values": [
                                            "BANANA_ID", "GRAPE_ID"
                                        ]
                                    },
                                    {
                                        "fieldKey" : "languages",
                                        "values" : [ "ENGLISH_ID" ]
                                    }
                                ] 
                            }
                        ],
                    }
                ]
            }
        };

        var STUDY_02 = {
            _id: 'STUDY_02',
            state: {
                researchGroupIds: [
                    'RG_ALPHA',
                ],
                selectionSettingsBySubjectType: [
                    {
                        subjectRecordType: 'child',
                        enableOnlineTesting: true,
                        externalLocationGrouping: {
                            enabled: true,
                            fieldKey: 'kigaId',
                        },
                        subjectsPerExperiment: 4,

                        generalConditions: [],
                        conditionsByAgeFrame: [
                            {
                                "ageFrame" : { "start" : 360, "end" : 720 },
                                "conditions" : [
                                    {
                                        "fieldKey" : "fruits",
                                        "values" : [ "BANANA_ID" ]
                                    }
                                ] 
                            }
                        ],
                    }
                ]
            }
        };


        var stage = AddSubjectTestabilityFieldsStage({
            experimentVariant: 'inhouse',
            timeFrameStart: new Date('2020-12-31T23:00:00.000Z'),
            timeFrameEnd: new Date('2021-05-31T21:59:59.999Z'),

            studyRecords: [ STUDY_01, STUDY_02 ],
            subjectRecordTypeRecord: {
                type: 'child',
                state: { settings: { subChannelFields: { scientific: [
                    {
                        key: 'dateOfBirth',
                        type: 'DateOnlyServerSide',
                        displayName: 'Geburtsdatum',
                        props: { isSpecialAgeFrameField: true }
                    },
                    {
                        key: 'biologicalGender',
                        type: 'BiologicalGender',
                        displayName: 'Geschlecht',
                        props: {}
                    },
                    {
                        key: 'languages',
                        type: 'HelperSetItemIdList',
                        displayName: 'Sprachen',
                        props: { setId: 'LANGSET_ID' }
                    },
                    {
                        key: 'fruits',
                        type: 'HelperSetItemIdList',
                        displayName: 'Fruechte',
                        props: { setId: 'FRUITSET_ID' }
                    },

                    {
                        key: 'kigaId',
                        type: 'ForeignId',
                        displayName: 'Kindergarten',
                        props: {
                            collection: 'location',
                            recordType: 'kiga',
                            constraints: {}
                        }
                    },
                ]}}}
            },

            enabledAgeFrames: [
                '/STUDY_01/360_9000',
                '/STUDY_02/360_720'
            ],
            enabledValues: {
                '/STUDY_01/360_9000/conditions/languages': [ 'ENGLISH_ID' ],
                '/STUDY_01/360_9000/conditions/fruits': [ 'BANANA_ID' ],
                
                '/STUDY_02/360_720/conditions/fruits': [ 'BANANA_ID' ],
            }
        });

        console.dir(stage, { depth: null });
        snapshot(stage);
    })
})
