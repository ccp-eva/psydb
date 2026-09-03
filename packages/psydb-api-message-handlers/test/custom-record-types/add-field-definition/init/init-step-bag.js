'use strict';
var { BaselineDeltas } = require('@mpieva/psydb-mocha-baseline-deltas');

var INIT_STEP_BAG = (options = {}) => async function () {
    var { dumps = [ 'init-minimal' ] } = options;
    this.bag = {};
        
    var ids = await this.restore(dumps, { gatherIds: true });
    var db = this.getDbHandle();
    
    var login = await this.createFakeLogin({ email: 'root@example.com' });
    var [ send ] = this.createMessenger({ ...login });
    
    var deltas = BaselineDeltas();
    deltas.update = async () => {
        deltas.push(
            await this.fetchAllRecords('customRecordType'),
        );
    }
    
    await deltas.update();
    
    this.bag.db = db;
    this.bag.ids = ids;
    this.bag.send = send;
    this.bag.deltas = deltas;
}

module.exports = INIT_STEP_BAG;
