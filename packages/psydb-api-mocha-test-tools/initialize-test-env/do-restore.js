'use strict';
var restore = require('@cdxoo/mongodb-restore');
var fixtures = require('@mpieva/psydb-fixtures');
var { arrify } = require('@mpieva/psydb-core-utils');

var doRestore = async function (fixtureNames, options = {}) {
    var { client, dbName, dbHandle } = this.context.mongo;
    var { gatherIds } = options;
    
    fixtureNames = arrify(fixtureNames);
    
    var sharedBag = {
        // NOTE: never restore to local connection
        con: client,
        database: dbName,
    }

    var ix = 0;
    for (var thatFixtureName of fixtureNames) {
        var path = fixtures.get(thatFixtureName, { db: true });
        
        var sharedBag = {
            // NOTE: never restore to local connection
            con: client,
            database: dbName,
            
            clean: ix === 0,
            onCollectionExists: ix === 0 ? 'throw' : 'overwrite',
            from: path,
        }
        
        await restore.database({ ...sharedBag });
        ix += 1;
    }

    if (gatherIds) {
        return await this.gatherLabeledIds();
    }
    else {
        return dbHandle;
    }
};

module.exports = doRestore;
