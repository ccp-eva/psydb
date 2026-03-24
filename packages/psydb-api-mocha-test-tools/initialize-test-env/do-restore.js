'use strict';
var restore = require('@cdxoo/mongodb-restore');
var fixtures = require('@mpieva/psydb-fixtures');

var doRestore = async function (fixtureName, options = {}) {
    // NOTE: never restore to local connection
    var { client, dbName, dbHandle } = this.context.mongo;
    var { gatherIds } = options;

    var out = await restore.database({
        con: client,
        database: dbName,
        clean: true,
        from: fixtures.get(fixtureName, { db: true })
    })

    if (gatherIds) {
        return await this.gatherLabeledIds();
    }
    else {
        return dbHandle;
    }
};

module.exports = doRestore;
