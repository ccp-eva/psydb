'use strict';
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');
var { BaselineDeltas } = require('@mpieva/psydb-mocha-baseline-deltas');

var RootHandler = require('../../../src/');

describe('experiment/remove-subject-manual', function () {
    var db;
    beforeEach(async function () {
        await this.restore('tiny_2026-02-02__0647__an-away-team-experiment');
        db = this.getDbHandle();
    });

    it('should mark as canceled when subject list is empty', async function () {
        var login = await this.createFakeLogin({ email: 'root@example.com' });
        var [ sendMessage ] = this.createMessenger({ RootHandler, ...login });
        
        var deltas = BaselineDeltas();
        deltas.push( await this.fetchAllRecords('experiment') );

        await sendMessage({
            type: 'experiment/remove-subject-manual',
            timezone: 'Europe/Berlin',
            payload: {
                experimentId: '698024cd9a385ad40f830509',
                subjectId: '64d42dcb443aa279ca4caeea',
            },
        });
        
        deltas.push( await this.fetchAllRecords('experiment') );
        deltas.test({ expected: {
            '/0/_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
            '/0/state/selectedSubjectIds/1': BaselineDeltas.DeletedValue(),
            '/0/state/subjectData/1': BaselineDeltas.DeletedValue(),
        }, asFlatEJSON: true });
        
        await sendMessage({
            type: 'experiment/remove-subject-manual',
            timezone: 'Europe/Berlin',
            payload: {
                experimentId: '698024cd9a385ad40f830509',
                subjectId: '64d42dcb443aa279ca4caee6',
            },
        });
        
        deltas.push( await this.fetchAllRecords('experiment') );
        deltas.test({ expected: {
            '/0/_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
            '/0/state/selectedSubjectIds': [],
            '/0/state/subjectData': [],
            '/0/state/isCanceled': true,
        }, asFlatEJSON: true });
    })
        
    it('should mark as canceled when all subjects left have been unparticipated', async function () {
        var login = await this.createFakeLogin({ email: 'root@example.com' });
        var [ sendMessage ] = this.createMessenger({ RootHandler, ...login });
        
        var deltas = BaselineDeltas();
        deltas.push( await this.fetchAllRecords('experiment') );

        await sendMessage({
            type: 'experiment/remove-subject',
            timezone: 'Europe/Berlin',
            payload: {
                experimentId: '698024cd9a385ad40f830509',
                subjectId: '64d42dcb443aa279ca4caeea',
                unparticipateStatus: 'didnt-participate',
                subjectComment: 'something something',
                blockSubjectFromTesting: { shouldBlock: false },
            },
        });
        
        deltas.push( await this.fetchAllRecords('experiment') );
        console.ejson(deltas.getCurrent());
        deltas.test({ expected: {
            '/0/_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
            '/0/state/selectedSubjectIds/1': BaselineDeltas.DeletedValue(),
            '/0/state/subjectData/1': BaselineDeltas.DeletedValue(),
            // XXX: im not sure that this should delete the item
            // it curently only tracks the unparticipation in subjects
            // participation list
        }, asFlatEJSON: true });
        
        await sendMessage({
            type: 'experiment/remove-subject-manual',
            timezone: 'Europe/Berlin',
            payload: {
                experimentId: '698024cd9a385ad40f830509',
                subjectId: '64d42dcb443aa279ca4caee6',
            },
        });
        
        deltas.push( await this.fetchAllRecords('experiment') );
        deltas.test({ expected: {
            '/0/_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
            '/0/state/selectedSubjectIds': [],
            '/0/state/subjectData': [],
            '/0/state/isCanceled': true,
        }, asFlatEJSON: true });
    })

    it('should mark as postprocessed when all subjects left are prostprocessed', async function () {
        var login = await this.createFakeLogin({ email: 'root@example.com' });
        var [ sendMessage ] = this.createMessenger({ RootHandler, ...login });

        var deltas = BaselineDeltas();
        deltas.push( await this.fetchAllRecords('experiment') );

        await sendMessage({
            type: 'experiment/change-participation-status',
            timezone: 'Europe/Berlin',
            payload: {
                experimentId: '698024cd9a385ad40f830509',
                subjectId: '64d42dcb443aa279ca4caee6',
                participationStatus: 'participated',
            },
        });
        
        deltas.push( await this.fetchAllRecords('experiment') );
        deltas.test({ expected: {
            '/0/_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
            '/0/state/subjectData/0/participationStatus': 'participated',
            '/0/state/experimentOperatorIds/0': { $oid: '64d42dca443aa279ca4caec6' },
            '/0/state/labTeamColor': '#f772e5',
        }, asFlatEJSON: true });

        await sendMessage({
            type: 'experiment/remove-subject-manual',
            timezone: 'Europe/Berlin',
            payload: {
                experimentId: '698024cd9a385ad40f830509',
                subjectId: '64d42dcb443aa279ca4caeea',
            },
        });
        
        deltas.push( await this.fetchAllRecords('experiment') );
        deltas.test({ expected: {
            '/0/_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
            '/0/state/selectedSubjectIds/1': BaselineDeltas.DeletedValue(),
            '/0/state/subjectData/1': BaselineDeltas.DeletedValue(),
            '/0/state/isPostprocessed': true,
        }, asFlatEJSON: true });
    })
})
