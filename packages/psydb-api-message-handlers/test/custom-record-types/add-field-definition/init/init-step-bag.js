'use strict';
var { BaselineDeltas } = require('@mpieva/psydb-mocha-baseline-deltas');

var INIT_STEP_BAG = (options = {}) => async function () {
    var { trackedCollections = [], dumps = [ 'init-minimal' ] } = options;
    this.bag = {};
        
    var ids = await this.restore(dumps, { gatherIds: true });
    var db = this.getDbHandle();
    
    var login = await this.createFakeLogin({ email: 'root@example.com' });
    var [ send ] = this.createMessenger({ ...login });
 
    // NOTE: we rename customRecordType to crt due to length
    var deltas = BaselineDeltas.Multi([ ...trackedCollections ]);
    deltas.update = async () => {
        for (var it of trackedCollections) {
            deltas[it].push(await this.fetchAllRecords(
                it === 'crt' ? 'customRecordType' : it
            ));
        }
    }
    deltas.findEntry = (collection, filterOrId) => {
        if (!/[a-f0-9]/.test(String(filterOrId))) {
            throw new Error('not implemented');
        }
        else {
            var records = deltas[collection].getCurrent_RAW();
            var index = records.findIndex((it) => (
                String(it._id) === String(filterOrId)
            ));
            return [ index, records[index] ];
        }
    }
    
    await deltas.update();
    
    this.bag.db = db;
    this.bag.ids = ids;
    this.bag.send = send;
    this.bag.deltas = deltas;
}

module.exports = INIT_STEP_BAG;
