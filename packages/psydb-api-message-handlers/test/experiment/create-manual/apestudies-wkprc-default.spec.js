'use strict';
//require('debug').enable('psydb*');
var {
    expect, inline, jsonify, ejson, omit,
    ObjectId, RootHandler
} = require('./utils');

var { aggregateOne } = require('@mpieva/psydb-mongo-adapter');
var { BaselineDeltas } = require('@mpieva/psydb-mocha-baseline-deltas');

describe('experiment/create-manual apestudies-wkprc-default', function () {
    var db;
    beforeEach(async function () {
        await this.restore('init-apedb-with-dummy-data');
        db = this.getDbHandle();
    });

    it('can create experiment', async function () {
        var [ sendMessage ] = this.createMessenger({ RootHandler });
        var deltas = {
            experiment: BaselineDeltas(),
            subject: BaselineDeltas()
        };
        deltas.experiment.push(await this.fetchAllRecords('experiment'));
        deltas.subject.push(await this.fetchAllRecords('subject'));

        var studyId = await this.getId('study', {
            shorthand: 'TEST'
        });
        
        var locationId = await this.getId('location', {
            name: 'Chimfushi Sanctuary'
        });
        
        var { _id: subjectGroupId } = await aggregateOne({ db, subjectGroup: {
            'subjectType': 'wkprc_chimpanzee',
            'state.locationId': locationId,
            'state.name': 'G1'
        }});

        var subjectStarId = await this.getId('subject', {
            name: 'Star'
        }, { subChannels: true });
        
        var subjectJaroId = await this.getId('subject', {
            name: 'Jaro'
        }, { subChannels: true });
        
        var labOperatorId = await this.getId('personnel', {
            firstname: 'Bob', lastname: 'WKPRC Experimenter'
        }, { subChannels: true });
       
        var now = new Date('2024-12-09T00:00:00.000Z');
        var koaContext = await sendMessage({
            type: 'experiment/create-manual',
            timezone: 'Europe/Berlin',
            payload: jsonify({
                labMethod: 'apestudies-wkprc-default',
                timestamp: now,
                studyId,
                locationId,
                subjectGroupId,
                subjectData: [
                    {
                        subjectId: subjectStarId,
                        role: 'Focal',
                        status: 'participated',
                        excludeFromMoreExperimentsInStudy: false,
                        comment: 'some comment',
                    },
                    {
                        subjectId: subjectJaroId,
                        role: 'Stooge',
                        status: 'participated',
                        excludeFromMoreExperimentsInStudy: false,
                        comment: '',
                    }
                ],
                roomOrEnclosure: 'Outdoor Enclosure',
                experimentName: 'the exp name',
                intradaySeqNumber: 1,
                totalSubjectCount: 10,
                
                labOperatorIds: [ labOperatorId ],
            })
        });

        var { body } = koaContext.response;
        var [ experimentUpdate, subjectUpdate ] = body.data;
        
        deltas.experiment.push(await this.fetchAllRecords('experiment'));
        deltas.subject.push(await this.fetchAllRecords('subject'));

        deltas.experiment.test({ expected: [{
            '_id': BaselineDeltas.AnyObjectId(),
            '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
            'type': 'manual',
            'realType': 'apestudies-wkprc-default',
            'state': {
                'color': '#000000',
                'experimentName': 'the exp name',
                'experimentOperatorIds': [ labOperatorId ],
                'experimentOperatorTeamId': null,
                'generalComment': '',
                'interval': {
                    'start': { '$date': '2024-12-09T00:00:00.000Z' },
                    'end': { '$date': '2024-12-09T00:00:00.000Z' }
                },
                'intradaySeqNumber': 1,
                'isCanceled': false,
                'isPostprocessed': true,
                'locationId': locationId,
                'locationRecordType': 'wkprc_apeLocation',
                'roomOrEnclosure': 'Outdoor Enclosure',
                'selectedSubjectGroupIds': [],
                'selectedSubjectIds': [
                    subjectStarId,
                    subjectJaroId
                ],
                'seriesId': BaselineDeltas.AnyObjectId(),
                'studyId': studyId,
                'studyRecordType': 'wkprc_study',
                'subjectData': [
                    {
                        'invitationStatus': 'scheduled',
                        'participationStatus': 'participated',
                        'excludeFromMoreExperimentsInStudy': false,
                        'comment': 'some comment',
                        'subjectType': 'wkprc_chimpanzee',
                        'subjectId': subjectStarId,
                        'role': 'Focal',
                        'subjectGroupId': subjectGroupId
                    },
                    {
                        'invitationStatus': 'scheduled',
                        'participationStatus': 'participated',
                        'excludeFromMoreExperimentsInStudy': false,
                        'comment': '',
                        'subjectType': 'wkprc_chimpanzee',
                        'subjectId': subjectJaroId,
                        'role': 'Stooge',
                        'subjectGroupId': subjectGroupId
                    }
                ],
                'subjectGroupId': subjectGroupId,
                'totalSubjectCount': 10
            }

        }], asFlatEJSON: true });

        console.dir(ejson([
            deltas.subject.getCurrent()
        ]), { depth: null });

        var expectedParticipationProps = {
            _id: BaselineDeltas.AnyObjectId(),
            type: 'manual',
            realType: 'apestudies-wkprc-default',
            studyId: studyId,
            studyType: 'wkprc_study',
            timestamp: { '$date': '2024-12-09T00:00:00.000Z' },
            status: 'participated',
            excludeFromMoreExperimentsInStudy: false,
            experimentId: experimentUpdate.channelId,
            locationId: locationId,
            locationType: 'wkprc_apeLocation',
            experimentOperatorIds: [ labOperatorId ],
            subjectGroupId: subjectGroupId,
            experimentName: 'the exp name',
            roomOrEnclosure: 'Outdoor Enclosure',
            intradaySeqNumber: 1,
            totalSubjectCount: 10
        }

        deltas.subject.test({ expected: [
            { 'scientific': {
                '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
                'state/internals/participatedInStudies': [{
                    ...expectedParticipationProps, role: 'Stooge',
                }]
            }},
            { 'scientific': {
                '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
                'state/internals/participatedInStudies': [{ 
                    ...expectedParticipationProps, role: 'Focal',
                }]
            }},
        ], asFlatEJSON: true });
    })    
})
