'use strict';
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');
var { ObjectId } = require('@mpieva/psydb-mongo-adapter');
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

    var search = async function (specialFilters) {
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
                        '/state/subjectData', // NOTE: not available
                    ],
                    sort: {
                        column: '/state/interval/start',
                        direction: 'desc'
                    },
                    offset: 0,
                    limit: 50,
                    timezone: 'Europe/Berlin',
                }
            }
        });

        await endpoint(koaContext, async () => {});
        return koaContext.body.data;
    }

    it('finds experiments without filters', async function () {
        var data = await search.call(this, {});
        var { records, recordsCount, related, displayFieldData } = data;

        expect(recordsCount).to.eql(1);
        expect(records).to.eql([{
            _id: new ObjectId('6a4c4ff88164a7db5d461b8a'),
            type: 'away-team',
            state: {
                interval: { start: new Date('2026-06-29T22:00:00.000Z') },
                studyId: new ObjectId('64d42dcc443aa279ca4caf12'),
                experimentOperatorIds: [
                    new ObjectId('64d42dca443aa279ca4caec0')
                ],
                selectedSubjectIds: [
                    new ObjectId('64d42dcb443aa279ca4caee6'),
                    new ObjectId('64d42dcb443aa279ca4caeea'),
                ],
                isCanceled: false,
                isPostprocessed: false,
            }
        }]);

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

        expect(await count({ labMethods: [ 'away-team' ] })).to.eql(1);
        expect(await count({ labMethods: [ 'inhouse' ] })).to.eql(0);

        // NOTE: experiment starts 2026-06-30 00:00 in Europe/Berlin
        expect(await count({ interval: {
            start: '2026-06-29T22:00:00.000Z',
            end: '2026-06-29T22:00:00.000Z'
        }})).to.eql(1);
        expect(await count({ interval: {
            end: '2026-06-28T22:00:00.000Z'
        }})).to.eql(0);
        expect(await count({ interval: {
            start: '2026-06-30T22:00:00.000Z',
        }})).to.eql(0);

        expect(await count({ studyIds: [] })).to.eql(1);
        expect(await count({ studyIds: [
            '64d42dcc443aa279ca4caf12'
        ]})).to.eql(1);
        expect(await count({ studyIds: [
            '64d42dca443aa279ca4caec0'
        ]})).to.eql(0);

        expect(await count({ subjectIds: [] })).to.eql(1);
        expect(await count({ subjectIds: [
            '64d42dcb443aa279ca4caeea'
        ]})).to.eql(1);
        expect(await count({ subjectIds: [
            '64d42dca443aa279ca4caec0'
        ]})).to.eql(0);

        expect(await count({ isCanceled: 'only-false' })).to.eql(1);
        expect(await count({ isCanceled: 'only-true' })).to.eql(0);
        expect(await count({ isPostprocessed: 'only-true' })).to.eql(0);
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

        it('shows only participated subjects', async function () {
            var data = await search.call(this, {});
            var { records, related } = data;

            expect(records.length).to.eql(1);
            expect(records[0].state.selectedSubjectIds).to.eql([
                new ObjectId('64d42dcb443aa279ca4caee6'),
            ]);
            expect(records[0].state.subjectData).to.not.exist;

            var subjectLabels = related.relatedRecordLabels.subject;
            expect(subjectLabels['64d42dcb443aa279ca4caee6']).to.exist;
            expect(subjectLabels['64d42dcb443aa279ca4caeea']).to.not.exist;
        });

        it('filters by participated subjects only', async function () {
            var count = async (specialFilters) => (
                (await search.call(this, specialFilters)).recordsCount
            );
            expect(await count({ subjectIds: [
                '64d42dcb443aa279ca4caee6'
            ]})).to.eql(1);
            expect(await count({ subjectIds: [
                '64d42dcb443aa279ca4caeea'
            ]})).to.eql(0);
        });
    });

    describe('canceled', function () {
        var experimentId = new ObjectId('6a4c4ff88164a7db5d461b8a');
        var subjectIds = [
            new ObjectId('64d42dcb443aa279ca4caee6'),
            new ObjectId('64d42dcb443aa279ca4caeea'),
        ];

        before(async function () {
            await db.collection('experiment').updateOne(
                { _id: experimentId },
                { $set: {
                    'state.isCanceled': true,
                    'state.isPostprocessed': false,
                    'state.selectedSubjectIds': [],
                    'state.subjectData': [],
                }}
            );
            await db.collection('subject').updateMany(
                { _id: { $in: subjectIds }},
                { $push: {
                    'scientific.state.internals.participatedInStudies': {
                        _id: new ObjectId(),
                        experimentId,
                        status: 'canceled-by-participant',
                    }
                }}
            );
        });

        it('shows subjects from participation history', async function () {
            var data = await search.call(this, { isCanceled: 'only-true' });
            var { records, related } = data;

            expect(records.length).to.eql(1);
            expect(records[0].state.selectedSubjectIds).to.have.deep.members(
                subjectIds
            );

            var subjectLabels = related.relatedRecordLabels.subject;
            expect(subjectLabels['64d42dcb443aa279ca4caee6']).to.exist;
            expect(subjectLabels['64d42dcb443aa279ca4caeea']).to.exist;
        });

        it('filters by subjects from participation history', async function () {
            var count = async (specialFilters) => (
                (await search.call(this, specialFilters)).recordsCount
            );
            expect(await count({
                isCanceled: 'only-true',
                subjectIds: [ '64d42dcb443aa279ca4caeea' ]
            })).to.eql(1);
            expect(await count({
                isCanceled: 'only-true',
                subjectIds: [ '64d42dca443aa279ca4caec0' ]
            })).to.eql(0);
        });
    });
});
