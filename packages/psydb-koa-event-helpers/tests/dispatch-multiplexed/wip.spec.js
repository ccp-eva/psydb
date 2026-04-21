'use strict';
var { BaselineDeltas } = require('@mpieva/psydb-mocha-baseline-deltas');
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');
var { ObjectId } = require('@mpieva/psydb-mongo-adapter');

var { dispatchMultiplexed } = require('../../run-context-fns');

describe('run-context-fns/dispatch-multiplexed', function () {
    var db, ids, context;
    beforeEach(async function () {
        //ids = await this.restore([
        //    '2024-09-26__0717'
        //], { gatherIds: true });

        db = this.getDbHandle();
        context = this.createEngineContext();
    });

    it('does the thing (root-channel)', async function () {
        var deltas = BaselineDeltas();
        deltas.push(await this.aggregateAll([ 'foo', 'rohrpostEvents' ]));

        await dispatchMultiplexed(context, [{
            collection: 'foo', channelIds: [ 10,20,30 ],
            type: 'CREATE', payload: { $set: { state: { bar: 42 }}}
        }]);
        
        deltas.push(await this.aggregateAll([ 'foo', 'rohrpostEvents' ]));
        console.ejson(deltas.getCurrent());
       
        var sharedFoo = {
            '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta()
        };
        deltas.test({ expected: {
            '/foo/0': { ...sharedFoo, '_id': 10, 'state/bar': 42 },
            '/foo/1': { ...sharedFoo, '_id': 20, 'state/bar': 42 },
            '/foo/2': { ...sharedFoo, '_id': 30, 'state/bar': 42 },
        }, asFlatEJSON: true });
    });
});
