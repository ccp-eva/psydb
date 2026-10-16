'use strict';
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');
var { aggregateOne } = require('@mpieva/psydb-mongo-adapter');

describe('subject/remove (non-duplicates)', function () {
    var db, ids, sendMessage;
    beforeEach(async function () {
        ids = await this.restore([
            'init-minimal',
            'tiny_2026-10-06__2345__cats-01-helper-sets-and-crts',
            'tiny_2026-10-06__2345__cats-02-roles-and-research-groups',
            'tiny_2026-10-06__2345__cats-03-personnel',
            'tiny_2026-10-06__2345__cats-04-orgs-and-locations',
            'tiny_2026-10-06__2345__cats-05-subjects',
        ], { gatherIds: true });
        db = this.getDbHandle();

        var login = await this.createFakeLogin({ email: 'root@example.com' });
        ([ sendMessage ] = this.createMessenger({ ...login }));
    });

    it('removes subject marked as non-duplicate of another', async function () {
        await sendMessage({
            type: 'subject/mark-non-duplicates', timezone: 'Europe/Berlin',
            payload: { subjectIds: [
                ids(/Pop.*Unique/), ids(/Vellum.*Gram/)
            ]}
        });

        await sendMessage({
            type: 'subject/remove', timezone: 'Europe/Berlin',
            payload: { _id: ids(/Pop.*Unique/) }
        });

        var removed = await aggregateOne({ db, subject: [
            { $match: { _id: ids(/Pop.*Unique/) }},
        ]});
        expect(removed).to.not.exist;

        var other = await aggregateOne({ db, subject: [
            { $match: { _id: ids(/Vellum.*Gram/) }},
        ]});
        expect(
            other.scientific.state.internals.nonDuplicateIds
        ).to.deep.equal([]);
    });
});
