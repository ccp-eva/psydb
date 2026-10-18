'use strict';
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');
var { ObjectId } = require('@mpieva/psydb-mongo-adapter');
var { calculateAge } = require('@mpieva/psydb-common-lib');
var endpoints = require('../../../src');

var endpoint = endpoints.experiment.extendedSearch;

describe('experiment/extendedSearch', function () {
    var db, session;
    before(async function () {
        await this.restore([
            'tiny_2026-07-07__0336__create-followup-awayteam'
        ]);
        db = this.getDbHandle();
        session = await this.createFakeSession('root@example.com');
    });

    var search = async function (specialFilters, extraBody = {}) {
        var koaContext = this.createKoaContext({
            ...session,
            request: {
                headers: { language: 'en', locale: 'en', timezone: 'UTC' },
                body: {
                    specialFilters,
                    columns: [
                        '/_id',
                        '/type',
                        '/state/interval/start',
                        '/state/studyId',
                        '/state/experimentOperatorIds',
                        '/state/selectedSubjectIds',
                        '/_participationStatus',
                        '/state/subjectData', // NOTE: not available
                    ],
                    sort: {
                        column: '/state/interval/start',
                        direction: 'desc'
                    },
                    offset: 0,
                    limit: 50,
                    timezone: 'Europe/Berlin',
                    ...extraBody,
                }
            }
        });

        await endpoint(koaContext, async () => {});
        return koaContext.body.data;
    }

    it('finds experiments without filters', async function () {
        var data = await search.call(this, {});
        var { records, recordsCount, related, displayFieldData } = data;

        var createExpected = (subjectId, participationStatus) => ({
            _id: new ObjectId('6a4c4ff88164a7db5d461b8a'),
            type: 'away-team',
            state: {
                interval: { start: new Date('2026-06-29T22:00:00.000Z') },
                studyId: new ObjectId('64d42dcc443aa279ca4caf12'),
                experimentOperatorIds: [
                    new ObjectId('64d42dca443aa279ca4caec0')
                ],
                selectedSubjectIds: [ new ObjectId(subjectId) ],
                isPostprocessed: false,
            },
            _participationStatus: participationStatus,
        });

        // NOTE: one row per subject
        expect(recordsCount).to.eql(2);
        expect(records).to.eql([
            createExpected('64d42dcb443aa279ca4caee6', 'participated'),
            createExpected('64d42dcb443aa279ca4caeea', 'unknown'),
        ]);

        var subjectLabels = related.relatedRecordLabels.subject;
        expect(subjectLabels['64d42dcb443aa279ca4caee6']).to.exist;
        expect(subjectLabels['64d42dcb443aa279ca4caeea']).to.exist;

        expect(
            related.relatedRecordLabels.study['64d42dcc443aa279ca4caf12']
        ).to.exist;
        expect(displayFieldData.map(it => it.pointer)).to.include.members([
            '/_id', '/type', '/state/interval/start', '/state/studyId'
        ]);
    });

    it('applies special filters', async function () {
        var count = async (specialFilters) => (
            (await search.call(this, specialFilters)).recordsCount
        );

        expect(await count({ labMethods: [ 'away-team' ] })).to.eql(2);
        expect(await count({ labMethods: [ 'inhouse' ] })).to.eql(0);

        // NOTE: experiment starts 2026-06-30 00:00 in Europe/Berlin
        expect(await count({ interval: {
            start: '2026-06-29T22:00:00.000Z',
            end: '2026-06-29T22:00:00.000Z'
        }})).to.eql(2);
        expect(await count({ interval: {
            end: '2026-06-28T22:00:00.000Z'
        }})).to.eql(0);
        expect(await count({ interval: {
            start: '2026-06-30T22:00:00.000Z',
        }})).to.eql(0);

        expect(await count({ studyIds: [] })).to.eql(2);
        expect(await count({ studyIds: [
            '64d42dcc443aa279ca4caf12'
        ]})).to.eql(2);
        expect(await count({ studyIds: [
            '64d42dca443aa279ca4caec0'
        ]})).to.eql(0);

        expect(await count({ subjectIds: [] })).to.eql(2);
        expect(await count({ subjectIds: [
            '64d42dcb443aa279ca4caeea'
        ]})).to.eql(1);
        expect(await count({ subjectIds: [
            '64d42dca443aa279ca4caec0'
        ]})).to.eql(0);

        expect(await count({ isPostprocessed: 'only-true' })).to.eql(0);
    });

    it('adds subject columns for the subject type', async function () {
        var subject = await db.collection('subject').findOne({
            _id: new ObjectId('64d42dcb443aa279ca4caee6')
        });
        var crt = await db.collection('customRecordType').findOne({
            collection: 'subject', type: subject.type
        });
        var field = crt.state.settings.subChannelFields.gdpr.find(it => (
            it.type === 'SaneString' && !it.isRemoved
        ));
        var pointer = `/gdpr/state/custom/${field.key}`;

        var data = await search.call(this, {
            subjectIds: [ '64d42dcb443aa279ca4caee6' ]
        }, {
            subjectType: subject.type,
            columns: [ '/type', `/_subject${pointer}` ],
        });
        var { records, displayFieldData } = data;

        expect(records.length).to.eql(1);
        expect(records[0]._subject).to.eql({
            _id: subject._id,
            type: subject.type,
            gdpr: { state: { custom: {
                [field.key]: subject.gdpr.state.custom[field.key]
            }}},
        });
        expect(displayFieldData.map(it => it.pointer)).to.include.members([
            `/_subject${pointer}`,
            '/_subject/sequenceNumber',
            '/_subject/onlineId',
            '/_subject/scientific/state/comment',
        ]);

        // NOTE: without subject type there are no subject columns
        var data = await search.call(this, {}, {
            columns: [ '/type', `/_subject${pointer}` ],
        });
        expect(data.records[0]._subject).to.not.exist;
    });

    it('adds testing age column for the subject type', async function () {
        var subject = await db.collection('subject').findOne({
            _id: new ObjectId('64d42dcb443aa279ca4caee6')
        });
        var crt = await db.collection('customRecordType').findOne({
            collection: 'subject', type: subject.type
        });
        var { gdpr, scientific } = crt.state.settings.subChannelFields;
        var dobField = [ ...gdpr, ...scientific ].find(it => (
            it.props?.isSpecialAgeFrameField
        ));
        var subChannel = gdpr.includes(dobField) ? 'gdpr' : 'scientific';
        var dob = subject[subChannel].state.custom[dobField.key];

        var data = await search.call(this, {
            subjectIds: [ '64d42dcb443aa279ca4caee6' ]
        }, {
            subjectType: subject.type,
            columns: [ '/type', '/_subject/_testingAge' ],
        });
        var { records, displayFieldData } = data;

        expect(records.length).to.eql(1);
        expect(records[0]._subject).to.eql({
            _id: subject._id,
            type: subject.type,
            _testingAge: calculateAge({
                base: dob,
                relativeTo: new Date('2026-06-29T22:00:00.000Z')
            }),
        });
        expect(displayFieldData.map(it => it.pointer)).to.include(
            '/_subject/_testingAge'
        );
    });

    describe('postprocessed', function () {
        before(async function () {
            await db.collection('experiment').updateOne(
                { _id: new ObjectId('6a4c4ff88164a7db5d461b8a') },
                { $set: {
                    'state.isPostprocessed': true,
                    'state.subjectData.0.participationStatus': 'participated',
                    'state.subjectData.1.participationStatus': (
                        'didnt-participate'
                    ),
                }}
            );
        });

        it('shows all subjects with their status', async function () {
            var data = await search.call(this, {});
            var { records, related } = data;

            expect(records.map(it => ({
                subjectIds: it.state.selectedSubjectIds,
                status: it._participationStatus,
            }))).to.eql([
                {
                    subjectIds: [ new ObjectId('64d42dcb443aa279ca4caee6') ],
                    status: 'participated',
                },
                {
                    subjectIds: [ new ObjectId('64d42dcb443aa279ca4caeea') ],
                    status: 'didnt-participate',
                },
            ]);
            expect(records[0].state.subjectData).to.not.exist;
            expect(records[0]._subjectRows).to.not.exist;

            var subjectLabels = related.relatedRecordLabels.subject;
            expect(subjectLabels['64d42dcb443aa279ca4caee6']).to.exist;
            expect(subjectLabels['64d42dcb443aa279ca4caeea']).to.exist;
        });

        it('filters by subjects regardless of status', async function () {
            var count = async (specialFilters) => (
                (await search.call(this, specialFilters)).recordsCount
            );
            expect(await count({ subjectIds: [
                '64d42dcb443aa279ca4caee6'
            ]})).to.eql(1);
            expect(await count({ subjectIds: [
                '64d42dcb443aa279ca4caeea'
            ]})).to.eql(1);
        });
    });

    describe('upcoming', function () {
        var experimentId = new ObjectId('6a4c4ff88164a7db5d461b8a');
        var original;
        before(async function () {
            original = await db.collection('experiment').findOne({
                _id: experimentId
            });
            var start = new Date(Date.now() + 24 * 60 * 60 * 1000);
            await db.collection('experiment').updateOne(
                { _id: experimentId },
                { $set: { 'state.interval.start': start }}
            );
        });
        after(async function () {
            await db.collection('experiment').updateOne(
                { _id: experimentId },
                { $set: { 'state.interval': original.state.interval }}
            );
        });

        it('never finds upcoming experiments', async function () {
            var data = await search.call(this, {});
            expect(data.recordsCount).to.eql(0);
        });
    });

    describe('canceled', function () {
        before(async function () {
            await db.collection('experiment').updateOne(
                { _id: new ObjectId('6a4c4ff88164a7db5d461b8a') },
                { $set: { 'state.isCanceled': true }}
            );
        });

        it('never finds canceled experiments', async function () {
            var data = await search.call(this, {});
            expect(data.recordsCount).to.eql(0);
            expect(data.records).to.eql([]);
        });
    });
});
