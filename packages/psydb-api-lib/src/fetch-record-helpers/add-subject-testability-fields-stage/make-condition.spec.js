'use strict';
var expect = require('chai').expect,
    snapshot = require('snap-shot-it'),
    makeCondition = require('./make-condition');

describe('makeCondition()', function () {
    it('does stuff', () => {
        var cond = makeCondition({
            ageFrameFieldKey: 'dateOfBirth',
            timeFrameStart: new Date('2020-12-31T23:00:00.000Z'),
            timeFrameEnd: new Date('2021-05-31T21:59:59.999Z'),
            studyRecord: {
                _id: 'STUDY_01',
                state: { researchGroupIds: [
                    'RG_ALPHA',
                    'RG_BETA'
                ]}
            },
            subjectTypeSettings: {
                subjectRecordType: 'child',
                generalConditions: [],
                conditionsByAgeFrame: [
                    {
                        "ageFrame" : { "start" : 360, "end" : 35640 },
                        "conditions" : [
                            {
                                "fieldKey" : "languages",
                                "values" : [ "german" ]
                            }
                        ]
                    },
                    {
                        "ageFrame" : { "start" : 360, "end" : 9000 },
                        "conditions" : [
                            {
                                "fieldKey" : "languages",
                                "values" : [ "english" ]
                            }
                        ] 
                    }
                ],
                enableOnlineTesting: true,
                externalLocationGrouping: {
                    enabled: true,
                    fieldKey: 'kigaId',
                },
                subjectsPerExperiment: 4
            }
        });

        console.dir(cond, { depth: null });
        snapshot(cond);
    })
})
