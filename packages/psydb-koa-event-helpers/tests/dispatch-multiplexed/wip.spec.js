'use strict';
var { BaselineDeltas } = require('@mpieva/psydb-mocha-baseline-deltas');
var { dispatchMultiplexed } = require('../../run-context-fns');

describe('run-context-fns/dispatch-multiplexed', function () {
    var db, ids, context, now;
    beforeEach(async function () {
        //ids = await this.restore([
        //    '2024-09-26__0717'
        //], { gatherIds: true });

        now = new Date();
        db = this.getDbHandle();
        context = this.createEngineContext({ now });

        await this.wipeDB();
    });
    
    // NOTE: dispatch multiplexed can not create new channels
    it('does the thing (root-channel)', async function () {
        var channelIds = [ 10, 20, 30 ];

        var deltas = BaselineDeltas();
        deltas.push(await this.aggregateAll([ 'foo', 'rohrpostEvents' ]));

        await db.collection('foo').insertMany([
            ...channelIds.map(it => ({ _id: it }))
        ]);

        await dispatchMultiplexed(context, [{
            collection: 'foo', channelIds,
            type: 'CREATE', payload: { $set: { 'state.bar': 42 }}
        }]);
        
        deltas.push(await this.aggregateAll([ 'foo', 'rohrpostEvents' ]));
      
        var expected = {};
        for (var [ix, it] of channelIds.entries()) {
            expected[`/foo/${ix}`] = {
                '_rohrpostMetadata': {
                    'updatedAt': now,
                    'lastKnownSessionId': BaselineDeltas.AnyObjectId(),
                    'lastKnownEventId': BaselineDeltas.AnyObjectId(),
                    'eventIds/0': BaselineDeltas.AnyObjectId(),
                    'unprocessedEventIds': [],
                },
                '_id': it,
                'state/bar': 42,
            }
            expected[`/rohrpostEvents/${ix}`] = {
                '_id': BaselineDeltas.AnyObjectId(),
                'collectionName': 'foo',
                'channelId': it,
                'timestamp': now,
                'correlationId': 'corr_1010101',
                'sessionId': BaselineDeltas.AnyObjectId(),
                'message': {
                    'type': 'CREATE',
                    'personnelId': 'staff_1010101',
                    'payload': { '~1$set': { '~1state~1bar': 42 }}
                }
            }
        }

        deltas.test({ expected, asFlatEJSON: true });
    });
    
    // NOTE: dispatch multiplexed can not create new channels
    it('does the thing (sub-channel)', async function () {
        var channelIds = [ 10, 20, 30 ];

        var deltas = BaselineDeltas();
        deltas.push(await this.aggregateAll([ 'foo', 'rohrpostEvents' ]));

        await db.collection('foo').insertMany([
            ...channelIds.map(it => ({ _id: it }))
        ]);

        await dispatchMultiplexed(context, [{
            collection: 'foo', channelIds, subChannelKey: 'sc',
            type: 'CREATE', payload: { $set: { 'sc.state.bar': 42 }}
        }]);
        
        deltas.push(await this.aggregateAll([ 'foo', 'rohrpostEvents' ]));
      
        var expected = {};
        for (var [ix, it] of channelIds.entries()) {
            expected[`/foo/${ix}`] = {
                'sc/_rohrpostMetadata': {
                    'subChannelKey': 'sc',
                    'updatedAt': now,
                    'lastKnownSessionId': BaselineDeltas.AnyObjectId(),
                    'lastKnownEventId': BaselineDeltas.AnyObjectId(),
                    'eventIds/0': BaselineDeltas.AnyObjectId(),
                    'unprocessedEventIds': [],
                },
                '_id': it,
                'sc/state/bar': 42,
            }
            expected[`/rohrpostEvents/${ix}`] = {
                '_id': BaselineDeltas.AnyObjectId(),
                'collectionName': 'foo',
                'channelId': it,
                'subChannelKey': 'sc',
                'timestamp': now,
                'correlationId': 'corr_1010101',
                'sessionId': BaselineDeltas.AnyObjectId(),
                'message': {
                    'type': 'CREATE',
                    'personnelId': 'staff_1010101',
                    'payload': { '~1$set': { '~1sc~1state~1bar': 42 }}
                }
            }
        }

        deltas.test({ expected, asFlatEJSON: true });
    });
    
    // NOTE: dispatch multiplexed can not create new channels
    it('does the thing (root-channel; no-unlock)', async function () {
        var channelIds = [ 10, 20, 30 ];

        var deltas = BaselineDeltas();
        deltas.push(await this.aggregateAll([ 'foo', 'rohrpostEvents' ]));

        await db.collection('foo').insertMany([
            ...channelIds.map(it => ({ _id: it }))
        ]);

        await dispatchMultiplexed(context, [{
            collection: 'foo', channelIds,
            type: 'CREATE', payload: { $set: { 'state.bar': 42 }},
            doUnlock: false
        }]);
        
        deltas.push(await this.aggregateAll([ 'foo', 'rohrpostEvents' ]));
      
        var expected = {};
        for (var [ix, it] of channelIds.entries()) {
            expected[`/foo/${ix}`] = {
                '_rohrpostMetadata': {
                    'updatedAt': now,
                    'lastKnownSessionId': BaselineDeltas.AnyObjectId(),
                    'lastKnownEventId': BaselineDeltas.AnyObjectId(),
                    'eventIds/0': BaselineDeltas.AnyObjectId(),
                    'unprocessedEventIds/0': BaselineDeltas.AnyObjectId(),
                },
                '_id': it,
                'state/bar': 42,
            }
            expected[`/rohrpostEvents/${ix}`] = {
                '_id': BaselineDeltas.AnyObjectId(),
                'collectionName': 'foo',
                'channelId': it,
                'timestamp': now,
                'correlationId': 'corr_1010101',
                'sessionId': BaselineDeltas.AnyObjectId(),
                'message': {
                    'type': 'CREATE',
                    'personnelId': 'staff_1010101',
                    'payload': { '~1$set': { '~1state~1bar': 42 }}
                }
            }
        }

        deltas.test({ expected, asFlatEJSON: true });
    });
});
