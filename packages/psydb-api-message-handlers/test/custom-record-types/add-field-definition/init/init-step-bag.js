'use strict';
var { BaselineDeltas } = require('@mpieva/psydb-mocha-baseline-deltas');

var INIT_STEP_BAG = (options = {}) => async function () {
    var { dumps = [ 'init-minimal' ] } = options;
    this.bag = {};
        
    var ids = await this.restore(dumps, { gatherIds: true });
    var db = this.getDbHandle();
    
    var login = await this.createFakeLogin({ email: 'root@example.com' });
    var [ send ] = this.createMessenger({ ...login });
    
    var deltas = BaselineDeltas.Multi([ 'crt', 'helperSet' ]);
    deltas.update = async () => {
        deltas.crt.push(
            await this.fetchAllRecords('customRecordType'),
        );
        deltas.helperSet.push(
            await this.fetchAllRecords('helperSet'),
        );
    }
    deltas.findEntry = (subset, filterOrId) => {
        if (!/[a-f0-9]/.test(String(filterOrId))) {
            throw new Error('not implemented');
        }
        else {
            var records = deltas[subset].getCurrent_RAW();
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
