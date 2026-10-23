'use strict';
var { BaselineDeltas } = require('@mpieva/psydb-mocha-baseline-deltas');
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');
var { KOA_BODYDATA } = require('@mpieva/psydb-api-mocha-test-tools/utils');
var { jsonify } = require('@mpieva/psydb-core-utils');
var { getContent: loadCSV } = require('@mpieva/psydb-fixtures/csv');
var apiConfig = require('@mpieva/psydb-api-config');

var RootHandler = require('../../../../src');

describe('csv-import/subject-contact-history/create append comment', function () {
    var subjectType = 'catOwner';

    var db, ids;
    beforeEach(async function () {
        ids = await this.restore([
            'init-minimal',
            'tiny_2026-10-22__1635__cats-01-helper-sets-and-crts',
            'tiny_2026-10-22__1635__cats-02-roles-and-research-groups',
            'tiny_2026-10-22__1635__cats-03-personnel',
            'tiny_2026-10-22__1635__cats-04-orgs-and-locations',
            'tiny_2026-10-22__1635__cats-05-subjects',
        ], { gatherIds: true });

        db = this.getDbHandle();
        await db.collection('subject').updateOne(
            { _id: ids(/Homeownership, Banking/) },
            { $set: { 'scientific.state.comment': 'Existing comment' }}
        );
    });

    var runImport = async (that, flagValue) => {
        var [ send ] = that.createMessenger({
            RootHandler,
            login: { email: 'root@example.com' },
            apiConfig: {
                ...apiConfig,
                dev_appendContactHistoryCommentToSubject: flagValue
            },
        });

        var { _id: fileId } = await that.createFakeFileUpload({
            db, buffer: loadCSV('subject-contact-history-csv/simple'),
        });

        var deltas = BaselineDeltas();
        deltas.push(await fetchSubjectComments(that));

        await KOA_BODYDATA(send({
            type: 'csv-import/subject-contact-history/create',
            timezone: 'Europe/Berlin',
            payload: jsonify({ subjectType, fileId })
        }));

        deltas.push(await fetchSubjectComments(that));
        return deltas;
    }

    it('de', async function () {
        var deltas = await runImport(this, 'de');

        // NOTE: order as in dump; Maintenance has no comment in csv
        deltas.test({ expected: {
            '/0/comment': [
                'Existing comment',
                '[E-Mail 04.03.2026 09:15: "Initial invitation newsletter"]',
            ].join('\n'),
            '/1/comment': [
                '[Telefon 12.05.2026 14:30: "Follow-up regarding spring study"]',
                '[Telefon 18.09.2026 16:45: "Appointment confirmed"]',
            ].join('\n'),
            '/4/comment': (
                '[E-Mail 20.10.2026 08:05: "Asked about availability in November"]'
            ),
        }, asFlatEJSON: true });
    });

    it('true falls back to en', async function () {
        var deltas = await runImport(this, true);

        deltas.test({ expected: {
            '/0/comment': [
                'Existing comment',
                '[E-Mail 03/04/2026 9:15 AM: "Initial invitation newsletter"]',
            ].join('\n'),
            '/1/comment': [
                '[Phone 05/12/2026 2:30 PM: "Follow-up regarding spring study"]',
                '[Phone 09/18/2026 4:45 PM: "Appointment confirmed"]',
            ].join('\n'),
            '/4/comment': (
                '[E-Mail 10/20/2026 8:05 AM: "Asked about availability in November"]'
            ),
        }, asFlatEJSON: true });
    });

    it('false leaves subject comments untouched', async function () {
        // NOTE: baseline deltas cant express "no changes"
        var before = await fetchSubjectComments(this);
        await runImport(this, false);
        var after = await fetchSubjectComments(this);
        expect(after).to.deep.eql(before);
    });
});

var fetchSubjectComments = async (that) => {
    var subjects = await that.fetchAllRecords('subject', {
        type: 'catOwner'
    });
    return subjects.map(it => ({
        _id: it._id,
        comment: it.scientific.state.comment
    }));
}
