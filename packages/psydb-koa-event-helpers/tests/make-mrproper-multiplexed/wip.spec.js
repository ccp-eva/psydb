'use strict';
var { BaselineDeltas } = require('@mpieva/psydb-mocha-baseline-deltas');
var { dispatch, makeMrproperMultiplexed } = require('../../run-context-fns');

describe('run-context-fns/make-mrproper-multiplexed', function () {
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
        deltas.push({
            ...await this.aggregateAll([ 'foo', 'rohrpostEvents' ]),
            'mrproperEvent': undefined
        });
        //console.ejson(deltas.getCurrent());

        var now = new Date('2050-01-01T00:00:00.000Z');
        await makeMrproperMultiplexed(context, [{
            collection: 'foo', channelIds: [ 10 ], now
        }]);
        
        var updated = await this.aggregateAll([ 'foo', 'rohrpostEvents' ]);
        var mrproperEvent = updated.rohrpostEvents.splice(-1)[0];
        deltas.push({ ...updated, mrproperEvent });
      
        var expected = {};
        expected[`/foo`] = [];
        expected[`/rohrpostEvents/0`] = {
            'message/payload': BaselineDeltas.DeletedValue(),
            //'additionalChannelProps': BaselineDeltas.DeletedValue(),
        }
        expected[`/rohrpostEvents/1`] = {
            'message/payload': BaselineDeltas.DeletedValue(),
        }
        expected[`/rohrpostEvents/2`] = BaselineDeltas.DeletedValue();
        expected[`/rohrpostEvents/3`] = BaselineDeltas.DeletedValue();

        expected[`/mrproperEvent`] = {
            '_id': BaselineDeltas.AnyObjectId(),
            'collectionName': 'foo',
            'channelId': 10,
            'timestamp': now,
            'correlationId': 'corr_1010101',
            'sessionId': BaselineDeltas.AnyObjectId(),
            'message': {
                'type': 'MAKE_MRPROPER',
                'personnelId': 'staff_1010101',
            }
        }

        deltas.test({ expected, asFlatEJSON: true });
    });
    
});
