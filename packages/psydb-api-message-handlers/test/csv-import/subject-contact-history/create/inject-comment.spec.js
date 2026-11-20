'use strict';
var { BaselineDeltas } = require('@mpieva/psydb-mocha-baseline-deltas');
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');
var { KOA_BODYDATA } = require('@mpieva/psydb-api-mocha-test-tools/utils');
var { jsonify } = require('@mpieva/psydb-core-utils');
var { getContent: loadCSV } = require('@mpieva/psydb-fixtures/csv');
var apiConfig = require('@mpieva/psydb-api-config');

var RootHandler = require('../../../../src');

describe('csv-import/subject-contact-history/create inject comment', function () {
    var subjectType = 'catOwner';

    var db, ids;
    beforeEach(async function () {
        ids = await this.restore([
            'init-minimal',
            'tiny_2026-10-23__0312__cats-01-helper-sets-and-crts',
            'tiny_2026-10-23__0312__cats-02-roles-and-research-groups',
            'tiny_2026-10-23__0312__cats-03-personnel',
            'tiny_2026-10-23__0312__cats-04-orgs-and-locations',
            'tiny_2026-10-23__0312__cats-05-subjects',
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
                dev_injectContactHistoryCommentIntoSubject: flagValue
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

    it('append de', async function () {
        var deltas = await runImport(this, { mode: 'append', language: 'de' });

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

    it('true means append and en', async function () {
        var deltas = await runImport(this, true);

        // NOTE: order as in dump; Maintenance has no comment in csv
        deltas.test({ expected: {
            '/0/comment': [
                'Existing comment',
                '[E-Mail Mar 4th, 2026 09:15: "Initial invitation newsletter"]',
            ].join('\n'),
            '/1/comment': [
                '[Phone May 12th, 2026 14:30: "Follow-up regarding spring study"]',
                '[Phone Sep 18th, 2026 16:45: "Appointment confirmed"]',
            ].join('\n'),
            '/4/comment': (
                '[E-Mail Oct 20th, 2026 08:05: "Asked about availability in November"]'
            ),
        }, asFlatEJSON: true });
    });

    it('prepend de', async function () {
        var deltas = await runImport(this, { mode: 'prepend', language: 'de' });

        // NOTE: newest first
        deltas.test({ expected: {
            '/0/comment': [
                '[E-Mail 04.03.2026 09:15: "Initial invitation newsletter"]',
                'Existing comment',
            ].join('\n'),
            '/1/comment': [
                '[Telefon 18.09.2026 16:45: "Appointment confirmed"]',
                '[Telefon 12.05.2026 14:30: "Follow-up regarding spring study"]',
            ].join('\n'),
            '/4/comment': (
                '[E-Mail 20.10.2026 08:05: "Asked about availability in November"]'
            ),
        }, asFlatEJSON: true });
    });

    it('object with mode and language', async function () {
        var deltas = await runImport(this, { mode: 'append', language: 'en' });

        deltas.test({ expected: {
            '/0/comment': [
                'Existing comment',
                '[E-Mail Mar 4th, 2026 09:15: "Initial invitation newsletter"]',
            ].join('\n'),
            '/1/comment': [
                '[Phone May 12th, 2026 14:30: "Follow-up regarding spring study"]',
                '[Phone Sep 18th, 2026 16:45: "Appointment confirmed"]',
            ].join('\n'),
            '/4/comment': (
                '[E-Mail Oct 20th, 2026 08:05: "Asked about availability in November"]'
            ),
        }, asFlatEJSON: true });
    });

    it('object defaults to append and en', async function () {
        var deltas = await runImport(this, {});

        deltas.test({ expected: {
            '/0/comment': [
                'Existing comment',
                '[E-Mail Mar 4th, 2026 09:15: "Initial invitation newsletter"]',
            ].join('\n'),
            '/1/comment': [
                '[Phone May 12th, 2026 14:30: "Follow-up regarding spring study"]',
                '[Phone Sep 18th, 2026 16:45: "Appointment confirmed"]',
            ].join('\n'),
            '/4/comment': (
                '[E-Mail Oct 20th, 2026 08:05: "Asked about availability in November"]'
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
