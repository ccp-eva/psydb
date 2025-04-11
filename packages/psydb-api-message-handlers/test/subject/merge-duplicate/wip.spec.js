'use strict';
var { ejson } = require('@mpieva/psydb-core-utils');
var {
    aggregateToArray,
    aggregateOne,
    ObjectId,
} = require('@mpieva/psydb-mongo-adapter');

var RootHandler = require('../../../src/');

var jsonify = (that) => (
    JSON.parse(JSON.stringify(that))
);

describe('subject/merge-duplicate', function () {
    var db;
    beforeEach(async function () {
        await this.restore('2025-02-21__0811');
        db = this.getDbHandle();
    });

    it('does the thing', async function () {
        var login = await this.createFakeLogin({ email: 'root@example.com' });
        var [ sendMessage ] = this.createMessenger({ RootHandler, ...login });

        var subjectMalloryId = await this.getId('subject', {
            firstname: 'Mallory', lastname: 'Test Kind'
        }, { subChannels: true });

        var subjectBobId = await this.getId('subject', {
            firstname: 'Bob', lastname: 'Test Kind'
        }, { subChannels: true });
        
        
        var koaContext = await sendMessage({
            type: 'subject/merge-duplicate',
            timezone: 'Europe/Berlin',
            payload: jsonify({
                sourceSubjectId: subjectMalloryId,
                targetSubjectId: subjectBobId,
            })
        });

        var { body } = koaContext.response;

        var mallorySubject = await aggregateOne({ db, subject: [
            { $match: { _id: subjectMalloryId }},
        ]});
        var bobSubject = await aggregateOne({ db, subject: [
            { $match: { _id: subjectBobId }},
        ]});

        var malloryExperiments = await aggregateToArray({ db, experiment: [
            { $match: { 'state.selectedSubjectIds': subjectMalloryId }},
            { $project: { _id: true }}
        ]})
        var bobExperiments = await aggregateToArray({ db, experiment: [
            { $match: { 'state.selectedSubjectIds': subjectBobId }},
            { $project: { _id: true }}
        ]})

        console.dir(ejson({ mallorySubject }), { depth: null });
        console.dir(ejson({ bobSubject }), { depth: null });

        console.log({ malloryExperiments });
        console.log({ bobExperiments });

        var events = await aggregateToArray({ db, rohrpostEvents: [
            { $match: { channelId: ObjectId('67ad549843fa18578e9760fa') }}
        ]});
        
        console.dir(ejson({ events }), { depth: null });
    })
})
