'use strict';
var { BaselineDeltas } = require('@mpieva/psydb-mocha-baseline-deltas');
var { KOA_BODYDATA } = require('@mpieva/psydb-api-mocha-test-tools/utils');
var { jsonify } = require('@mpieva/psydb-core-utils');
var { getContent: loadCSV } = require('@mpieva/psydb-fixtures/csv');

var RootHandler = require('../../../../src');

describe('csv-import/subject-contact-history/create baseline', function () {
    var subjectType = 'catOwner';

    var db, ids, send;
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
        ([ send ] = this.createMessenger({
            RootHandler,
            login: { email: 'root@example.com' }
        }));
    });

    it('simple', async function () {
        var { _id: fileId } = await this.createFakeFileUpload({
            db, buffer: loadCSV('subject-contact-history-csv/simple'),
        });

        var deltas = BaselineDeltas();
        deltas.push(await this.fetchAllRecords('subjectContactHistory'));

        var { csvImportId } = await KOA_BODYDATA(send({
            type: 'csv-import/subject-contact-history/create',
            timezone: 'Europe/Berlin',
            payload: jsonify({ subjectType, fileId })
        }));

        deltas.push(await this.fetchAllRecords('subjectContactHistory'));

        var item = (bag) => {
            var {
                subjectId, type, contactedAt, contactedBy, status, comment
            } = bag;
            return {
                '_id': BaselineDeltas.AnyObjectId(),
                '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
                'type': type,
                'csvImportId': csvImportId,
                'subjectId': subjectId,
                'subjectType': subjectType,
                'timezone': 'Europe/Berlin',
                'contactedBy': contactedBy,
                'contactedAt': new Date(contactedAt),
                'state': { 'status': status, 'comment': comment },
            }
        }

        deltas.test({ expected: {
            '/0': item({
                subjectId: ids(/Homeownership, Banking/),
                type: 'email', status: 'delivered',
                contactedBy: ids(/Cat-RA/),
                contactedAt: '2026-03-04T08:15:00.000Z',
                comment: 'Initial invitation newsletter',
            }),
            '/1': item({
                subjectId: ids(/Doubter, Pita/),
                type: 'phone', status: 'contact-failed',
                contactedBy: ids(/Cat-RA/),
                contactedAt: '2026-05-12T12:30:00.000Z',
                comment: 'Follow-up regarding spring study',
            }),
            '/2': item({
                subjectId: ids(/Maintenance, Snake/),
                type: 'phone', status: 'mailbox',
                contactedBy: ids(/Cat-Scientist/),
                contactedAt: '2026-07-01T08:00:00.000Z',
                comment: '',
            }),
            // NOTE: referenced via onlineId
            '/3': item({
                subjectId: ids(/Doubter, Pita/),
                type: 'phone', status: 'contact-successful',
                contactedBy: ids(/Cat-Scientist/),
                contactedAt: '2026-09-18T14:45:00.000Z',
                comment: 'Appointment confirmed',
            }),
            '/4': item({
                subjectId: ids(/Exit, Switch/),
                type: 'email', status: 'sent',
                contactedBy: ids(/Cat-RA/),
                contactedAt: '2026-10-20T06:05:00.000Z',
                comment: 'Asked about availability in November',
            }),
        }, asFlatEJSON: true });
    });

    it('defaults when time and status cols are missing', async function () {
        var { _id: fileId } = await this.createFakeFileUpload({
            db, buffer: loadCSV(
                'subject-contact-history-csv/simple-no-time-col'
            ),
        });

        var deltas = BaselineDeltas();
        deltas.push(await this.fetchAllRecords('subjectContactHistory'));

        var { csvImportId } = await KOA_BODYDATA(send({
            type: 'csv-import/subject-contact-history/create',
            timezone: 'Europe/Berlin',
            payload: jsonify({ subjectType, fileId })
        }));

        deltas.push(await this.fetchAllRecords('subjectContactHistory'));

        var shared = {
            '_id': BaselineDeltas.AnyObjectId(),
            '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
            'csvImportId': csvImportId,
            'subjectType': subjectType,
            'timezone': 'Europe/Berlin',
        }

        deltas.test({ expected: {
            '/0': {
                ...shared,
                'type': 'email',
                'subjectId': ids(/Homeownership, Banking/),
                'contactedBy': ids(/Cat-RA/),
                'contactedAt': new Date('2026-03-04T11:00:00.000Z'),
                'state': {
                    'status': 'sent',
                    'comment': 'Initial invitation newsletter'
                },
            },
            '/1': {
                ...shared,
                'type': 'phone',
                'subjectId': ids(/Gym, Apple/),
                'contactedBy': ids(/Cat-Scientist/),
                'contactedAt': new Date('2026-05-12T10:00:00.000Z'),
                'state': { 'status': 'sent', 'comment': '' },
            },
        }, asFlatEJSON: true });
    });

    it('contactedBy via sequence number or manual import id; required', async function () {
        var scientistId = ids(/Cat-Scientist/);
        await db.collection('personnel').updateOne(
            { _id: scientistId },
            { $set: { 'scientific.state.manualImportId': 'CATSCI' }}
        );

        var { _id: fileId } = await this.createFakeFileUpload({
            db, buffer: loadCSV(
                'subject-contact-history-csv/with-contacted-by'
            ),
        });

        var deltas = BaselineDeltas();
        deltas.push(await this.fetchAllRecords('subjectContactHistory'));

        var { csvImportId } = await KOA_BODYDATA(send({
            type: 'csv-import/subject-contact-history/create',
            timezone: 'Europe/Berlin',
            payload: jsonify({ subjectType, fileId })
        }));

        deltas.push(await this.fetchAllRecords('subjectContactHistory'));

        var shared = {
            '_id': BaselineDeltas.AnyObjectId(),
            '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
            'csvImportId': csvImportId,
            'subjectType': subjectType,
            'timezone': 'Europe/Berlin',
        }

        // NOTE: lines with empty or unknown staff member are skipped
        deltas.test({ expected: {
            '/0': {
                ...shared,
                'type': 'phone',
                'subjectId': ids(/Homeownership, Banking/),
                'contactedBy': ids(/Cat-RA/),
                'contactedAt': new Date('2026-03-04T08:15:00.000Z'),
                'state': {
                    'status': 'contact-successful',
                    'comment': 'by sequence number'
                },
            },
            '/1': {
                ...shared,
                'type': 'phone',
                'subjectId': ids(/Doubter, Pita/),
                'contactedBy': scientistId,
                'contactedAt': new Date('2026-05-12T12:30:00.000Z'),
                'state': {
                    'status': 'mailbox',
                    'comment': 'by manual import id'
                },
            },
        }, asFlatEJSON: true });
    });
});
