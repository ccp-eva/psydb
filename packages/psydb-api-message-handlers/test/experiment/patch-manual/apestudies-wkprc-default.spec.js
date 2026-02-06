'use strict';
//require('debug').enable('psydb*');
var {
    expect, inline, jsonify, ejson, keys, omit, only, pathify, sift,
    ObjectId, RootHandler
} = require('./utils');

var omitRohrpostMetadata = ({ from }) => omit({
    from,
    paths: [
        '_rohrpostMetadata',
        'gdpr._rohrpostMetadata',
        'scientific._rohrpostMetadata'
    ]
});

describe('experiment/patch-manual apestudies-wkprc-default', function () {
    var db;
    beforeEach(async function () {
        await this.restore('2023-07-05__1444-fs-wkprc');
        db = this.getDbHandle();
    });

    it('same data is effectively a no-op', async function () {
        var [ sendMessage ] = this.createMessenger({ RootHandler });
        var experimentId = ObjectId('6478fdd95ac80fc88d255382');

        var originals = await getRecords(this);
        var {
            locationZooLeipzigId,
            subjectJaroId,
            labOperatorAliceId,
            labOperatorCharlieId,
            studyTopicTestId,
        } = idsof(originals);

        var originalExperiment = omitRohrpostMetadata({
            from: await this.getRecord('experiment', { _id: experimentId }),
        });
        
        await sendMessage({
            type: 'experiment/patch-manual',
            timezone: 'Europe/Berlin',
            payload: jsonify({
                experimentId,
                timestamp: new Date('2023-06-05T22:00:00Z'),
                locationId: locationZooLeipzigId,
                subjectData: [
                    {
                        subjectId: subjectJaroId,
                        status: 'participated',
                        excludeFromMoreExperimentsInStudy: false,
                    }
                ],
                labOperatorIds: [
                    labOperatorAliceId,
                    labOperatorCharlieId,
                ],

                studyTopicIds: [ studyTopicTestId ],
                experimentName: 'asdf'
            })
        });
        
        var updated = await getRecords(this);

        var updatedExperiment = omitRohrpostMetadata({
            from: await this.getRecord('experiment', { _id: experimentId }),
        });

        expect(ejson(updated.subjectJaro))
            .to.deep.eql(ejson(originals.subjectJaro));

        expect(ejson(updatedExperiment))
            .to.deep.eql(ejson(originalExperiment));
    });

    it('can replace everything', async function () {
        var [ sendMessage ] = this.createMessenger({ RootHandler });
        var experimentId = ObjectId('6478fdd95ac80fc88d255382');
        
        var originals = await getRecords(this);
        var {
            locationZooRostockId,
            subjectStarId,
            labOperatorBobId,
            labOperatorMalloryId,
            studyTopicCollaborationId,
            studyTopicSelfAwarenessId,
        } = idsof(originals);

        var originalExperiment = omitRohrpostMetadata({
            from: await this.getRecord('experiment', { _id: experimentId }),
        });

        var updateValues = {
            timestamp: new Date('2022-12-09T12:30:00Z'),
            locationId: locationZooRostockId,
            subjectData: [
                {
                    subjectId: subjectStarId,
                    status: 'participated',
                    excludeFromMoreExperimentsInStudy: false,
                }
            ],
            labOperatorIds: [
                labOperatorBobId,
                labOperatorMalloryId,
            ],
            studyTopicIds: [
                studyTopicCollaborationId,
                studyTopicSelfAwarenessId,
            ],
            experimentName: 'the exp name'
        }

        var koaContext = await sendMessage({
            type: 'experiment/patch-manual',
            timezone: 'Europe/Berlin',
            payload: jsonify({ experimentId, ...updateValues })
        });

        var updated = await getRecords(this);

        var updatedExperiment = omitRohrpostMetadata({
            from: await this.getRecord('experiment', { _id: experimentId }),
        });

        var experimentPaths = [
            ...keys(updateValues),
            'selectedSubjectIds', 'experimentOperatorIds', 'interval'
        ].map(it => `state.${it}`);

        expect(ejson(omit({
            from: updatedExperiment,
            paths: experimentPaths
        }))).to.deep.eql(ejson(omit({
            from: originalExperiment,
            paths: experimentPaths
        })));

        expect(ejson(only({
            from: updatedExperiment,
            paths: experimentPaths
        }))).to.deep.eql(ejson({ state: {
            ...omit({
                from: updateValues,
                paths: ['subjectData', 'labOperatorIds', 'timestamp' ],
            }),
            interval: {
                start: new Date('2022-12-09T12:30:00Z'),
                end: new Date('2022-12-09T12:30:00Z')
            },
            selectedSubjectIds: [ subjectStarId ],
            experimentOperatorIds: [ labOperatorBobId, labOperatorMalloryId ],
            subjectData: [{
                invitationStatus: 'scheduled',
                participationStatus: 'participated',
                comment: '',
                subjectId: originals.subjectStar._id, 
                subjectType: originals.subjectStar.type,
                excludeFromMoreExperimentsInStudy: false,
            }],
        }}));

        expect(ejson(omit({
            from: updated.subjectJaro,
            paths: ['scientific.state.internals.participatedInStudies']
        }))).to.deep.eql(ejson(omit({
            from: originals.subjectJaro,
            paths: ['scientific.state.internals.participatedInStudies']
        })));

        expect(
            updated.subjectJaro
            .scientific.state.internals.participatedInStudies.filter(
                sift({ experimentId })
            )
        ).to.have.length(0);
       
        expect(ejson(omit({
            from: updated.subjectStar,
            paths: ['scientific.state.internals.participatedInStudies']
        }))).to.deep.eql(ejson(omit({
            from: originals.subjectStar,
            paths: ['scientific.state.internals.participatedInStudies']
        })));

        var newParticipations = (
            updated.subjectStar
            .scientific.state.internals.participatedInStudies.filter(
                sift({ experimentId })
            )
        );
        expect(newParticipations).to.have.length(1);
        expect(ejson(omit({
            from: newParticipations[0],
            paths: [ '_id' ]
        }))).to.deep.eql(ejson({
            experimentId,
            type: originalExperiment.type,
            realType: originalExperiment.realType,
            
            studyId: originalExperiment.state.studyId,
            studyType: originalExperiment.state.studyRecordType,

            experimentOperatorIds: [ labOperatorBobId, labOperatorMalloryId ],
            status: 'participated',
            excludeFromMoreExperimentsInStudy: false,
            locationId: originals.locationZooRostock._id,
            locationType: originals.locationZooRostock.type,
            timestamp: new Date('2022-12-09T12:30:00Z'),
            
            studyTopicIds: [
                studyTopicCollaborationId,
                studyTopicSelfAwarenessId,
            ],
            experimentName: 'the exp name'
        }));
    });

    var getRecords = async (ctx, options = {}) => {
        var { includeRohrpostMetadata = false } = options;
        var out = {
            locationZooLeipzig: await ctx.getRecord('location', {
                name: 'Zoo Leipzig'
            }),
            locationZooRostock: await ctx.getRecord('location', {
                name: 'Zoo Rostock'
            }),

            subjectJaro: await ctx.getRecord('subject', {
                name: 'Jaro'
            }),
            subjectStar: await ctx.getRecord('subject', {
                name: 'Star'
            }),

            labOperatorAlice: await ctx.getRecord('personnel', {
                firstname: 'Alice',
                lastname: 'WKPRC Experimenter'
            }),
            labOperatorBob: await ctx.getRecord('personnel', {
                firstname: 'Bob',
                lastname: 'WKPRC Experimenter'
            }),
            labOperatorCharlie: await ctx.getRecord('personnel', {
                firstname: 'Charlie',
                lastname: 'WKPRC Experimenter'
            }),
            labOperatorMallory: await ctx.getRecord('personnel', {
                firstname: 'Mallory',
                lastname: 'WKPRC Experimenter'
            }),
            
            studyTopicTest: await ctx.getRecord('studyTopic', {
                name: 'Test-Topic'
            }),
            studyTopicCollaboration: await ctx.getRecord('studyTopic', {
                name: 'Collaboration'
            }),
            studyTopicSelfAwareness: await ctx.getRecord('studyTopic', {
                name: 'Self-Awareness'
            }),
        }
        if (!includeRohrpostMetadata) {
            for (var key of keys(out)) {
                out[key] = omitRohrpostMetadata({ from: out[key] });
            }
        }
        return out;
    }

    var idsof = (bag) => keys(bag).reduce((acc, key) => ({
        ...acc,
        [`${key}Id`]: bag[key]._id
    }), {});
})
