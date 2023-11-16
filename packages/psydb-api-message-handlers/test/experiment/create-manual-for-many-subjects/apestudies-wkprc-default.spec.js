'use strict';
require('debug').enable('psydb*');
var {
    expect, inline, jsonify, ejson, omit,
    ObjectId, RootHandler
} = require('./utils');

describe(inline`
    experiment/create-manual-for-many-subjects apestudies-wkprc-default
`, function () {
    var db;
    beforeEach(async function () {
        await this.restore('2022-12-10__1635-wkprc');
        db = this.getDbHandle();
    });

    it('can create experiments', async function () {
        var [ sendMessage ] = this.createMessenger({ RootHandler });

        var studyId = await this.getId('study', {
            shorthand: 'WKPRC TEST A'
        });
        
        var locationId = await this.getId('location', {
            name: 'Schimpansen Aussengehege'
        });
        
        var subjectStarId = await this.getId('subject', {
            name: 'Star'
        }, { subChannels: true });

        var subjectSarahId = await this.getId('subject', {
            name: 'Sarah'
        }, { subChannels: true });
        
        var labOperatorId = await this.getId('personnel', {
            firstname: 'bob'
        }, { subChannels: true });
        
        var studyTopicIds = [
            await this.getId('studyTopic', {
                name: 'Collaboration'
            }),
            await this.getId('studyTopic', {
                name: 'Self-Awareness'
            })
        ];
        
        var koaContext = await sendMessage({
            type: 'experiment/create-manual-for-many-subjects',
            timezone: 'Europe/Berlin',
            payload: jsonify({
                labMethod: 'apestudies-wkprc-default',
                studyId,
                locationId,
                subjectData: [
                    {
                        subjectId: subjectStarId,
                        status: 'participated',
                        timestamp: new Date('2022-12-09T12:30:00Z'),
                        excludeFromMoreExperimentsInStudy: false,
                    },
                    {
                        subjectId: subjectSarahId,
                        status: 'participated',
                        timestamp: new Date('2022-12-10T14:45:00Z'),
                        excludeFromMoreExperimentsInStudy: false,
                    }
                ],
                labOperatorIds: [ labOperatorId ],
                studyTopicIds,
                experimentName: 'the exp name'
            })
        });

        var { body } = koaContext.response;
        var [ 
            starExperimentUpdate,
            sarahExperimentUpdate,
            starSubjectUpdate,
            sarahSubjectUpdate,
        ] = body.data;

        var starExperiment = await this.getRecord('experiment', {
            _id: starExperimentUpdate.channelId
        });
        //console.dir(ejson(starExperiment), { depth: null });
        
        expect(ejson(starExperiment)).to.containSubset({
            type: 'manual',
            realType: 'apestudies-wkprc-default'
        });

        expect(ejson(omit({
            from: starExperiment.state,
            paths: [ 'seriesId' ]
        }))).toMatchSnapshot();

        expect(starExperiment.state.seriesId).to.be.ok;

        /////////////////////////
        var sarahExperiment = await this.getRecord('experiment', {
            _id: sarahExperimentUpdate.channelId
        });
        //console.dir(ejson(sarahExperiment), { depth: null });
        
        expect(ejson(sarahExperiment)).to.containSubset({
            type: 'manual',
            realType: 'apestudies-wkprc-default'
        });

        expect(ejson(omit({
            from: sarahExperiment.state,
            paths: [ 'seriesId' ]
        }))).toMatchSnapshot();

        expect(sarahExperiment.state.seriesId).to.be.ok;

        ///////////////////////////

        var starSubject = await this.getRecord('subject', {
            _id: starSubjectUpdate.channelId
        });
        //console.dir(ejson(starSubject), { depth: null });
        expect(starSubject.type).to.equal('schimpansen');
        
        // NOTE: make sure nothing else got messed up
        expect(ejson(starSubject.gdpr.state)).toMatchSnapshot();
        expect(ejson(omit({
            from: starSubject.scientific.state,
            paths: [ 'internals.participatedInStudies' ]
        }))).toMatchSnapshot();

        var starParticipations = (
            starSubject.scientific.state.internals.participatedInStudies
        );
        //console.dir(ejson(starParticipations), { depth: null })
        // NOTE: its stars second experiment since whe already had one
        // on this fixture
        expect(String(starParticipations[1].experimentId))
            .to.equal(String(starExperiment._id));
        expect(ejson(omit({
            fromItems: starParticipations,
            paths: [ '_id', 'experimentId' ]
        }))).toMatchSnapshot()

        //////////////////

        var sarahSubject = await this.getRecord('subject', {
            _id: sarahSubjectUpdate.channelId
        });
        //console.dir(ejson(sarahSubject), { depth: null });
        expect(sarahSubject.type).to.equal('schimpansen');
        
        // NOTE: make sure nothing else got messed up
        expect(ejson(sarahSubject.gdpr.state)).toMatchSnapshot();
        expect(ejson(omit({
            from: sarahSubject.scientific.state,
            paths: [ 'internals.participatedInStudies' ]
        }))).toMatchSnapshot();

        var sarahParticipations = (
            sarahSubject.scientific.state.internals.participatedInStudies
        );
        //console.dir(ejson(sarahParticipations), { depth: null })
        // NOTE: its sarahs second experiment since whe already had one
        // on this fixture
        expect(String(sarahParticipations[1].experimentId))
            .to.equal(String(sarahExperiment._id));
        expect(ejson(omit({
            fromItems: sarahParticipations,
            paths: [ '_id', 'experimentId' ]
        }))).toMatchSnapshot()
    })    
})
