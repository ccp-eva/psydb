'use strict';
var { entries } = require('@mpieva/psydb-core-utils');

module.exports = async (bag) => {
    var { apiKey, driver, cache } = bag;
    var researchGroupId = cache.get('/researchGroup/ChildLab');
    var assistentId = cache.get('/personnel/RA');
    var scientistId = cache.get('/personnel/Scientist');

    var aliceId = cache.get('/personnel/Alice');
    var bobId = cache.get('/personnel/Bob');
    var charlieId = cache.get('/personnel/Charlie');
    var malloryId = cache.get('/personnel/Mallory');

    var studyTopicId = cache.get('/studyTopic/Test-Topic');
    var roomId = cache.get('/location/instituteroom/Pinguin');

    var baseData = [
        { 
            name: 'Test InHouse Studie', shorthand: 'IH-Study',
            variants: [ 'inhouse' ],
            teams: [{ personnelIds: [ aliceId ], color: '#53e782' }]
        },
        { 
            name: 'Test Online-Video Studie', shorthand: 'OV-Study',
            variants: [ 'online-video-call' ],
            teams: [{ personnelIds: [ bobId, charlieId ], color: '#0cd0ba' }]
        },
        {
            name: 'Test Kiga Studie', shorthand: 'Kiga-Study',
            variants: [ 'away-team' ],
            teams: [{ personnelIds: [ malloryId ], color: '#f772e5' }]
        },
    ];

    for (var [ix, it] of entries(baseData)) {
        var { name, shorthand, variants, teams } = it;
        await driver.sendMessage({
            type: 'study/default/create',
            payload: { props: {
                name,
                shorthand,
                researchGroupIds: [
                    researchGroupId,
                ],
                scientistIds: [
                    scientistId,
                ],
                studyTopicIds: [
                    studyTopicId,
                ],
                runningPeriod: {
                    start: '2001-01-01T00:00:00Z',
                    end: null
                },

                enableFollowUpExperiments: false,
                custom: {
                    assistents: [
                        assistentId,
                    ],
                    description: '',
                    novels: [],
                },
                systemPermissions: {
                    isHidden: false,
                    accessRightsByResearchGroup: [
                        { researchGroupId, permission: 'write' }
                    ]
                }
            }},
        }, { apiKey });

        var studyId = cache.addId({
            collection: 'study',
            recordType: 'default',
            as: shorthand
        });

        for (var team of teams) {
            await driver.sendMessage({
                type: 'experimentOperatorTeam/create',
                payload: {
                    studyId,
                    props: team
                },
            }, { apiKey });
        }

        await driver.sendMessage({
            type: 'subjectSelector/create',
            payload: {
                studyId,
                subjectTypeKey: 'child',
                props: {
                    generalConditions: [],
                    isEnabled: true,
                }
            },
        }, { apiKey });

        var subjectSelectorId = cache.addId({
            collection: 'subjectSelector',
            recordType: shorthand,
            as: 'child'
        });

        await driver.sendMessage({
            type: 'ageFrame/create',
            payload: {
                studyId,
                subjectSelectorId,
                subjectTypeKey: 'child',
                props: {
                    conditions: [],
                    interval: {
                        start: { years: 1, months: 0, days: 0 },
                        end: { years: 99, months: 0, days: 0}
                    }
                }
            },
        }, { apiKey });
        
        for (var variant of variants) {
            await driver.sendMessage({
                type: 'experimentVariant/create',
                payload: {
                    type: variant,
                    studyId,
                    props: { isEnabled: true },
                },
            }, { apiKey });

            var experimentVariantId = cache.addId({
                collection: 'experimentVariant',
                recordType: shorthand,
                as: 'variant'
            });

            if (['inhouse', 'online-video-call'].includes(variant)) {
                await driver.sendMessage({
                    type: `experiment-variant-setting/${variant}/create`,
                    payload: {
                        studyId,
                        experimentVariantId,
                        props: {
                            subjectTypeKey: 'child',
                            subjectsPerExperiment: 1,
                            subjectFieldRequirements: [],

                            locations: [{
                                customRecordTypeKey: 'instituteroom',
                                locationId: roomId,
                            }]
                        }
                    }
                }, { apiKey });
            }
            else if (variant === 'away-team') {
                await driver.sendMessage({
                    type: `experiment-variant-setting/${variant}/create`,
                    payload: {
                        studyId,
                        experimentVariantId,
                        props: {
                            subjectTypeKey: 'child',
                            subjectLocationFieldPointer: (
                                '/scientific/state/custom/kigaId'
                            ),
                        }
                    }
                }, { apiKey });
            }
        }
    }
}



