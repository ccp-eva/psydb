'use strict';
var { aggregateToArray } = require('@mpieva/psydb-mongo-adapter');
var RootHandler = require('../../../src/');

var jsonify = (that) => (
    JSON.parse(JSON.stringify(that))
);

describe('subject/move-experiments-from-duplicate', function () {
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
            type: 'subject/move-experiments-from-duplicate',
            timezone: 'Europe/Berlin',
            payload: jsonify({
                sourceSubjectId: subjectMalloryId,
                targetSubjectId: subjectBobId,
            })
        });

        var { body } = koaContext.response;

        var malloryExperiments = await aggregateToArray({ db, experiment: [
            { $match: { 'state.selectedSubjectIds': subjectMalloryId }},
            { $project: { _id: true }}
        ]})
        var bobExperiments = await aggregateToArray({ db, experiment: [
            { $match: { 'state.selectedSubjectIds': subjectBobId }},
            { $project: { _id: true }}
        ]})

        console.log({ malloryExperiments });
        console.log({ bobExperiments });
    })
})
