'use strict';
var { BaselineDeltas } = require('@mpieva/psydb-mocha-baseline-deltas');
var { dispatch, makeClean } = require('../../run-context-fns');

describe('run-context-fns/make-clean', function () {
    var db, ids, context;
    beforeEach(async function () {
        db = this.getDbHandle();
        context = this.createEngineContext();

        await this.wipeDB();
    });
    
    it('does the thing', async function () {
        await dispatch(context, [{
            collection: 'foo', channelId: 10,
            subChannelKey: 'gdpr', isNew: true,
            extraCreateProps: { _createProp: 'abc' },
            payload: { '$set': { 'gdpr.state.gdprfoo': 'gdpr-content' }},
        }]);
        await dispatch(context, [{
            collection: 'foo', channelId: 10,
            subChannelKey: 'scientific',
            extraCreateProps: { _createProp: 'abc' },
            payload: { '$set': { 'gdpr.state.scifoo': 'sci-content' }},
        }]);

        await dispatch(context, [{
            collection: 'foo', channelId: 10, subChannelKey: 'gdpr',
            payload: { '$set': { 'gdpr.state.gdprfoo_2': 'gdpr-content-2' }},
        }]);
        await dispatch(context, [{
            collection: 'foo', channelId: 10, subChannelKey: 'scientific',
            payload: { '$set': { 'gdpr.state.scifoo_2': 'sci-content_2' }},
        }]);

        var deltas = BaselineDeltas();
        deltas.push(await this.aggregateAll([ 'foo', 'rohrpostEvents' ]));

        var now = new Date('2050-01-01T00:00:00.000Z');
        await makeClean(context, [{
            collection: 'foo', channelId: 10, subChannelKey: 'gdpr', now
        }]);
        
        deltas.push(await this.aggregateAll([ 'foo', 'rohrpostEvents' ]));
      
        var expected = {};
        expected[`/foo/0`] = {
            'gdpr/_rohrpostMetadata': {
                'updatedAt': now,
                'lastKnownSessionId': BaselineDeltas.AnyObjectId(),
                'lastKnownEventId': BaselineDeltas.AnyObjectId(),
                'eventIds/0': BaselineDeltas.AnyObjectId(),
                'eventIds/1': BaselineDeltas.AnyObjectId(),
                'eventIds/2': BaselineDeltas.AnyObjectId(),
                'EXECUTED_MAKE_CLEAN': true,
            },
            'gdpr/state': '[[REDACTED]]',
        }
        expected[`/rohrpostEvents/0`] = {
            'message': { 'payload': '[[REDACTED]]' }
        }
        expected[`/rohrpostEvents/2`] = {
            'message': { 'payload': '[[REDACTED]]' }
        }
        expected[`/rohrpostEvents/4`] = {
            '_id': BaselineDeltas.AnyObjectId(),
            'collectionName': 'foo',
            'channelId': 10,
            'subChannelKey': 'gdpr',
            'timestamp': now,
            'correlationId': 'corr_1010101',
            'sessionId': BaselineDeltas.AnyObjectId(),
            'message': {
                'type': 'MAKE_CLEAN',
                'personnelId': 'staff_1010101',
                'payload': { '~1$set': {
                    '~1gdpr~1state': '[[REDACTED]]',
                    '~1gdpr~1_rohrpostMetadata~1EXECUTED_MAKE_CLEAN': true,
                }}
            }
        }

        deltas.test({ expected, asFlatEJSON: true });
    });
    
});
