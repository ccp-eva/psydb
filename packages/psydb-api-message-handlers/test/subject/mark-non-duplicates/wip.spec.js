'use strict';
var { ejson } = require('@mpieva/psydb-core-utils');
var {
    aggregateToArray,
    aggregateOne
} = require('@mpieva/psydb-mongo-adapter');

var RootHandler = require('../../../src/');

var jsonify = (that) => (
    JSON.parse(JSON.stringify(that))
);

describe('subject/mark-non-duplicates', function () {
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
            type: 'subject/mark-non-duplicates',
            timezone: 'Europe/Berlin',
            payload: jsonify({
                subjectIds: [ subjectMalloryId, subjectBobId ]
            })
        });

        var { body } = koaContext.response;

        var mallorySubject = await aggregateOne({ db, subject: [
            { $match: { _id: subjectMalloryId }},
        ]});
        var bobSubject = await aggregateOne({ db, subject: [
            { $match: { _id: subjectBobId }},
        ]});

        console.dir(ejson({ mallorySubject }), { depth: null });
        console.dir(ejson({ bobSubject }), { depth: null });
    })
})
