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

describe('experiment/patch-manual inhouse', function () {
    var db;
    beforeEach(async function () {
        await this.restore('2023-07-05__1444-fs-wkprc');
        db = this.getDbHandle();
    });

    it('same data is effectively a no-op', async function () {
        var [ sendMessage ] = this.createMessenger({ RootHandler });
        var experimentId = ObjectId('649f13b04a05950c3a12f876');

        var locationId = await this.getId('location', {
            name: 'Pinguin'
        });
        var subjectId = await this.getId('subject', {
            firstname: 'Alice'
        }, { subChannels: true });
        
        var labOperatorAliceId = await this.getId('personnel', {
            firstname: 'Alice',
            lastname: 'ChildLab Experimenter'
        }, { subChannels: true });

        var originalSubject = omitRohrpostMetadata({
            from: await this.getRecord('subject', { _id: subjectId }),
        });
        var originalExperiment = omitRohrpostMetadata({
            from: await this.getRecord('experiment', { _id: experimentId }),
        });
        
        await sendMessage({
            type: 'experiment/patch-manual',
            timezone: 'Europe/Berlin',
            payload: jsonify({
                experimentId,
                interval: {
                    start: new Date('2023-06-06T22:00:00Z'),
                    end: new Date('2023-06-06T22:00:00Z'),
                },
                locationId,
                subjectData: [
                    {
                        subjectId,
                        status: 'participated',
                        excludeFromMoreExperimentsInStudy: false,
                    }
                ],
                labOperatorIds: [
                    labOperatorAliceId,
                ],
            })
        });
        
        var updatedSubject = omitRohrpostMetadata({
            from: await this.getRecord('subject', { _id: subjectId }),
        });
        var updatedExperiment = omitRohrpostMetadata({
            from: await this.getRecord('experiment', { _id: experimentId }),
        });

        expect(ejson(updatedSubject)).to.deep.eql(ejson(originalSubject));
        expect(ejson(updatedExperiment)).to.deep.eql(ejson(originalExperiment));
    });

    it('can replace everything', async function () {
        var [ sendMessage ] = this.createMessenger({ RootHandler });
        var experimentId = ObjectId('649f13b04a05950c3a12f876');

        var locationId = await this.getId('location', {
            name: 'Blume'
        });
        
        var subjectBobId = await this.getId('subject', {
            firstname: 'Bob'
        });
        
        var labOperatorBobId = await this.getId('personnel', {
            firstname: 'Bob',
            lastname: 'ChildLab Experimenter'
        });
        
        var originalAlice = omitRohrpostMetadata({
            from: await this.getRecord('subject', { firstname: 'Alice' }),
        });
        var originalBob = omitRohrpostMetadata({
            from: await this.getRecord('subject', { firstname: 'Bob' }),
        });
        var originalExperiment = omitRohrpostMetadata({
            from: await this.getRecord('experiment', { _id: experimentId }),
        });

        var updateValues = {
            interval: {
                start: new Date('2022-12-09T12:30:00Z'),
                end: new Date('2022-12-09T14:00:00Z'),
            },
            locationId,
            subjectData: [
                {
                    subjectId: subjectBobId,
                    status: 'participated',
                    excludeFromMoreExperimentsInStudy: false,
                }
            ],
            labOperatorIds: [
                labOperatorBobId,
            ],
        }

        var koaContext = await sendMessage({
            type: 'experiment/patch-manual',
            timezone: 'Europe/Berlin',
            payload: jsonify({ experimentId, ...updateValues })
        });

        var updatedAlice = omitRohrpostMetadata({
            from: await this.getRecord('subject', { firstname: 'Alice' }),
        });
        var updatedBob = omitRohrpostMetadata({
            from: await this.getRecord('subject', { firstname: 'Bob' }),
        });
        var updatedExperiment = omitRohrpostMetadata({
            from: await this.getRecord('experiment', { _id: experimentId }),
        });

        var experimentPaths = [
            ...keys(updateValues),
            'selectedSubjectIds', 'experimentOperatorIds'
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
                paths: ['subjectData', 'labOperatorIds' ],
            }),
            selectedSubjectIds: [ subjectBobId ],
            experimentOperatorIds: [ labOperatorBobId ],
            subjectData: [{
                invitationStatus: 'scheduled',
                participationStatus: 'participated',
                comment: '',
                subjectId: originalBob._id, 
                subjectType: originalBob.type,
                excludeFromMoreExperimentsInStudy: false,
            }]
        }}));

        expect(ejson(omit({
            from: updatedAlice,
            paths: ['scientific.state.internals.participatedInStudies']
        }))).to.deep.eql(ejson(omit({
            from: originalAlice,
            paths: ['scientific.state.internals.participatedInStudies']
        })));

        expect(
            updatedAlice
            .scientific.state.internals.participatedInStudies.filter(
                sift({ experimentId })
            )
        ).to.have.length(0);
       
        expect(ejson(omit({
            from: updatedBob,
            paths: ['scientific.state.internals.participatedInStudies']
        }))).to.deep.eql(ejson(omit({
            from: originalBob,
            paths: ['scientific.state.internals.participatedInStudies']
        })));

        var newParticipations = (
            updatedBob
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

            experimentOperatorIds: [ labOperatorBobId ],
            status: 'participated',
            excludeFromMoreExperimentsInStudy: false,
            locationId,
            locationType: originalExperiment.state.locationRecordType,
            timestamp: new Date('2022-12-09T12:30:00Z'),
        }));
    })    
})
