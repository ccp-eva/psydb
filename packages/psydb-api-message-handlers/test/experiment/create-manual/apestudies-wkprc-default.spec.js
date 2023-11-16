'use strict';
require('debug').enable('psydb*');
var {
    expect, inline, jsonify, ejson, omit,
    ObjectId, RootHandler
} = require('./utils');

describe('experiment/create-manual apestudies-wkprc-default', function () {
    var db;
    beforeEach(async function () {
        await this.restore('2022-12-10__1635-wkprc');
        db = this.getDbHandle();
    });

    it('can create experiment', async function () {
        var [ sendMessage ] = this.createMessenger({ RootHandler });

        var studyId = await this.getId('study', {
            shorthand: 'WKPRC TEST A'
        });
        
        var locationId = await this.getId('location', {
            name: 'Schimpansen Aussengehege'
        });
        
        var subjectId = await this.getId('subject', {
            name: 'Star'
        }, { subChannels: true });
        
        var labOperatorId = await this.getId('personnel', {
            firstname: 'bob'
        }, { subChannels: true });
        
        var studyTopicIds = [
            await this.getId('studyTopic', {
                name: 'Collaboration'
            }),
            await this.getId('studyTopic', {
                name: 'Collaboration'
            })
        ];
        
        var koaContext = await sendMessage({
            type: 'experiment/create-manual',
            timezone: 'Europe/Berlin',
            payload: jsonify({
                labMethod: 'apestudies-wkprc-default',
                timestamp: new Date('2022-12-09T12:30:00Z'),
                studyId,
                locationId,
                subjectData: [
                    {
                        subjectId,
                        status: 'participated',
                        excludeFromMoreExperimentsInStudy: false,
                    }
                ],
                labOperatorIds: [ labOperatorId ],
                studyTopicIds,
                experimentName: 'the exp name'
            })
        });

        var { body } = koaContext.response;
        var [ experimentUpdate, subjectUpdate ] = body.data;

        var experiment = await this.getRecord('experiment', {
            _id: experimentUpdate.channelId
        });
        //console.dir(ejson(experiment), { depth: null });
        
        expect(ejson(experiment)).to.containSubset({
            type: 'manual',
            realType: 'apestudies-wkprc-default'
        });

        expect(ejson(omit({
            from: experiment.state,
            paths: [ 'seriesId' ]
        }))).toMatchSnapshot();

        expect(experiment.state.seriesId).to.be.ok;

        var subject = await this.getRecord('subject', {
            _id: subjectUpdate.channelId
        });
        //console.dir(ejson(subject), { depth: null });
        expect(subject.type).to.equal('schimpansen');
        
        // NOTE: make sure nothing else got messed up
        expect(ejson(subject.gdpr.state)).toMatchSnapshot();
        expect(ejson(omit({
            from: subject.scientific.state,
            paths: [ 'internals.participatedInStudies' ]
        }))).toMatchSnapshot();

        var participations = (
            subject.scientific.state.internals.participatedInStudies
        );
        //console.dir(ejson(participations), { depth: null })
        // NOTE: its stars second experiment since whe already had one
        // on this fixture
        expect(String(participations[1].experimentId))
            .to.equal(String(experiment._id));
        expect(ejson(omit({
            fromItems: participations,
            paths: [ '_id', 'experimentId' ]
        }))).toMatchSnapshot()


        //expect().toMatchSnapshot();
    })    
})
