'use strict';
//require('debug').enable('psydb*');
var {
    expect, inline, jsonify, ejson, omit,
    ObjectId, RootHandler
} = require('./utils');

describe('experiment/create-manual inhouse', function () {
    var db;
    beforeEach(async function () {
        await this.restore('2022-12-10__1635-wkprc');
        db = this.getDbHandle();
    });

    it('can create experiment', async function () {
        var [ sendMessage ] = this.createMessenger({ RootHandler });

        var studyId = await this.getId('study', {
            shorthand: 'Childlab A'
        });
        
        var locationId = await this.getId('location', {
            name: 'Pinguin'
        });
        
        var subjectId = await this.getId('subject', {
            firstname: 'Paul'
        }, { subChannels: true });
        
        var labTeamId = await this.getId('experimentOperatorTeam', {
            name: 'Picard, Jean-Luc'
        });
        
        var koaContext = await sendMessage({
            type: 'experiment/create-manual',
            timezone: 'Europe/Berlin',
            payload: jsonify({
                labMethod: 'inhouse',
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
                labTeamId,
            })
        });

        var { body } = koaContext.response;
        var [ experimentUpdate, subjectUpdate ] = body.data;

        var experiment = await this.getRecord('experiment', {
            _id: experimentUpdate.channelId
        });
        //console.dir(ejson(experiment), { depth: null });
        
        expect(experiment).to.containSubset({
            type: 'manual',
            realType: 'inhouse'
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
        expect(subject.type).to.equal('child');
        
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
        expect(String(participations[0].experimentId))
            .to.equal(String(experiment._id));
        expect(ejson(omit({
            fromItems: participations,
            paths: [ '_id', 'experimentId' ]
        }))).toMatchSnapshot()


        //expect().toMatchSnapshot();
    })    
})
